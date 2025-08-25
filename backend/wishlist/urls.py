from django.urls import path

from wishlist.views import WishlistListView, WishlistAddView, WishlistDeleteView


urlpatterns = [
    path("", WishlistListView.as_view(), name="wishlist-list"),
    path("add", WishlistAddView.as_view(), name="wishlist-add"),
    path("<int:pk>", WishlistDeleteView.as_view(), name="wishlist-delete"),
]
