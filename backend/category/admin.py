from django.contrib import admin
from .models import Category

class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "uid", "priority", "is_active", "is_home_used")
    readonly_fields = ("uid",)
    list_display_links = ("name", "is_active", "is_home_used")
    search_fields = ("name",)
    list_filter = ("is_active",)
    list_per_page = 25

admin.site.register(Category, CategoryAdmin)
