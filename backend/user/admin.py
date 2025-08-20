from django.contrib import admin
from django.utils.html import format_html

from user.models import UserAccount


class UserAccountAdmin(admin.ModelAdmin):
    def picture_tag(self, obj):
        if obj.picture:
            return format_html('<img src="{}" width="50" height="50" style="object-fit:cover; border-radius:50%;" />', obj.picture.url)
        return "No Image"
    picture_tag.short_description = "Picture"

    list_display = (
        "phone_number",
        "email",
        "name",
        "picture_tag",
        "gender",
        "religion",
        "date_of_birth",
        "marital_status",
        "is_student",
        "is_active",
        "is_staff",
        "is_superuser",
        "created_at",
    )
    list_display_links = (
        "phone_number",
        "email",
        "name",
    )
    search_fields = (
        "phone_number",
        "email",
        "name",
        "religion",
    )
    list_filter = [
        "gender",
        "marital_status",
        "is_student",
        "is_active",
        "is_staff",
        "is_superuser",
    ]
    list_per_page = 25


admin.site.register(UserAccount, UserAccountAdmin)
