from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=120, unique=True)
    priority = models.PositiveSmallIntegerField(default=1)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name
