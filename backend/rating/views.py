from django.shortcuts import get_object_or_404, get_list_or_404
from django.db import IntegrityError

from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework import status

from rating.models import ProductReview
from rating.serializers import ProductReviewSerializer
from order.models import Order, OrderItem
from activity.models import ActivityLog
from user.models import UserAccount


class ProductReviewCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        order_id = request.data.get("order")
        if not order_id:
            return Response({"success": False, "message": "Missing Order information"}, status=status.HTTP_400_BAD_REQUEST)

        user = get_object_or_404(UserAccount, id=request.user.id)
        order = get_object_or_404(Order, id=order_id)
        order_items = OrderItem.objects.filter(order=order)

        product_ids = ",".join(str(item.product_id) for item in order_items)

        rating = request.data.get("rating")
        review = request.data.get("review")
        data = {
            "order": order_id,
            "product_ids": product_ids,
            "rating": rating,
            "review": review,
            "have_product_ids": True if product_ids else False,
        }

        serializer = ProductReviewSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=user)
            order.is_review = True
            order.save()

            ActivityLog.objects.create(
            action_type='order',
            order=order,
            action = (
                    "Review and rating added: "
                    f"{user.name},"
                    f"{rating} start and review is "
                    f"{review}, "
                ),
            performed_by=user
        )
            return Response({"success": True, "message": "Rating and Review submitted"}, status=status.HTTP_200_OK)

        return Response({"success": False, "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)




class ProductReviewListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, order_id):
        # Get all reviews for this order
        reviews = ProductReview.objects.filter(order_id=order_id).order_by('-created_at')
        serializer = ProductReviewSerializer(reviews, many=True)
        return Response(serializer.data)
