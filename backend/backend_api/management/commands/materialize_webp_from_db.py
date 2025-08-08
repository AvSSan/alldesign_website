import os
import re
import hashlib
from io import BytesIO
from pathlib import Path, PurePosixPath
from PIL import Image, ImageOps
from django.core.management.base import BaseCommand
from django.conf import settings
from django.apps import apps

# Какие модели/поля содержат пути к картинкам
MODEL_FIELDS = [
    ("backend_api.Testimonial", "image"),
    ("backend_api.ProjectImage", "image"),
    ("backend_api.ProjectImagePanorama", "image"),
    ("backend_api.Implementation", "main_image"),
    ("backend_api.ImplementationMedia", "file"),
    ("backend_api.ImplementationMedia", "thumbnail"),
]

IMG_EXTS = (".jpg", ".jpeg", ".png")
HASHED_WEBP_RE = re.compile(r"^(?P<stem>.+)_(?P<hash>[0-9a-f]{7})\.webp$", re.IGNORECASE)

# пресеты по папкам (длинная сторона + качество)
PRESETS = {
    "images/projects/":   dict(max_side=1920, quality=90),
    "images/panoramas/":  dict(max_side=2560, quality=90),
    "images/testimonials/": dict(max_side=800,  quality=85),
    "implementation/main/": dict(max_side=1920, quality=90),
    "implementation_media/thumbnails/": dict(max_side=800, quality=85),
    "implementation_media/": dict(max_side=1920, quality=90),
}

def pick_preset(rel_path: str):
    for prefix, cfg in PRESETS.items():
        if prefix in rel_path:
            return cfg
    return dict(max_side=1920, quality=85)

def md5_7(s: str) -> str:
    return hashlib.md5(s.encode("utf-8")).hexdigest()[:7]

def load_and_convert(src_path: Path, max_side: int, quality: int) -> bytes:
    img = Image.open(src_path)
    img = ImageOps.exif_transpose(img)
    if img.mode in ("P", "LA"):
        img = img.convert("RGBA" if "A" in img.mode else "RGB")
    if img.mode == "CMYK":
        img = img.convert("RGB")
    w, h = img.size
    longest = max(w, h)
    if longest > max_side:
        k = max_side / float(longest)
        img = img.resize((int(w * k), int(h * k)), Image.LANCZOS)
    has_alpha = (img.mode == "RGBA") or ("transparency" in img.info)
    img = img.convert("RGBA") if has_alpha else img.convert("RGB")
    out = BytesIO()
    img.save(out, format="WEBP", quality=quality, method=6)
    return out.getvalue()

class Command(BaseCommand):
    help = "Создаёт отсутствующие .webp файлы в media на основании текущих путей из БД (под нужные имена)."

    def add_arguments(self, parser):
        parser.add_argument("--dry-run", action="store_true", help="Только показать план, ничего не писать.")
        parser.add_argument("--force", action="store_true", help="Пересоздавать даже если .webp уже есть.")
        parser.add_argument("--prefer", choices=["png","jpg"], default=None,
                            help="Если оригинал и .png, и .jpg существуют без хэша — что предпочесть.")

    def handle(self, *args, **opts):
        dry = opts["dry_run"]
        force = opts["force"]
        prefer = opts["prefer"]
        media_root = Path(getattr(settings, "MEDIA_ROOT", "media")).resolve()

        created = 0
        existed = 0
        missing_src = 0
        mismatched = 0
        errors = 0

        for dotted, field in MODEL_FIELDS:
            app_label, model_name = dotted.split(".")
            Model = apps.get_model(app_label, model_name)

            qs = Model.objects.all()
            if model_name == "ImplementationMedia" and field == "file":
                qs = qs.filter(media_type="image")

            for obj in qs.iterator():
                val = getattr(obj, field, None)
                if not val:
                    continue

                dest_rel = PurePosixPath(str(val)).as_posix()
                dest_path = media_root / dest_rel
                cfg = pick_preset(dest_rel)

                # Если файл уже существует и не force — пропустим
                if dest_path.exists() and not force:
                    existed += 1
                    continue

                parent = dest_path.parent
                stem = dest_path.stem  # может быть с _abcdef1
                m = HASHED_WEBP_RE.match(dest_path.name)

                # Кандидаты источников
                candidates = []
                if m:
                    # имя с хэшем: попробуем найти исходник, у которого md5(path_with_ext) совпадает
                    base_stem = m.group("stem")  # имя до _hash
                    target_hash = m.group("hash")
                    for ext in IMG_EXTS:
                        cand = parent / f"{base_stem}{ext}"
                        if cand.exists():
                            rel_for_hash = (media_root / (dest_rel.rsplit("/",1)[0] + "/" + f"{base_stem}{ext}")).relative_to(media_root).as_posix()
                            if md5_7(rel_for_hash) == target_hash:
                                candidates = [cand]
                                break
                    if not candidates:
                        # ничего не совпало — исходник не найден/не совпал хэш
                        self.stdout.write(self.style.WARNING(
                            f"[MISS SRC/HASH] {dest_rel} — не нашли исходник с подходящим хэшем"
                        ))
                        missing_src += 1
                        continue
                else:
                    # имя без хэша: ищем любой base.{jpg/png}
                    base_stem = stem
                    found = []
                    for ext in IMG_EXTS:
                        cand = parent / f"{base_stem}{ext}"
                        if cand.exists():
                            found.append(cand)
                    if not found:
                        self.stdout.write(self.style.WARNING(
                            f"[MISS SRC] {dest_rel} — нет {base_stem}.jpg/.png"
                        ))
                        missing_src += 1
                        continue
                    # если оба формата есть — выберем по prefer, иначе первый попавшийся
                    if len(found) > 1 and prefer:
                        found.sort(key=lambda p: (p.suffix.lower() != f".{prefer}"))
                    candidates = [found[0]]

                src = candidates[0]
                try:
                    if dry:
                        self.stdout.write(
                            f"[DRY] {src.relative_to(media_root)} -> {dest_rel}  "
                            f"(max_side={cfg['max_side']}, q={cfg['quality']})"
                        )
                        created += 1
                        continue

                    data = load_and_convert(src, cfg["max_side"], cfg["quality"])
                    dest_path.parent.mkdir(parents=True, exist_ok=True)
                    with open(dest_path, "wb") as f:
                        f.write(data)
                    self.stdout.write(self.style.SUCCESS(
                        f"[OK] {src.relative_to(media_root)} -> {dest_rel}"
                    ))
                    created += 1
                except Exception as e:
                    self.stderr.write(self.style.ERROR(f"[ERR] {dest_rel}: {e}"))
                    errors += 1

        self.stdout.write(self.style.NOTICE(
            f"Done. Created: {created}, Existed: {existed}, Missing src: {missing_src}, Errors: {errors}"
        ))
