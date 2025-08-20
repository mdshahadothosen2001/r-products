from django.urls import path

from cart.views import CartDetailView, CartAddProductView, CartRemoveProductView


urlpatterns = [
    path("", CartDetailView.as_view(), name="cart_list_or_detail"),
    path("add/", CartAddProductView.as_view(), name="cart_add"),
    path("remove/", CartRemoveProductView.as_view(), name="cart_remove"),
    path("update/", CartRemoveProductView.as_view(), name="cart_update"),
]
