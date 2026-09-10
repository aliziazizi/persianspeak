# PersianSpeak

یک ابزار دیکته صوتی برای ویندوز ۶۴بیتی: با فارسی صحبت می‌کنی، متن فارسی همان‌جا که فوکوس داری (چت Claude، مرورگر، Word، هر برنامه‌ی دیگر) تایپ می‌شود. تشخیص گفتار به‌صورت **کاملاً محلی/آفلاین** روی مدل Whisper اجرا می‌شود؛ صدای شما به هیچ سروری فرستاده نمی‌شود.

## نحوه کار

1. برنامه در Tray (کنار ساعت ویندوز) اجرا می‌شود.
2. هرجا که می‌خواهی تایپ کن (مثلاً کادر پیام در Claude)، کلید میانبر پیش‌فرض `Ctrl+Alt+Space` را بزن تا ضبط شروع شود (آیکون قرمز می‌شود).
3. فارسی صحبت کن.
4. دوباره همان کلید میانبر را بزن تا ضبط متوقف و متن تشخیص‌داده‌شده در محل کرسر تایپ شود.

## دریافت فایل اجرایی (exe)

خودکارترین راه: بعد از هر push روی این مخزن، یک workflow گیت‌هاب اکشن (`.github/workflows/build-windows.yml`) به‌صورت خودکار روی `windows-latest` اجرا و فایل `PersianSpeak.exe` را می‌سازد.
از تب **Actions** مخزن، آخرین اجرای «Build Windows EXE» را باز کن و از بخش Artifacts فایل `PersianSpeak-windows-x64` را دانلود کن.

می‌توانی همین workflow را هر وقت خواستی از تب Actions با دکمه «Run workflow» هم به‌صورت دستی اجرا کنی.

## اجرای مستقیم از سورس (برای توسعه/تست)

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
set PYTHONPATH=src
python -m persianspeak.main
```

## ساخت exe به‌صورت دستی روی ویندوز

```bash
pip install -r requirements.txt
pip install pyinstaller
cd packaging
pyinstaller persianspeak.spec
```

فایل خروجی در `packaging/dist/PersianSpeak.exe` قرار می‌گیرد.

## تنظیمات

فایل تنظیمات به‌صورت خودکار در مسیر زیر ساخته می‌شود:

```
%APPDATA%\PersianSpeak\config.json
```

(نمونه در `config.example.json` این مخزن هم موجود است.)

| کلید | توضیح | پیش‌فرض |
|---|---|---|
| `hotkey` | کلید میانبر شروع/توقف ضبط | `ctrl+alt+space` |
| `model_size` | اندازه مدل Whisper: `tiny`, `base`, `small`, `medium`, `large-v3` — هرچه بزرگ‌تر، دقیق‌تر و کندتر | `small` |
| `device` | `cpu` یا `cuda` (اگر کارت گرافیک NVIDIA و CUDA نصب باشد) | `cpu` |
| `compute_type` | دقت محاسبات (`int8`, `float16`, ...) | `int8` |
| `language` | کد زبان تشخیص گفتار | `fa` |
| `input_device` | شماره میکروفون ورودی (`null` = پیش‌فرض سیستم) | `null` |
| `sample_rate` | نرخ نمونه‌برداری صدا | `16000` |
| `injection_method` | `paste` (چسباندن سریع از کلیپ‌بورد، توصیه‌شده) یا `type` (تایپ کاراکتر به کاراکتر) | `paste` |

بعد از تغییر فایل تنظیمات، برنامه را ببند و دوباره باز کن.

## نکات مهم

- **بار اول اجرا** به اینترنت نیاز دارد تا مدل Whisper (برای `small` حدود ۵۰۰ مگابایت) از Hugging Face دانلود شود. بعد از آن کاملاً آفلاین کار می‌کند.
- برای دقت بهتر روی جملات فارسی، `model_size` را به `medium` تغییر بده (کندتر است، برای CPU ضعیف مناسب نیست).
- تایپ خودکار در برنامه‌های اجرا شده با «Run as Administrator» ممکن است کار نکند؛ این محدودیت ویندوز است (برنامه‌های عادی مثل مرورگر و Claude مشکلی ندارند).
- اگر میکروفون خاصی می‌خواهی، شماره دستگاه را با اجرای این کد در پایتون پیدا کن: `python -c "import sounddevice; print(sounddevice.query_devices())"` و مقدار `input_device` را در تنظیمات وارد کن.
- لاگ اجرا برای عیب‌یابی در `%APPDATA%\PersianSpeak\persianspeak.log` ذخیره می‌شود.

## ساختار پروژه

```
src/persianspeak/
  main.py            # اجرای اصلی، مدیریت وضعیت و کلید میانبر
  config.py           # بارگذاری/ذخیره تنظیمات
  audio_recorder.py    # ضبط صدا از میکروفون
  transcriber.py       # تشخیص گفتار فارسی با faster-whisper
  text_injector.py     # تایپ متن در برنامه فعال
  tray_icon.py          # آیکون و منوی Tray
packaging/persianspeak.spec   # فایل PyInstaller برای ساخت exe
.github/workflows/build-windows.yml  # ساخت خودکار exe در گیت‌هاب اکشن
```
