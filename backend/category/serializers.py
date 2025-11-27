from rest_framework import serializers

from category.models import Category, SubCategory


class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = ["id", "name"]


class CategorySerializer(serializers.ModelSerializer):
    subcategories = SubCategorySerializer(many=True, read_only=True)
    # expose model field so admin toggle is reflected via API
    is_display_nav = serializers.BooleanField(read_only=True)

    class Meta:
        model = Category
        fields = ["id", "name", "subcategories", "is_display_nav"]
