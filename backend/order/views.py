from django.contrib.auth import get_user_model
from django.db import transaction
from django.shortcuts import get_object_or_404

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status

from order.models import Order, OrderItem
from product.models import Product
from order.serializers import OrderSerializer
from activity.models import ActivityLog

User = get_user_model()



class OrderDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        """
        Retrieve a single order with its items
        """
        try:
            order = Order.objects.get(pk=pk, user=request.user.id)
        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = OrderSerializer(order)
        return Response(serializer.data)
    

class OrderListCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user.id).order_by('-created_at')
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    @transaction.atomic
    def post(self, request):
        """
        Create Order from list of products with quantities
        Expected request.data:
        {
            "items": [
                {"product_id": 1, "quantity": 2},
                {"product_id": 3, "quantity": 1}
            ]
        }
        """
        items_data = request.data.get("items")
        if not items_data or not isinstance(items_data, list):
            return Response({"error": "items list is required"}, status=status.HTTP_400_BAD_REQUEST)

        user_id = 1 
        user_instance = User.objects.get(pk=user_id)  

       
        order = Order.objects.create(user=user_instance)
        total_price = 0
        order_items = []

        for item in items_data:
            
            product_id = item.get("product_id")
            quantity = item.get("quantity", 1)

            if not product_id:
                return Response({"error": "product_id is required for each item"}, status=status.HTTP_400_BAD_REQUEST)

            product = Product.objects.filter(id=product_id, is_active=True).first()
            if not product:
                return Response({"error": f"Product {product_id} not found or inactive"}, status=status.HTTP_404_NOT_FOUND)

            discounted_price = product.price - product.discount
            saved_amount = product.discount

            order_item = OrderItem.objects.create(
                order=order,
                product_id=product.id,
                product_name=product.name,
                price=product.price,
                discounted_price=discounted_price,
                saved_amount=saved_amount,
                quantity=quantity
            )

            total_price += order_item.discounted_price * quantity
            order_items.append(order_item)

        order.total_price = total_price
        order.save()

        # activity log add
        user = get_object_or_404(User, id=request.user.id)
        ActivityLog.objects.create(
            action_type='order',
            uid=order.id,
            action='Order placed by user without payment confirm',
            performed_by=user
        )
        return Response({
                "success": True,
                "message": "Successfully done",
                "order_id": order.id 
            }, status=status.HTTP_201_CREATED)



class OrderStatusUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, order_id):
        """
        Update order status without serializer
        PATCH data: {"status": "delivered"}
        """
        order = get_object_or_404(Order, id=order_id)

        if order.user != request.user:
            return Response({"error": "You cannot update this order."}, status=status.HTTP_403_FORBIDDEN)

        new_status = request.data.get("status")
        if not new_status:
            return Response({"error": "status field is required"}, status=status.HTTP_400_BAD_REQUEST)

        allowed_status = ["paid", "pending", "processing", "shipped" "delivered", "cancelled"]
        if new_status not in allowed_status:
            return Response({"error": f"status must be one of {allowed_status}"}, status=status.HTTP_400_BAD_REQUEST)

        order.status = new_status

        # activity log add
        status_messages = {
            "paid": "Payment confirmed.",
            "pending": "Order is pending.",
            "processing": "We are processing your order.",
            "shipped": "Order has been shipped.",
            "delivered": "Order has been delivered.",
            "cancelled": "Order has been cancelled."
        }
        user = get_object_or_404(User, id=request.user.id)        
        ActivityLog.objects.create(
            action_type='order',
            uid=order.id,
            action= status_messages.get(status, "Some action happed"),
            performed_by=user
        )

        order.save()

        return Response({"message": "Order status updated", "status": order.status}, status=status.HTTP_200_OK)


class OrderBillingView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, order_id):
        """
        Update order status without serializer
        PATCH data: {"status": "delivered"}
        """

        return Response({"success": True, "message": "Order status updated",}, status=status.HTTP_200_OK)
