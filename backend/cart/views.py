from decimal import Decimal, ROUND_HALF_UP

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from product.models import Product


class CartAmountCalculateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        cart_items = request.data

        total_amount = Decimal('0.00')
        payable_amount = Decimal('0.00')
        saved_money = Decimal('0.00')

        for item in cart_items:
            product_id = item.get("product_id")
            quantity = item.get("quantity", 1)

            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                return Response(
                    {"error": f"Product with id {product_id} does not exist."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Convert discount_percent to Decimal
            discount_percent = Decimal(product.discount_percent) / Decimal('100')
            discounted_price = (product.price * (Decimal('1.00') - discount_percent)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

            total_item_price = (product.price * quantity).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
            discounted_item_price = (discounted_price * quantity).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
            saved_item = (total_item_price - discounted_item_price).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

            total_amount += total_item_price
            payable_amount += discounted_item_price
            saved_money += saved_item

        data = {
            "total_amount": total_amount,
            "payable_amount": int(payable_amount),
            "saved_money": saved_money
        }

        return Response(data, status=status.HTTP_200_OK)
