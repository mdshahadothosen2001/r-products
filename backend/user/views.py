from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

from rest_framework_simplejwt.views import TokenObtainPairView

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from rest_framework import status

from user.serializers import UserAccountSerializer, CustomTokenObtainPairSerializer
from user.models import UserAccount




UserAccount = get_user_model()

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


class UserProfileView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user = get_object_or_404(UserAccount, pk=request.user.id)
        serializer = UserAccountSerializer(user)
        return Response(serializer.data)

    def post(self, request):
        # Extract data from request
        phone_number = request.data.get("phone_number")
        password = request.data.get("password")
        name = request.data.get("name")

        if not phone_number or not password or not name:
            return Response(
                {"error": "Phone number, password, and name are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if user already exists
        if UserAccount.objects.filter(phone_number=phone_number).exists():
            return Response(
                {"error": "User with this phone number already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create user
        user = UserAccount.objects.create_user(
            phone_number=phone_number,
            password=password
        )
        user.name = name
        user.save()

        serializer = UserAccountSerializer(user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
