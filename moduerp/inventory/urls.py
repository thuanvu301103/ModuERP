from rest_framework import routers
from .views import UnitOfMeasureViewSet, ProductCategoryViewSet, ProductTemplateViewSet, ProductVariantViewSet

router = routers.DefaultRouter()
router.register(r'uom', UnitOfMeasureViewSet)
router.register(r'categories', ProductCategoryViewSet)
router.register(r'products', ProductTemplateViewSet)
router.register(r'variants', ProductVariantViewSet)

urlpatterns = router.urls