from django.urls import path

from cart.views import CartAmountCalculateView


urlpatterns = [
    path("amount-calculate/", CartAmountCalculateView.as_view(), name="cart-amount-calculate"),
]
