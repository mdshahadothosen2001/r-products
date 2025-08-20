from django.urls import path

from banner.views import BannerListAPIView


urlpatterns = [
    path("", BannerListAPIView.as_view(), name="banner-list"),
]
