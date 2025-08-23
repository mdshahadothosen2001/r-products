from rest_framework import serializers

from rating.models import ProductReview


class ProductReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductReview
        fields = '__all__'
        read_only_fields = ['user', 'created_at']
