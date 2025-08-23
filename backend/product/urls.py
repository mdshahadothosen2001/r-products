from django.urls import path
from product.views import ProductListView, ProductDetailView, ProductForHomeView, ProductRecommendationView

urlpatterns = [
    path("", ProductListView.as_view(), name="product_list"),
    path("<int:id>/", ProductDetailView.as_view(), name="product_detail"),
    path("home/", ProductForHomeView.as_view(), name="product_for_home"),
    path("product-based-recommendations/<int:pk>/", ProductRecommendationView.as_view(), name="product_based_recom"),
    path("product-based-recommendations/", ProductRecommendationView.as_view(), name="product_based_recom_list"),
]
