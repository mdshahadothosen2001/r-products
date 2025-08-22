from django.urls import path

from activity.views import ActivityLogListAPIView


urlpatterns = [
    path('log/', ActivityLogListAPIView.as_view(), name='activity-log-list'),
]
