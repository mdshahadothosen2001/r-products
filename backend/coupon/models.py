from django.db import models
from django.utils import timezone


class Coupon(models.Model):
    CODE_TYPE = [
        ('percentage', 'Percentage'),
        ('fixed', 'Fixed Amount'),
    ]

    code = models.CharField(max_length=50, unique=True)
    discount_type = models.CharField(max_length=20, choices=CODE_TYPE, default='fixed')
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)
    min_order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    max_discount_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    active = models.BooleanField(default=True)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(null=True, blank=True)
    usage_limit = models.PositiveIntegerField(null=True, blank=True)  # total times this coupon can be used
    used_count = models.PositiveIntegerField(default=0)  # track usage

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.code} ({self.discount_type} - {self.discount_value})"

    def is_valid(self):
        """Check if coupon is valid (active, within date range, usage limit)"""
        now = timezone.now()
        if not self.active:
            return False
        if self.start_date and now < self.start_date:
            return False
        if self.end_date and now > self.end_date:
            return False
        if self.usage_limit is not None and self.used_count >= self.usage_limit:
            return False
        return True

    def apply_discount(self, amount):
        """Calculate discounted amount based on type"""
        if self.discount_type == 'percentage':
            discount = (self.discount_value / 100) * amount
            if self.max_discount_amount:
                discount = min(discount, self.max_discount_amount)
        else:  # fixed
            discount = self.discount_value
        return max(amount - discount, 0)
    
    def is_fully_applicable(self, amount):
        """
        Check if the coupon can be fully applied to the given amount.
        Returns:
            True  => discount <= amount (coupon fully usable)
            False => discount > amount (coupon bigger than amount)
        """
        if self.discount_type == 'percentage':
            discount = (self.discount_value / 100) * amount
            if self.max_discount_amount:
                discount = min(discount, self.max_discount_amount)
        else:  # fixed
            discount = self.discount_value

        # Check if discount exceeds amount
        return discount <= amount
