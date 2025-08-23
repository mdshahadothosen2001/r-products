from rest_framework import serializers

from order.models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ('product_id', 'product_name', 'price', 'saved_amount', 'discounted_price', 'quantity')


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    sender_info = serializers.SerializerMethodField()
    receiver_info = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = (
            'id', 'user', 'status', 'total_price', 'created_at', 'items',
            'sender_info', 'receiver_info'
        )
        read_only_fields = ('user', 'total_price', 'created_at')

    def get_sender_info(self, obj):
        return {
            "name": "FemmeNest World",
            "email": "support@fnw.com",
            "phone": "01311111111"
        }

    def get_receiver_info(self, obj):
        return {
            "first_name": obj.first_name,
            "last_name": obj.last_name,
            "phone": obj.receiver_phone,
            "address_line_1": obj.address_line_1,
            "address_line_2": obj.address_line_2,
            "city": obj.city,
            "postal_or_zip_code": obj.postal_or_zip_code
        }
