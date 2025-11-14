from django.db.models import Count, Q
import random

from django_filters.rest_framework import DjangoFilterBackend

from rest_framework.views import APIView
from rest_framework import generics, filters, permissions
from rest_framework.response import Response

from product.models import Product
from product.serializers import ProductSerializer
from common.custom_pagination import ProductPagination



class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    pagination_class = ProductPagination
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["category", "is_best_selling"]
    search_fields = ["name", "brand"]

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True)
        
        # Filter by category
        category_id = self.request.query_params.get("category_id")
        subcategory_id = self.request.query_params.get("subcategory_id")
        # If subcategory filter is provided, prefer it (more specific). Otherwise fall back to category.
        if subcategory_id:
            queryset = queryset.filter(subcategory__id=subcategory_id)
        elif category_id:
            queryset = queryset.filter(category__id=category_id)
        
        # Apply sorting/filtering based on the 'filter' query param
        filter_type = self.request.query_params.get("filter")
        
        if filter_type == "price":
            queryset = queryset.order_by("price")  # Low to high
        elif filter_type == "rprice":
            queryset = queryset.order_by("-price")  # high to low
        elif filter_type == "newest":
            queryset = queryset.order_by("-created_at")  # Newest first
        elif filter_type == "sold":
            queryset = queryset.filter(is_best_selling=True).order_by("-created_at")  # Best selling
        elif filter_type == "tbrand":
            queryset = queryset.filter(is_top_brand=True).order_by("-created_at")  # Top Brand
        elif filter_type == "featured":
            queryset = queryset.filter(is_featured=True).order_by("-created_at")  # Featured
        elif filter_type == "viewed":
            queryset = queryset.filter(is_recently_viewed=True).order_by("-created_at")  # Recently Viewed
        elif filter_type == "delivery":
            queryset = queryset.filter(is_free_delivery=True).order_by("-created_at")  # Free Delivery

        return queryset



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

        # search from web search box
        q_from_search = request.query_params.get("q", None)
        
        if q_from_search:
            queryset = queryset.filter(
                Q(name__icontains=q_from_search) |
                Q(brand__icontains=q_from_search) |
                Q(category__name__icontains=q_from_search)
            )
            serializer = self.get_serializer(queryset, many=True)
            return self.get_paginated_response(serializer.data) if self.paginator else Response(serializer.data)
        

        
        # home page suggested list
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





class ProductRecommendationView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, pk=None):
        base_qs = Product.objects.filter(is_active=True)

        # Build candidate id list depending on whether a pk was provided
        candidate_ids = []
        product = None

        if pk:
            try:
                product = base_qs.get(pk=pk)
                # same subcategory (if available), brand, category
                if getattr(product, 'subcategory', None):
                    candidate_ids.extend(base_qs.filter(subcategory=product.subcategory).exclude(pk=product.pk).values_list('id', flat=True))
                candidate_ids.extend(base_qs.filter(brand=product.brand).exclude(pk=product.pk).values_list('id', flat=True))
                candidate_ids.extend(base_qs.filter(category=product.category).exclude(pk=product.pk).values_list('id', flat=True))

                # add high-signal products
                candidate_ids.extend(base_qs.filter(Q(is_best_selling=True) | Q(is_trending=True) | Q(is_featured=True)).exclude(pk=product.pk).values_list('id', flat=True))
            except Product.DoesNotExist:
                product = None

        if not candidate_ids:
            # no pk or no candidates from pk -> use global high-signal pool
            candidate_ids = list(base_qs.filter(Q(is_best_selling=True) | Q(is_trending=True) | Q(is_featured=True)).values_list('id', flat=True))

        # Fallback to all active product ids if still empty
        if not candidate_ids:
            candidate_ids = list(base_qs.values_list('id', flat=True))

        # Deduplicate ids while preserving order
        seen = set()
        deduped_ids = []
        for i in candidate_ids:
            if i not in seen:
                seen.add(i)
                deduped_ids.append(i)

        # Always shuffle deduped ids so responses vary across requests (even when <= sample size)
        random.shuffle(deduped_ids)

        # Randomize / sample to ensure varied responses across requests
        sample_size = min(20, len(deduped_ids))
        # Take the first `sample_size` after shuffle
        sampled_ids = deduped_ids[:sample_size]

        # Fetch products for sampled ids and preserve sampled order
        products_map = {p.id: p for p in base_qs.filter(id__in=sampled_ids)}
        ordered_products = [products_map[i] for i in sampled_ids if i in products_map]

        def reasons_for(p):
            reasons = []
            if product:
                if getattr(product, 'subcategory', None) and getattr(p, 'subcategory', None) and p.subcategory_id == product.subcategory_id:
                    reasons.append('same_subcategory')
                if p.brand == product.brand:
                    reasons.append('same_brand')
                if p.category_id == product.category_id:
                    reasons.append('same_category')
            # global signals
            if getattr(p, 'is_best_selling', False):
                reasons.append('best_selling')
            if getattr(p, 'is_trending', False):
                reasons.append('trending')
            if getattr(p, 'is_featured', False):
                reasons.append('featured')
            # derived signals
            try:
                if float(getattr(p, 'discount_percent', 0)) >= 20:
                    reasons.append('high_discount')
            except Exception:
                pass
            if getattr(p, 'rating', 0) >= 4.5:
                reasons.append('top_rated')
            return reasons or ['related']

        data = []
        for p in ordered_products:
            data.append({
                "id": p.id,
                "name": p.name,
                "brand": p.brand,
                "price": str(p.price),
                "price_ceil": round(p.price),
                "discount_percent": float(p.discount_percent),
                "rating": float(p.rating),
                "thumbnail": request.build_absolute_uri(p.thumbnail.url) if p.thumbnail else None,
                "reasons": reasons_for(p),
            })

        return Response(data)