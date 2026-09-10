import logging
import time

import keyboard
import pyperclip

log = logging.getLogger("persianspeak")


def inject_text(text: str, method: str = "paste") -> None:
    if not text:
        return

    if method == "type":
        keyboard.write(text)
        return

    _paste_via_clipboard(text)


def _paste_via_clipboard(text: str) -> None:
    try:
        previous = pyperclip.paste()
    except Exception:
        previous = None

    try:
        pyperclip.copy(text)
        time.sleep(0.05)
        keyboard.send("ctrl+v")
        time.sleep(0.05)
    except Exception:
        log.exception("Clipboard paste failed, falling back to direct typing.")
        keyboard.write(text)
    finally:
        if previous is not None:
            time.sleep(0.1)
            try:
                pyperclip.copy(previous)
            except Exception:
                pass
