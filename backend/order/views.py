from django.contrib.auth import get_user_model
from django.db import transaction
from django.shortcuts import get_object_or_404
import uuid

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status

from order.models import Order, OrderItem, Payment
from product.models import Product
from order.serializers import OrderSerializer
from activity.models import ActivityLog
from coupon.models import Coupon

User = get_user_model()



class OrderDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk):
        """
        Retrieve a single order with its items
        """
        try:
            pk = int(pk)
        except ValueError:
            return Response({}, status=status.HTTP_200_OK)

        if pk == 0:
            return Response({}, status=status.HTTP_200_OK)
        try:
            order = Order.objects.get(pk=pk)
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
        coupon_code = None

        if not items_data or not isinstance(items_data, list):
            return Response({"error": "items list is required"}, status=status.HTTP_400_BAD_REQUEST)

        user_id = request.user.id
        user_instance = User.objects.get(pk=user_id)  

       
        order = Order.objects.create(user=user_instance)
        total_price = 0
        order_items = []

        for item in items_data:
            
            product_id = item.get("product_id")
            quantity = item.get("quantity", 1)

            coupon_code = item.get("coupon_code")

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

        

        # coupon validation
        message = 'Order placed by user without billing address'
        payable_amount = total_price


        if coupon_code:
            try:
                coupon = Coupon.objects.get(code=coupon_code)
                if coupon.is_valid():
                    # Calculate discount using the model method
                    coupon_discounted_price = coupon.apply_discount(total_price)
                    if coupon_discounted_price != 0:
                        coupon.used_count += 1
                        
                        coupon.save()

                        # Store applied coupon and discount in order
                        order.applied_coupon = coupon_code
                        order.coupon_price = total_price - coupon_discounted_price
                        payable_amount = coupon_discounted_price

                        

                    if coupon_discounted_price == 0:
                        message = (
                            f"Order placed using coupon."
                            f"But coupon amount is bigger than product payable, so coupon not use. The order total ({int(total_price)}) BDT. "
                            f"Payable amount is capped at {int(payable_amount)} BDT without billing address."
                        )
                    else:
                        message = (
                            f"Order placed using coupon '{coupon_code}'. "
                            f"Coupon discount: {int(coupon_discounted_price)} BDT, "
                            f"Payable amount: {int(payable_amount)} BDT without billing address."
                        )

                
                else:
                    return Response({"error": "Coupon is invalid or expired"}, status=400)
            except Coupon.DoesNotExist:
                return Response({"error": "Coupon does not exist"}, status=404)

        # Save final payable amount
        order.total_price = payable_amount
        order.save()


        # activity log add
        user = get_object_or_404(User, id=request.user.id)
        ActivityLog.objects.create(
            action_type='order',
            order=order,
            action= message,
            performed_by=user
        )
        return Response({
                "success": True,
                "message": "Successfully done",
                "order_id": order.id 
            }, status=status.HTTP_201_CREATED)



class OrderStatusUpdateView(APIView):
    permission_classes = [AllowAny]

    def patch(self, request, order_id):
        """
        Update order status without serializer
        PATCH data: {"status": "delivered"}
        """
        order = get_object_or_404(Order, id=order_id)

        # if order.user != request.user:
        #     return Response({"error": "You cannot update this order."}, status=status.HTTP_403_FORBIDDEN)

        new_status = request.data.get("status")
        if not new_status:
            return Response({"error": "status field is required"}, status=status.HTTP_400_BAD_REQUEST)

        allowed_status = ["start", "address", "processing", "shipped" "delivered", "cancelled", "return"]
        if new_status not in allowed_status:
            return Response({"error": f"status must be one of {allowed_status}"}, status=status.HTTP_400_BAD_REQUEST)

        order.status = new_status

        # activity log add
        status_messages = {
            "start": "Needed Billing Information",
            "address": "Billing information given.",
            "pending": "Order is pending.",
            "processing": "We are processing your order.",
            "shipped": "Order has been shipped.",
            "delivered": "Order has been delivered.",
            "cancelled": "Order has been cancelled.",
            "return": "Order has been return from customer with policy."
        }
        
        user_id = order.user.id

        if new_status == "return":
            order.order_return_condition = False

        if new_status in allowed_status and new_status != "address":
            user = get_object_or_404(User, id=user_id)        
            ActivityLog.objects.create(
                action_type='order',
                order=order,
                action= status_messages.get(new_status, "Some updated"),
                performed_by=user
            )

        order.save()

        return Response({"message": "Order status updated", "status": order.status, "order_id": order.id}, status=status.HTTP_200_OK)


