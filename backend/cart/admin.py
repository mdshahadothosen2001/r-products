from django.contrib import admin

from .models import Cart, CartItem


class CartItemInline(admin.TabularInline):
    model = CartItem
    extra = 1
    readonly_fields = ("discounted_price", "total_price", "saved_money")
    autocomplete_fields = ("product",)


@admin.register(Cart)
class CartAdmin(admin.ModelAdmin):
    list_display = ("user", "total_items", "total_price", "total_saved", "created_at", "updated_at")
    search_fields = ("user__phone_number", "user__email", "user__name")
    inlines = [CartItemInline]
    readonly_fields = ("total_items", "total_price", "total_saved")


@admin.register(CartItem)
class CartItemAdmin(admin.ModelAdmin):
    list_display = ("cart", "product", "quantity", "price", "discount", "discounted_price", "total_price", "saved_money")
    search_fields = ("product__name", "cart__user__phone_number")
    readonly_fields = ("discounted_price", "total_price", "saved_money")
