from django.urls import path

from category.views import CategoryListView, SubCategoryListView


urlpatterns = [
    path("", CategoryListView.as_view(), name="category-list"),
    path("<int:category_id>/subcategories/", SubCategoryListView.as_view(), name="subcategory-list"),
]
