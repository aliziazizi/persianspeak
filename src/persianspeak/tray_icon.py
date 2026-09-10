from PIL import Image, ImageDraw
from pystray import Icon, Menu, MenuItem

STATE_COLORS = {
    "loading": (150, 150, 150),
    "idle": (60, 140, 60),
    "recording": (200, 40, 40),
    "processing": (220, 170, 30),
}

STATE_LABELS = {
    "loading": "در حال بارگذاری مدل...",
    "idle": "آماده (برای شروع ضبط کلید میانبر را بزنید)",
    "recording": "در حال ضبط صدا...",
    "processing": "در حال تبدیل گفتار به متن...",
}


def _make_image(color: tuple[int, int, int]) -> Image.Image:
    size = 64
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.ellipse((4, 4, size - 4, size - 4), fill=color)
    draw.rectangle((size // 2 - 6, size // 2 - 16, size // 2 + 6, size // 2 + 10), fill=(255, 255, 255))
    draw.ellipse((size // 2 - 6, size // 2 - 22, size // 2 + 6, size // 2 - 10), fill=(255, 255, 255))
    return img


class TrayIcon:
    def __init__(self, on_quit):
        self._on_quit = on_quit
        self._icon = Icon(
            "PersianSpeak",
            _make_image(STATE_COLORS["loading"]),
            "PersianSpeak",
            menu=self._build_menu("loading"),
        )

    def _build_menu(self, state: str) -> Menu:
        return Menu(
            MenuItem(STATE_LABELS[state], None, enabled=False),
            MenuItem("خروج", lambda: self._on_quit(self._icon)),
        )

    def set_state(self, state: str) -> None:
        self._icon.icon = _make_image(STATE_COLORS[state])
        self._icon.menu = self._build_menu(state)

    def run(self) -> None:
        self._icon.run()

    def stop(self) -> None:
        self._icon.stop()
