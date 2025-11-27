from django.contrib import admin
from django import forms
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import Group
from django.contrib.auth.forms import ReadOnlyPasswordHashField

from user.models import UserAccount


class UserCreationForm(forms.ModelForm):
	"""A form for creating new users. Includes all the required
	fields, plus a repeated password."""
	password1 = forms.CharField(label="Password", widget=forms.PasswordInput)
	password2 = forms.CharField(label="Password confirmation", widget=forms.PasswordInput)

	class Meta:
		model = UserAccount
		fields = ("phone_number", "email", "name")

	def clean_password2(self):
		# Check that the two password entries match
		p1 = self.cleaned_data.get("password1")
		p2 = self.cleaned_data.get("password2")
		if p1 and p2 and p1 != p2:
			raise forms.ValidationError("Passwords don't match")
		return p2

	def save(self, commit=True):
		# Save the provided password in hashed format
		user = super().save(commit=False)
		user.set_password(self.cleaned_data["password1"])
		if commit:
			user.save()
		return user


class UserChangeForm(forms.ModelForm):
	"""A form for updating users. Includes all the fields on
	the user, but replaces the password field with admin's
	password hash display field."""
	password = ReadOnlyPasswordHashField()

	class Meta:
		model = UserAccount
		fields = ("phone_number", "email", "name", "password", "is_active", "is_staff")

	def clean_password(self):
		# Regardless of what the user provides, return the initial value.
		# This is done here, so that the password hash is not changed in the admin form.
		return self.initial["password"]


class UserAccountAdmin(BaseUserAdmin):
	# The forms to add and change user instances
	form = UserChangeForm
	add_form = UserCreationForm

	# The fields to be used in displaying the User model.
	list_display = ("phone_number", "email", "name", "is_staff", "is_active")
	list_filter = ("is_staff", "is_active")
	fieldsets = (
		(None, {"fields": ("phone_number", "password")} ),
		("Personal info", {"fields": ("name", "email")} ),
		("Permissions", {"fields": ("is_staff", "is_active", "is_superuser", "groups", "user_permissions")} ),
	)
	# add_fieldsets is used when creating a user via admin
	add_fieldsets = (
		(None, {
			"classes": ("wide",),
			"fields": ("phone_number", "email", "name", "password1", "password2", "is_active", "is_staff")
		}),
	)
	search_fields = ("phone_number", "email", "name")
	ordering = ("phone_number",)
	filter_horizontal = ("groups", "user_permissions")

	def get_form(self, request, obj=None, **kwargs):
		"""Return a custom form for the admin change view.

		If the currently logged-in admin is a superuser, return a form
		that allows setting a new password directly (PasswordInput).
		Otherwise, use the read-only hashed password form.
		"""
		# Define a simple change form for superusers that allows setting password
		class SuperuserChangeForm(forms.ModelForm):
			password = forms.CharField(label="Password", widget=forms.PasswordInput, required=False,
									   help_text="Leave blank to keep the current password.")

			class Meta:
				model = UserAccount
				fields = ("phone_number", "email", "name", "password", "is_active", "is_staff")

			def save(self, commit=True):
				user = super().save(commit=False)
				raw = self.cleaned_data.get("password")
				if raw:
					user.set_password(raw)
				if commit:
					user.save()
				return user

		if request and request.user and request.user.is_superuser:
			# For superusers, allow the editable password field
			kwargs.setdefault("form", SuperuserChangeForm)
		else:
			kwargs.setdefault("form", self.form)

		return super().get_form(request, obj, **kwargs)


admin.site.unregister(Group)
admin.site.register(UserAccount, UserAccountAdmin)