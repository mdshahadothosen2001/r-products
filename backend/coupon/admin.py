from django.contrib import admin

from coupon.models import Coupon


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = (
        'code', 
        'discount_type', 
        'discount_value', 
        'min_order_amount',
        'max_discount_amount', 
        'active', 
        'start_date', 
        'end_date', 
        'usage_limit', 
        'used_count'
    )
    list_filter = ('discount_type', 'active', 'start_date', 'end_date')
    search_fields = ('code',)
    readonly_fields = ('used_count', 'created_at', 'updated_at')
    ordering = ('-created_at',)
    
    fieldsets = (
        (None, {
            'fields': ('code', 'discount_type', 'discount_value')
        }),
        ('Usage & Limits', {
            'fields': ('min_order_amount', 'max_discount_amount', 'usage_limit', 'used_count')
        }),
        ('Status & Dates', {
            'fields': ('active', 'start_date', 'end_date')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
