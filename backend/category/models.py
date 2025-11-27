from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=120, unique=True)
    priority = models.PositiveSmallIntegerField(default=1)
    is_active = models.BooleanField(default=True)
    # allow admin to toggle whether category is shown in navbar
    is_display_nav = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class SubCategory(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="subcategories")
    name = models.CharField(max_length=120)
    priority = models.PositiveSmallIntegerField(default=1)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ("category", "name")

    def __str__(self):
        return f"{self.name} ({self.category.name})"
