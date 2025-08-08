from django.core.management.base import BaseCommand
from django.apps import apps


class Command(BaseCommand):
    help = "Показать примеры значений из всех строковых и ImageField полей во всех моделях."

    def add_arguments(self, parser):
        parser.add_argument(
            "--limit",
            type=int,
            default=5,
            help="Максимум значений для показа на каждое поле."
        )

    def handle(self, *args, **opts):
        limit = opts["limit"]
        found_any = False

        for Model in apps.get_models():
            string_fields = [
                f for f in Model._meta.fields
                if f.get_internal_type() in {"CharField", "TextField", "ImageField"}
            ]
            if not string_fields:
                continue

            for field in string_fields:
                # Берём уникальные непустые значения
                values = (
                    Model.objects
                    .values_list(field.name, flat=True)
                    .exclude(**{f"{field.name}__isnull": True})
                    .exclude(**{f"{field.name}": ""})
                    .distinct()[:limit]
                )

                if values:
                    found_any = True
                    self.stdout.write(f"\n=== {Model.__module__}.{Model.__name__}.{field.name} ===")
                    for v in values:
                        self.stdout.write(str(v))

        if not found_any:
            self.stdout.write("⚠️ Не найдено непустых строковых или ImageField значений.")
