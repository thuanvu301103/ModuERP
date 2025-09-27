from django.core.management.base import BaseCommand
from inventory.models import UomCategory, UnitOfMeasure


def seed_uoms():
    data = {
        "Weight": [
            {"name": "Kilogram", "uom_type": "reference", "factor": 1.0, "is_default": True},
            {"name": "Gram", "uom_type": "smaller", "factor": 0.001, "is_default": False},
            {"name": "Tonne", "uom_type": "bigger", "factor": 1000.0, "is_default": False},
            {"name": "Pound", "uom_type": "smaller", "factor": 0.453592, "is_default": False},
        ],
        "Volume": [
            {"name": "Liter", "uom_type": "reference", "factor": 1.0, "is_default": True},
            {"name": "Milliliter", "uom_type": "smaller", "factor": 0.001, "is_default": False},
            {"name": "Cubic Meter", "uom_type": "bigger", "factor": 1000.0, "is_default": False},
        ],
        "Length": [
            {"name": "Meter", "uom_type": "reference", "factor": 1.0, "is_default": True},
            {"name": "Centimeter", "uom_type": "smaller", "factor": 0.01, "is_default": False},
            {"name": "Millimeter", "uom_type": "smaller", "factor": 0.001, "is_default": False},
            {"name": "Kilometer", "uom_type": "bigger", "factor": 1000.0, "is_default": False},
        ],
        "Time": [
            {"name": "Second", "uom_type": "reference", "factor": 1.0, "is_default": True},
            {"name": "Minute", "uom_type": "bigger", "factor": 60.0, "is_default": False},
            {"name": "Hour", "uom_type": "bigger", "factor": 3600.0, "is_default": False},
        ],
        "Unit": [
            {"name": "Piece", "uom_type": "reference", "factor": 1.0, "is_default": True},
            {"name": "Dozen", "uom_type": "bigger", "factor": 12.0, "is_default": False},
            {"name": "Pair", "uom_type": "bigger", "factor": 2.0, "is_default": False},
        ],
    }

    results = []
    for category_name, uoms in data.items():
        category_obj, _ = UomCategory.objects.get_or_create(name=category_name)
        for u in uoms:
            obj, created = UnitOfMeasure.objects.get_or_create(
                name=u["name"],
                category=category_obj,
                defaults={
                    "uom_type": u["uom_type"],
                    "factor": u["factor"],
                    "is_default": u["is_default"],
                },
            )
            results.append((obj, created, category_obj))
    return results


class Command(BaseCommand):
    help = "Seed common Units of Measure (UOM) with categories"

    def handle(self, *args, **kwargs):
        results = seed_uoms()
        for obj, created, category_obj in results:
            if created:
                self.stdout.write(
                    self.style.SUCCESS(f"✅ Created UOM: {obj.name} ({category_obj.name})")
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f"⚠️  UOM already exists: {obj.name} ({category_obj.name})")
                )

        self.stdout.write(self.style.SUCCESS("🎉 UOM seeding completed."))
