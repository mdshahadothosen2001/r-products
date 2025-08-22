from django.db import models

from user.models import UserAccount


class ActivityLog(models.Model):
    action_type = models.CharField(max_length=50, help_text="Like order for order activities")
    uid = models.PositiveIntegerField(help_text="ID of the target model (e.g., Order ID or Product ID)")
    action = models.CharField(max_length=255, help_text="Description of the action taken")
    timestamp = models.DateTimeField(auto_now_add=True)
    performed_by = models.ForeignKey(UserAccount, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.action_type}[{self.uid}] - {self.action} at {self.timestamp}"
