from django.urls import path

from rest_framework_simplejwt.views import TokenRefreshView

from user.views import CustomTokenObtainPairView, UserProfileView


urlpatterns = [
    path(route="token/", view=CustomTokenObtainPairView.as_view(), name="token"),
    path(route="token/refresh/", view=TokenRefreshView.as_view(), name="token_refresh"),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
]
