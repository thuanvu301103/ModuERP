from django.urls import path, include
from . import views

app_name = "inventory"

# URL patterns
urlpatterns = [
    # Products 
    path("products/", views.product_list, name="product_list"),
    path("products/new/", views.product_new, name="product_new"),
    # UoM Catgories
    path("uom-categories/", views.uom_categories_list, name="uom_category_list"),
    path("uom-categories/new/", views.uom_categories_new, name="uom_category_new")
]