from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import generics, filters, permissions
from rest_framework.response import Response

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
    lookup_field = "id"


class ProductForHomeView(generics.ListAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        list_type = request.query_params.get("list_type")

        # mapping: list_type -> (filters, ordering)
        filter_map = {
            "top_rated":       (None, "-rating"),
            "recent_selling":  (None, "-created_at"),
            "best_selling":    ({"is_best_selling": True}, "-name"),
            "new_arrival":     ({"is_new_arrival": True}, "-created_at"),
            "top_brand":       ({"is_top_brand": True}, "brand"),
            "new":             (None, "-created_at"),
            "trend":           ({"is_trending": True}, "-created_at"),
            "featured":        ({"is_featured": True}, "id"),
            "free_delivery":   ({"is_free_delivery": True}, "brand"),
            "recently_view":   ({"is_recently_viewed": True}, "-updated_at"),
            "just_you":        ({"is_just_for_you": True}, "-created_at"),
        }

        if list_type in filter_map:
            filters, order = filter_map[list_type]
            if filters:
                queryset = queryset.filter(**filters)
            queryset = queryset.order_by(order)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
