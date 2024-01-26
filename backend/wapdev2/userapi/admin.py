from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User 


class UserAdminConfig(UserAdmin):
    # Fields that are shown in the list
    list_display=['email','username','first_name']
    # Searchable fields
    search_fields=['email','username']
    readonly_fields=['date_joined','last_login']
    # Fieldsets are grouped into blocks in the admin form.
    # This fieldsets controls the layout of the form shown for EXISTING users:
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal info', {'fields': ('username','first_name','last_name')}),
        ('Activity', {'fields': ('date_joined','last_login')}),
        ('Permissions', {'fields': ('is_active','is_staff','is_superuser')}),
    )
    # This fieldsets controls the layout of the form shown when creating a NEW user:
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2'),
        }),
    )

admin.site.register(User,UserAdminConfig)
