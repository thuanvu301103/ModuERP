from django.urls import path, include
from . import views

app_name = "inventory"

# URL patterns
urlpatterns = [
    # Products 
    path("products/", views.product_list, name="product_list"),
    path("products/new/", views.product_new, name="product_new"),
    # UoM
    path("uom/", views.uom_list, name="uom_list"),
    path("uom/new/", views.uom_new, name="uom_new")
]