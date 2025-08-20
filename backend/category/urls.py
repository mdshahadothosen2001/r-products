from django.urls import path

from category.views import CategoryListView


urlpatterns = [
    path("", CategoryListView.as_view(), name="category-list"),
]
