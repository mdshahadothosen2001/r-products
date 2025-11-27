from django.contrib import admin

from category.models import Category, SubCategory


class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "priority", "is_active", "is_display_nav")
    list_display_links = ("name",)
    search_fields = ("name",)
    list_filter = ("is_active", "is_display_nav")
    list_per_page = 25


class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "category", "priority", "is_active",)
    list_display_links = ("name", "category", "is_active",)
    search_fields = ("name", "category__name",)
    list_filter = ("is_active", "category",)
    list_per_page = 25

admin.site.register(Category, CategoryAdmin)
admin.site.register(SubCategory, SubCategoryAdmin)