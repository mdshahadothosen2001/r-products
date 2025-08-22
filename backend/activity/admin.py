from django.contrib import admin

from activity.models import ActivityLog


@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'action_type', 'uid', 'action_summary', 'performed_by', 'timestamp')
    list_filter = ('action_type', 'performed_by')
    search_fields = ('action', 'uid', 'performed_by__username')
    ordering = ('-timestamp',)

    fieldsets = (
        (None, {
            'fields': ('action_type', 'uid', 'action', 'performed_by')
        }),
        ('Metadata', {
            'fields': ('timestamp',),
            'classes': ('collapse',)
        }),
    )

    readonly_fields = ('timestamp',)

    def action_summary(self, obj):
        return (obj.action[:60] + '...') if len(obj.action) > 60 else obj.action
    action_summary.short_description = "Action"
