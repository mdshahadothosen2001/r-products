from django.utils import timezone

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from rest_framework import serializers
from user.models import UserAccount


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """This class is a custom serializer for obtaining authentication tokens"""

    @classmethod
    def get_token(cls, user):
        """Used to add additional data to the token response"""

        token = super().get_token(user)
        token["id"] = user.id
        token["email"] = user.email
        token["name"] = user.name
        token["current_datetime"] = timezone.now().isoformat()
        token["is_active"] = user.is_active

        return token
    

class UserAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserAccount
        fields = [
            "phone_number",
            "email",
            "name",
            "gender",
            "religion",
            "date_of_birth",
            "picture",
            "marital_status",
            "is_student",
            "is_active",
            "is_staff",
            "is_superuser",
            "created_at",
            "updated_at",
        ]
