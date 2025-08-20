from rest_framework import serializers

from cart.models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source="product.name")
    product_price = serializers.ReadOnlyField(source="product.price")
    discounted_price = serializers.ReadOnlyField()
    total_price = serializers.ReadOnlyField()
    saved_money = serializers.ReadOnlyField()

    class Meta:
        model = CartItem
        fields = (
            "id",
            "product",
            "product_name",
            "product_price",
            "discounted_price",
            "quantity",
            "total_price",
            "saved_money",
        )


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_price = serializers.ReadOnlyField()
    total_saved = serializers.ReadOnlyField()
    total_items = serializers.ReadOnlyField()

    class Meta:
        model = Cart
        fields = (
            "id",
            "user",
            "items",
            "total_items",
            "total_price",
            "total_saved",
        )
        read_only_fields = ("user",)
