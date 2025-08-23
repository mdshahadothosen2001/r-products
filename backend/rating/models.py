from django.db import models

from product.models import Product
from order.models import Order
from user.models import UserAccount


class ProductReview(models.Model):
    RATING_CHOICES = [(i, str(i)) for i in range(1, 6)]

    user = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    product_ids = models.CharField(max_length=500, null=True, blank=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    rating = models.IntegerField(choices=RATING_CHOICES)
    review = models.TextField(blank=True, null=True)

    have_product_ids = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)



    def __str__(self):
        return f"{self.user.name} - products {self.product_ids} - order {self.order} - rating {self.rating}"
