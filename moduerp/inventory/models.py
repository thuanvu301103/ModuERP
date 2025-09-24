from django.db import models
from django.contrib.postgres.fields import JSONField


class UoMCategory(models.Model):
    name = models.CharField(max_length=64, unique=True)

    def __str__(self):
        return self.name

class UnitOfMeasure(models.Model):
    UOM_TYPES = [
        ("reference", "Reference Unit"),    # Standard uom
        ("bigger", "Bigger than Reference"),
        ("smaller", "Smaller than Reference"),
    ]

    name = models.CharField(max_length=64, unique=True)
    category = models.ForeignKey(UoMCategory, on_delete=models.CASCADE, related_name="uoms")
    uom_type = models.CharField(max_length=16, choices=UOM_TYPES, default="reference")
    factor = models.FloatField(
        help_text="Conversion factor relative to the reference unit. "
                  "E.g., 0.001 for gram if kg is reference."
    )

    is_default = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} ({self.category.name})"

    class Meta:
        verbose_name = "Unit of Measure"
        verbose_name_plural = "Units of Measure"

class ProductCategory(models.Model):
    name = models.CharField(max_length=128)
    parent = models.ForeignKey("self", null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.name
    
    '''Example: Vegetables, Electronics, Clothes
    '''

class ProductTemplate(models.Model):
    TYPE_CHOICES = (
        ("stockable", "Stockable Product"), # Example: T-shirt
        ("consumable", "Consumable"),       # Example: Packing box
        ("service", "Service"),             # Example: Installation service
    )

    name = models.CharField(max_length=255)
    default_code = models.CharField(max_length=64, blank=True, null=True, unique=True)
    product_type = models.CharField(max_length=16, choices=TYPE_CHOICES, default="stockable")

    category = models.ForeignKey(ProductCategory, null=True, blank=True, on_delete=models.SET_NULL)

    uom = models.ForeignKey(UnitOfMeasure, related_name="uom_templates", on_delete=models.PROTECT)  # Available stock
    uom_po = models.ForeignKey(UnitOfMeasure, related_name="uom_po_templates", on_delete=models.PROTECT)    # Buy from supplier

    list_price = models.DecimalField(max_digits=12, decimal_places=2, default=0)    # Selling Price
    standard_price = models.DecimalField(max_digits=12, decimal_places=2, default=0)    # Cost Price

    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to="products/", null=True, blank=True)

    is_active = models.BooleanField(default=True)
    extra_attributes = models.JSONField(default=dict, null=True, blank=True)

    def __str__(self):
        return self.name

    '''Example: (
        name = T-shirt, 
        default_code = TSHIRT-001, 
        product_type = stockable, 
        category = Clothes, 
        uom = unit, 
        uom_po = unit,
        list_price = 10000,
        cost_price = 9000,
        description = T-shirt
        image = ...
        is_active = True,
        extra_attributes = ...
    )
    '''

# Extensible Attributes
class ProductAttribute(models.Model):
    name = models.CharField(max_length=128)

    def __str__(self):
        return self.name

class ProductAttributeValue(models.Model):
    attribute = models.ForeignKey(ProductAttribute, related_name="values", on_delete=models.CASCADE)
    name = models.CharField(max_length=128)

    def __str__(self):
        return f"{self.attribute.name}: {self.name}"

class ProductVariant(models.Model):
    template = models.ForeignKey(ProductTemplate, related_name="variants", on_delete=models.CASCADE)
    sku = models.CharField(max_length=64, blank=True, null=True, unique=True)
    barcode = models.CharField(max_length=128, blank=True, null=True, unique=True)

    attribute_values = models.ManyToManyField(ProductAttributeValue, related_name="variants")

    list_price = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    standard_price = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.template.name} [{', '.join(v.name for v in self.attribute_values.all())}]"

    '''Example:
        (T-shirt, TSHIRT-RED-M, barcode, [attributes...], 10000, 9000, True)
    '''