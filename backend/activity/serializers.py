from rest_framework import serializers
from .models import ActivityLog

class ActivityLogSerializer(serializers.ModelSerializer):
    performed_by = serializers.CharField(source='performed_by.name', read_only=True)

    class Meta:
        model = ActivityLog
        fields = ['id', 'action_type', 'uid', 'action', 'timestamp', 'performed_by']
