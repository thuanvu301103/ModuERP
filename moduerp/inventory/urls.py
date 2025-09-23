from django.urls import path, include
from . import views

app_name = "inventory"

# URL patterns
urlpatterns = [
    path("products/", views.product_list, name="product_list"),
    path("products/new/", views.product_new, name="product_new"),
]