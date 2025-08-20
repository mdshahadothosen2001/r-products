from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import generics, filters, permissions

from product.models import Product
from product.serializers import ProductSerializer
from common.custom_pagination import ProductPagination



class ProductListView(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True).order_by("-created_at")
    serializer_class = ProductSerializer
    pagination_class = ProductPagination
    permission_classes = [permissions.AllowAny] 

    
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["category", "is_best_selling"] 
    search_fields = ["name", "brand"] 



class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "id"   # or "pk"
