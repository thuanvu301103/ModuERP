from django.core.management.base import BaseCommand
from inventory.models import UnitOfMeasure

class Command(BaseCommand):
    help = "Seed initial Units of Measure (UOM)"

    def handle(self, *args, **kwargs):
        uoms = [
            {"name": "Kilogram", "category": "Weight", "ratio": 1.0, "is_default": True},
            {"name": "Gram", "category": "Weight", "ratio": 0.001, "is_default": False},
            {"name": "Unit", "category": "Unit", "ratio": 1.0, "is_default": True},
            {"name": "Dozen", "category": "Unit", "ratio": 12.0, "is_default": False},
            {"name": "Liter", "category": "Volume", "ratio": 1.0, "is_default": True},
            {"name": "Milliliter", "category": "Volume", "ratio": 0.001, "is_default": False},
        ]

        for u in uoms:
            obj, created = UnitOfMeasure.objects.get_or_create(
                name=u["name"],
                defaults={
                    "category": u["category"],
                    "ratio": u["ratio"],
                    "is_default": u["is_default"],
                },
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Inventory - Created UOM: {obj.name}"))
            else:
                self.stdout.write(self.style.WARNING(f"Inventory - UOM already exists: {obj.name}"))

        self.stdout.write(self.style.SUCCESS("Inventory - ✅ UOM seeding completed."))
