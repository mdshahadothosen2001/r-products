from django.contrib import admin
from django.utils.html import format_html

from banner.models import Banner


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "image_tag", "is_active", "created_at")
    list_filter = ("is_active", "created_at")
    search_fields = ("title",)

    def image_tag(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="80" height="50" style="object-fit:cover;"/>', obj.image.url)
        return "-"
    image_tag.short_description = "Image"