class OrderBillingView(APIView):
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request, order_id):
        """
        Update order billing info and handle payment.
        POST data: {
            "phone": "...",
            "first_name": "...",
            "last_name": "...",
            "address1": "...",
            "address2": "...",
            "city": "...",
            "postal_code": "...",
            "pay_now": true/false,
            // if pay_now is true:
            "payment_method": "card|nagad|rocket|bkash",
            // card: card_number, expiry, cvc, cardholder_name
            // mobile: mobile_number, password
        }
        """
        order = get_object_or_404(Order, id=order_id)

        required_fields = ["phone", "first_name", "last_name", "address1", "address2", "city", "postal_code"]

        # Check missing fields
        missing = [f for f in required_fields if f not in request.data or not request.data[f]]
        if missing:
            return Response(
                {"success": False, "message": f"Missing required fields: {', '.join(missing)}"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Update billing information
        order.receiver_phone = request.data["phone"]
        order.first_name = request.data["first_name"]
        order.last_name = request.data["last_name"]
        order.address_line_1 = request.data["address1"]
        order.address_line_2 = request.data["address2"]
        order.city = request.data["city"]
        order.postal_or_zip_code = request.data["postal_code"]

        user = get_object_or_404(User, id=request.user.id)        
        ActivityLog.objects.create(
            action_type='order',
            order=order,
            action=(
                "Billing Information added: "
                f"{request.data['first_name']} {request.data['last_name']}, "
                f"{request.data['phone']}, "
                f"{request.data['address1']}, "
                f"{request.data['address2']}, "
                f"{request.data['city']}, "
                f"{request.data['postal_code']}"
            ),
            performed_by=user
        )

        # Check if user wants to pay now
        pay_now = request.data.get("pay_now", False)

        if pay_now:
            # User wants to pay now - validate payment method and fields
            payment_method = (request.data.get("payment_method") or "").lower()
            
            if not payment_method:
                return Response(
                    {"success": False, "message": "payment_method is required when pay_now is true"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Validate payment fields based on method
            if payment_method == "card":
                card_number = request.data.get("card_number")
                expiry = request.data.get("expiry")
                cvc = request.data.get("cvc")
                cardholder_name = request.data.get("cardholder_name")
                if not (card_number and expiry and cvc):
                    return Response(
                        {"success": False, "message": "card_number, expiry and cvc are required for card payments"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            elif payment_method in ["nagad", "rocket", "bkash"]:
                mobile_number = request.data.get("mobile_number")
                password = request.data.get("password")
                if not (mobile_number and password):
                    return Response(
                        {"success": False, "message": "mobile_number and password are required for mobile payments"},
                        status=status.HTTP_400_BAD_REQUEST
                    )
            else:
                return Response(
                    {"success": False, "message": f"Unsupported payment method: {payment_method}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Create transaction id and payment record
            txn_id = f"txn_{uuid.uuid4().hex[:12]}"
            payment_payload = request.data.copy()

            Payment.objects.create(
                order=order,
                user=user,
                method=payment_method,
                transaction_id=txn_id,
                amount=order.total_price,
                payload=payment_payload,
                status='success'
            )

            # Update order status and payment type
            order.status = 'pending'
            order.payment_type = 'paid'
            order.save()

            # Activity log for payment
            ActivityLog.objects.create(
                action_type='payment',
                order=order,
                action=f"Payment received via {payment_method}. TXN: {txn_id}",
                performed_by=user
            )

            return Response(
                {
                    "success": True,
                    "message": "Order and payment confirmed successfully",
                    "order_id": order.id,
                    "transaction_id": txn_id,
                    "payment_method": payment_method
                },
                status=status.HTTP_200_OK
            )
        else:
            # Cash on delivery - no payment record needed
            order.status = 'pending'
            order.payment_type = 'cash_on_delivery'
            order.save()

            # Activity log for cash on delivery
            ActivityLog.objects.create(
                action_type='order',
                order=order,
                action="Order confirmed with Cash on Delivery",
                performed_by=user
            )

            return Response(
                {
                    "success": True,
                    "message": "Order confirmed with Cash on Delivery",
                    "order_id": order.id,
                    "payment_method": "cash_on_delivery"
                },
                status=status.HTTP_200_OK
            )
