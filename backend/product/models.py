from django.db import models
from ckeditor.fields import RichTextField

from category.models import Category


class Product(models.Model):
    #major attributes
    name = models.CharField(max_length=255)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    brand = models.CharField(max_length=255, null=True, blank=True)
    description = RichTextField(null=True, blank=True)
    detail = RichTextField(null=True, blank=True)
    specifications = RichTextField(null=True, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    thumbnail = models.ImageField(upload_to="product_img/", blank=True, null=True)
    color = models.CharField(max_length=225, null=True, blank=True)
    size = models.CharField(max_length=32, null=True, blank=True)
    
    # manage info
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    discount_percent = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    stock = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=255, null=True, blank=True)


    # additional info
    made_in = models.CharField(max_length=36, null=True, blank=True)
    made_for = models.CharField(max_length=36, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    #accessable attributes
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=0)
    is_active = models.BooleanField(default=True)


    # Boolean flags for home sections
    is_best_selling = models.BooleanField(default=False)
    is_new_arrival = models.BooleanField(default=False)
    is_top_brand = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    is_free_delivery = models.BooleanField(default=False)
    is_trending = models.BooleanField(default=False)
    is_recently_viewed = models.BooleanField(default=False)
    is_just_for_you = models.BooleanField(default=False)
    

    def save(self, *args, **kwargs):
        if self.price > 0:
            self.discount_percent = (self.discount / self.price) * 100
        else:
            self.discount_percent = 0
        super().save(*args, **kwargs)


    def __str__(self):
        return f"{self.name}(price:{self.price},discount:{self.discount} or {self.discount_percent}"

