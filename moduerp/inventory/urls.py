from django.urls import path, include
from . import views

app_name = "inventory"

# URL patterns
urlpatterns = [
    # Django template / htmx views
    path("products/", views.product_list, name="product_list"),
    path("products/<int:pk>/", views.product_detail, name="product_detail"),
]