from io import BytesIO
from PIL import Image, ImageOps
from django.core.files.base import ContentFile

MAX_SIDE = 2560           # Ограничение по длинной стороне
JPEG_QUALITY = 82         # Качество для фото
WEBP_METHOD = 6           # Алгоритм компрессии (0..6 — выше = лучше)
NEAR_LOSSLESS_QUALITY = 85  # Для графики, близкой к lossless
PALETTE_THRESHOLD = 256   # Кол-во цветов для определения “плоской” графики


def _is_simple_graphics(img: Image.Image) -> bool:
    """Эвристика для определения плоской графики (лого, иконки, скриншоты)."""
    try:
        paletted = img.convert("RGB").quantize(colors=PALETTE_THRESHOLD, method=Image.MEDIANCUT)
        return paletted.getcolors(PALETTE_THRESHOLD) is not None
    except Exception:
        return False


def _resize(img: Image.Image) -> Image.Image:
    """Пропорциональное уменьшение длинной стороны."""
    w, h = img.size
    longest = max(w, h)
    if longest <= MAX_SIDE:
        return img
    scale = MAX_SIDE / float(longest)
    new_size = (int(w * scale), int(h * scale))
    return img.resize(new_size, Image.LANCZOS)


def compress_image(image_field, max_side=MAX_SIDE, quality=JPEG_QUALITY):
    """
    Конвертирует изображение в WebP с максимально эффективным сжатием
    при минимальной потере качества. Сохраняет прозрачность.
    """
    if not image_field:
        return image_field

    img = Image.open(image_field)
    img = ImageOps.exif_transpose(img)  # учитываем ориентацию по EXIF

    # Приводим к корректным режимам
    if img.mode in ("P", "LA"):
        img = img.convert("RGBA" if "A" in img.mode else "RGB")
    if img.mode == "CMYK":
        img = img.convert("RGB")

    # Масштабируем при необходимости
    global MAX_SIDE
    MAX_SIDE = max_side
    img = _resize(img)

    has_alpha = (img.mode == "RGBA") or ("transparency" in img.info)
    simple_graphics = _is_simple_graphics(img)

    output = BytesIO()
    save_kwargs = {
        "format": "WEBP",
        "method": WEBP_METHOD,
        "icc_profile": None,  # убираем ICC для экономии места
    }

    if has_alpha:
        save_kwargs.update(
            quality=NEAR_LOSSLESS_QUALITY if simple_graphics else quality,
            lossless=simple_graphics,
        )
    else:
        save_kwargs.update(
            quality=quality if not simple_graphics else NEAR_LOSSLESS_QUALITY,
            lossless=simple_graphics,
        )

    if save_kwargs.get("lossless", False):
        save_kwargs["exact"] = True  # точное сохранение цветов

    # Убедимся, что режим корректный для WebP
    img = img.convert("RGBA") if has_alpha else img.convert("RGB")

    img.save(output, **save_kwargs)
    output.seek(0)

    # Переименуем в .webp
    base_name = image_field.name.rsplit(".", 1)[0] + ".webp"
    return ContentFile(output.getvalue(), name=base_name)
