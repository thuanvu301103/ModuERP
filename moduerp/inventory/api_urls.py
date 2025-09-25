from django.urls import path, include
from rest_framework import routers
from . import views

app_name = "inventory_api"

router = routers.DefaultRouter()
router.register(r'uom-categories', views.UoMCategoryViewSet)
router.register(r'uom', views.UnitOfMeasureViewSet)
router.register(r'categories', views.ProductCategoryViewSet)
router.register(r'products', views.ProductTemplateViewSet)
router.register(r'variants', views.ProductVariantViewSet)

# URL patterns
urlpatterns = [
    # DRF API
    path("", include(router.urls)),
]