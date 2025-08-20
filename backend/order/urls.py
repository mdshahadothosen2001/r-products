from django.urls import path
from .views import OrderListCreateView, OrderStatusUpdateView

urlpatterns = [
    path('', OrderListCreateView.as_view(), name='order_list_create'),
    path('<int:order_id>/', OrderStatusUpdateView.as_view(), name='order_details'),
]
