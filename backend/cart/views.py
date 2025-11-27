from decimal import Decimal, ROUND_HALF_UP

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
import uuid

from product.models import Product
from django.contrib.auth import get_user_model
from django.db import transaction
from order.models import Order, OrderItem, Payment
from activity.models import ActivityLog
from coupon.models import Coupon

User = get_user_model()


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


class DummyPaymentView(APIView):
    """A dummy payment endpoint that accepts payment details and returns a fake transaction id.

    This is intentionally simple: it does not process real payments. It validates
    required fields for the given payment method and returns a success response.
    """
    # require authentication to create order/payment
    permission_classes = [IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        data = request.data or {}
        payment_method = (data.get("payment_method") or "").lower()
        items = data.get("items", [])

        if not payment_method:
            return Response({"error": "payment_method is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Basic validation per method
        if payment_method in ["card", "mastercard", "visa"]:
            card_number = data.get("card_number")
            expiry = data.get("expiry")
            cvc = data.get("cvc")
            if not (card_number and expiry and cvc):
                return Response({"error": "card_number, expiry and cvc are required for card payments."}, status=status.HTTP_400_BAD_REQUEST)
        elif payment_method in ["nagad", "rocket", "bkash", "mobile"]:
            mobile_number = data.get("mobile_number")
            password = data.get("password")
            if not (mobile_number and password):
                return Response({"error": "mobile_number and password are required for mobile payments."}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": f"Unsupported payment method: {payment_method}"}, status=status.HTTP_400_BAD_REQUEST)

        if not items or not isinstance(items, list):
            return Response({"error": "items list is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Create order from items and store payment atomically
        user = request.user
        user_id = request.user.id
        user_instance = User.objects.get(pk=user_id)

        try:
            order = Order.objects.create(user=user_instance)
            total_price = Decimal('0.00')

            coupon_code = None

            for item in items:
                product_id = item.get("product_id")
                quantity = item.get("quantity", 1)

                coupon_code = item.get("coupon_code")

                if not product_id:
                    raise ValueError("product_id is required for each item")

                product = Product.objects.filter(id=product_id, is_active=True).first()
                if not product:
                    raise ValueError(f"Product {product_id} not found or inactive")

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

            # coupon validation (copied logic)
            payable_amount = total_price
            message = 'Order placed by user without billing address'

            if coupon_code:
                try:
                    coupon = Coupon.objects.get(code=coupon_code)
                    if coupon.is_valid():
                        coupon_discounted_price = coupon.apply_discount(total_price)
                        if coupon_discounted_price != 0:
                            coupon.used_count += 1
                            coupon.save()
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

            order.total_price = payable_amount
            order.save()

            # activity log
            ActivityLog.objects.create(
                action_type='order',
                order=order,
                action=message,
                performed_by=user_instance
            )

            # Generate transaction id
            txn_id = f"txn_{uuid.uuid4().hex[:12]}"

            # Create payment record
            payment = Payment.objects.create(
                order=order,
                user=user_instance,
                method=payment_method,
                transaction_id=txn_id,
                amount=order.total_price,
                payload=data,
                status='success'
            )

            return Response({
                "status": "success",
                "transaction_id": txn_id,
                "message": "Payment accepted (dummy), order created.",
                "order_id": order.id,
            }, status=status.HTTP_200_OK)

        except ValueError as e:
            # rollback due to transaction.atomic
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "Failed to process payment and create order.", "detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
