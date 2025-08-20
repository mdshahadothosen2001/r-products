from django.db import models
from django.conf import settings

from product.models import Product


class Cart(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="cart"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Cart of {self.user.phone_number}"

    @property
    def total_items(self):
        return self.items.count()

    @property
    def total_price(self):
        return sum([item.total_price for item in self.items.all()])
    
    @property
    def total_saved(self):
        return sum([item.saved_money for item in self.items.all()])


class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart,
        on_delete=models.CASCADE,
        related_name="items"
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.PositiveIntegerField(default=0)
    discount = models.PositiveIntegerField(default=0)
    discount_percent = models.PositiveIntegerField(default=0)

    @property
    def discounted_price(self):
        """Price after discount (single item)"""
        price = self.price
        if self.discount > 0:
            price -= self.discount
        elif self.discount_percent > 0:
            price -= (price * self.discount_percent / 100)
        return price

    @property
    def total_price(self):
        """Total price for quantity"""
        return self.discounted_price * self.quantity

    @property
    def saved_money(self):
        """Total saved money for quantity"""
        return (self.price - self.discounted_price) * self.quantity

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"
