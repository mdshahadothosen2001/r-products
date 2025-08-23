from django.db import models

from user.models import UserAccount
from order.models import Order


class ActivityLog(models.Model):
    action_type = models.CharField(max_length=50, default="order")
    order = models.ForeignKey(Order, on_delete=models.CASCADE, null=True, blank=True, related_name="activities")
    action = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    performed_by = models.ForeignKey(UserAccount, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.action_type}[{self.order}] - {self.action} at {self.timestamp}"