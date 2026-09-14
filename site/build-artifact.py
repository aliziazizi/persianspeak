#!/usr/bin/env python3
"""می‌سازد: artifact.html — همان index.html بدون تگ‌های html/head/body.

پلتفرم Artifact خودش صفحه را در یک اسکلت HTML می‌پیچد، پس اینجا فقط
محتوای body به‌علاوه title و لینک استایل‌ها بیرون کشیده می‌شود.
تنها منبع حقیقت index.html است؛ این فایل خروجی گرفته می‌شود.
"""
import re
import pathlib

HERE = pathlib.Path(__file__).parent
src = (HERE / "index.html").read_text(encoding="utf-8")

head = re.search(r"<head>(.*?)</head>", src, re.S).group(1)
body = re.search(r"<body>(.*?)</body>", src, re.S).group(1)

keep = re.findall(
    r'^\s*(<title>.*?</title>|<link rel="(?:stylesheet|preconnect)"[^>]*>)\s*$',
    head, re.M,
)

# جهت و زبان روی <html> ست می‌شود، چون آن تگ در artifact در اختیار ما نیست
rtl = (
    "<script>document.documentElement.setAttribute('dir','rtl');"
    "document.documentElement.setAttribute('lang','fa');</script>"
)

out = "\n".join(keep) + "\n" + rtl + "\n" + body.strip() + "\n"
(HERE / "artifact.html").write_text(out, encoding="utf-8")
print(f"artifact.html نوشته شد ({len(out):,} بایت)")
