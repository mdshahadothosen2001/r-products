from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name = models.CharField(max_length=120, unique=True)
    priority = models.PositiveSmallIntegerField(default=1)
    is_active = models.BooleanField(default=True)

    is_home_used = models.BooleanField(default=True)
    uid = models.CharField(max_length=120, unique=True, editable=False)

    def save(self, *args, **kwargs):
        if not self.uid:
            self.uid = slugify(self.name).replace("-", "_")
        super().save(*args, **kwargs)
    

    def __str__(self):
        return self.name
