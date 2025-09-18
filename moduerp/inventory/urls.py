from django.urls import path, include
from rest_framework import routers
from . import views

app_name = "inventory"

router = routers.DefaultRouter()
router.register(r'uom', views.UnitOfMeasureViewSet)
router.register(r'categories', views.ProductCategoryViewSet)
router.register(r'products', views.ProductTemplateViewSet)
router.register(r'variants', views.ProductVariantViewSet)

# URL patterns
urlpatterns = [
    # Django template / htmx views
    path("products/", views.product_list, name="product_list"),
    path("products/<int:pk>/", views.product_detail, name="product_detail"),

    # DRF API
    #path("api/", include(router.urls)),
]