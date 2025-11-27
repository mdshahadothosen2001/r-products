from django.urls import path

from cart.views import CartAmountCalculateView, DummyPaymentView


urlpatterns = [
    path("amount-calculate/", CartAmountCalculateView.as_view(), name="cart-amount-calculate"),
    path("payment/", DummyPaymentView.as_view(), name="cart-payment"),
]
