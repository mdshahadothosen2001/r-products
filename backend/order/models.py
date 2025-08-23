from django.db import models
from django.conf import settings


class Order(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name="orders"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(
        max_length=20, 
        choices=[
            ("start", "start"),
            ("address", "Billing Information"),
            ("pending", "Pending"),
            ("processing", "Processing"),
            ("shipped", "shipped"),
            ("delivered", "delivered"),
            ("cancelled", "Cancelled"),
        ], 
        default="start"
    )
    total_price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    receiver_phone = models.CharField(max_length=15, null=True, blank=True)
    first_name = models.CharField(max_length=100, null=True, blank=True)
    last_name = models.CharField(max_length=100, null=True, blank=True)
    address_line_1 = models.CharField(max_length=100, null=True, blank=True)
    address_line_2 = models.CharField(max_length=100, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    postal_or_zip_code = models.CharField(max_length=100, null=True, blank=True)


    is_review = models.BooleanField(default=False)


    def __str__(self):
        return f"Order #{self.id} - {self.user.phone_number}"


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order, 
        on_delete=models.CASCADE, 
        related_name="items"
    )
    product_id = models.IntegerField()
    product_name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    saved_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discounted_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)

    def get_total_price(self):
        return (self.discounted_price or 0) * self.quantity

    def __str__(self):
        return f"{self.product_name} (x{self.quantity})"
