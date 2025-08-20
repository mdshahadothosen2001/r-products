from django.contrib import admin
from django.utils.html import format_html

from product.models import Product


class ProductAdmin(admin.ModelAdmin):
    def thumbnail_tag(self, obj):
        if obj.thumbnail and obj.thumbnail.url:
            return format_html(
                '<img src="{}" width="50" height="50" style="object-fit:cover; border-radius:5px;" />',
                obj.thumbnail.url
            )
        return "No Image"
    thumbnail_tag.short_description = "Thumbnail"

    list_display = (
        "name",
        "category",
        "brand",
        "price",
        "discount",
        "discount_percent",
        "stock",
        "is_active",
        "is_featured",
        "is_best_selling",
        "thumbnail_tag",  
        "created_at",
    )

    list_display_links = ("name", "category", "brand")
    
    search_fields = ("name", "brand", "description", "detail")
    
    list_filter = ("category", "is_active", "is_featured", "is_best_selling")
    
    list_per_page = 25

    readonly_fields = ("created_at", "updated_at")


admin.site.register(Product, ProductAdmin)
