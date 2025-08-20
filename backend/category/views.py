from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from category.models import Category
from category.serializers import CategorySerializer


class CategoryListView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        categories = Category.objects.filter(is_active=True).order_by("priority")
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
