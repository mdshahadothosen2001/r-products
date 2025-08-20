from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from banner.models import Banner
from banner.serializers import BannerSerializer


class BannerListAPIView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        banners = Banner.objects.filter(is_active=True).order_by("-created_at")
        serializer = BannerSerializer(banners, many=True, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)
