import math

from rest_framework import serializers

from product.models import Product


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    subcategory_name = serializers.CharField(source="subcategory.name", read_only=True)
    price_ceil = serializers.SerializerMethodField()
    discount_ceil = serializers.SerializerMethodField()
    discount_price = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = "__all__"
    
    def get_price_ceil(self, obj):
        return math.ceil(obj.price) if obj.price is not None else None
    
    def get_discount_ceil(self, obj):
        return math.ceil(obj.discount) if obj.discount is not None else None
    
    def get_discount_price(self, obj):
        p = math.ceil(obj.price) if obj.price is not None else 0
        d = math.ceil(obj.discount) if obj.discount is not None else None
        return p-d
