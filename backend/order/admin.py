from django.contrib import admin
from .models import Order, OrderItem
from activity.models import ActivityLog

# Existing OrderItemInline
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('product_id', 'product_name', 'price', 'saved_amount', 'discounted_price', 'quantity', 'get_total_price')
    can_delete = False

    def get_total_price(self, obj):
        return obj.get_total_price()
    get_total_price.short_description = 'Total Price'


# New Inline for ActivityLog
class ActivityLogInline(admin.TabularInline):
    model = ActivityLog
    extra = 1
    fields = ('action_type', 'action', 'performed_by', 'timestamp')
    readonly_fields = ('timestamp',)
    
    # Filter so that only activities related to this order show
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(action_type='order')
    
    def get_formset(self, request, obj=None, **kwargs):
        self.parent_object = obj  # store parent order instance
        return super().get_formset(request, obj, **kwargs)
    
    
    def save_new_instance(self, obj):
        obj.save()


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status', 'total_price', 'created_at')
    list_filter = ('status', 'created_at', 'updated_at')
    search_fields = ('user__username', 'id')
    inlines = [OrderItemInline, ActivityLogInline]  # OrderItem + ActivityLog
