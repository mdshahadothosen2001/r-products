from django.urls import path

from rating.views import ProductReviewCreateView, ProductReviewListView


urlpatterns = [
    path('<int:order_id>/', ProductReviewListView.as_view(), name='product_reviews'),
    path('create/', ProductReviewCreateView.as_view(), name='create_review'),
]
