from django.contrib import admin
from .models import Category, ServiceListing

# Register your models here.
admin.site.register(Category)
admin.site.register(ServiceListing)