from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status

from activity.models import ActivityLog
from activity.serializers import ActivityLogSerializer


class ActivityLogListAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        action_type = request.query_params.get('action_type')
        order_id = request.query_params.get('order_id')

        if not action_type or not order_id:
            return Response({'detail': 'action_type and order id are required'}, status=status.HTTP_400_BAD_REQUEST)

        logs = ActivityLog.objects.filter(action_type=action_type, order_id=order_id).order_by('-timestamp')
        serializer = ActivityLogSerializer(logs, many=True)
        return Response(serializer.data)
