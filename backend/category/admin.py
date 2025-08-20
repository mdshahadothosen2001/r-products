from django.contrib import admin
from .models import Category

class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "priority", "is_active")
    list_display_links = ("name",)
    search_fields = ("name",)
    list_filter = ("is_active",)
    list_per_page = 25

admin.site.register(Category, CategoryAdmin)
