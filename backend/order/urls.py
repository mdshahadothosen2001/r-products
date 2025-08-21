from django.urls import path
from .views import OrderListCreateView, OrderStatusUpdateView, OrderBillingView

urlpatterns = [
    path('', OrderListCreateView.as_view(), name='order_list_create'),
    path('<int:order_id>/', OrderStatusUpdateView.as_view(), name='order_details'),
    path('<int:order_id>/billing/', OrderBillingView.as_view(), name='order_billing'),
]
