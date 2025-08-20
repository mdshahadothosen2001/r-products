from django.urls import path

from product.views import ProductListView, ProductDetailView, ProductForHomeView


urlpatterns = [
    path("", ProductListView.as_view(), name="product_list"),
    path("<int:id>/", ProductDetailView.as_view(), name="product_detail"),
    path("home/", ProductForHomeView.as_view(), name="product_for_home")
]
