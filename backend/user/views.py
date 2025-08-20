from django.shortcuts import get_object_or_404

from rest_framework_simplejwt.views import TokenObtainPairView

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from user.serializers import UserAccountSerializer, CustomTokenObtainPairSerializer
from user.models import UserAccount


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = get_object_or_404(UserAccount, pk=request.user.id)
        serializer = UserAccountSerializer(user)
        return Response(serializer.data)