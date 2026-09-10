import logging
import os
import threading

import keyboard

from persianspeak.audio_recorder import AudioRecorder
from persianspeak.config import APP_DIR, LOG_PATH, load_config
from persianspeak.text_injector import inject_text
from persianspeak.transcriber import Transcriber
from persianspeak.tray_icon import TrayIcon

log = logging.getLogger("persianspeak")


class App:
    def __init__(self):
        self.cfg = load_config()
        self.tray = TrayIcon(on_quit=self._quit)
        self.recorder = AudioRecorder(self.cfg.sample_rate, self.cfg.input_device)
        self._transcriber: Transcriber | None = None
        self._recording = False
        self._busy = False
        self._lock = threading.Lock()

    def _load_model_async(self) -> None:
        def _load():
            self._transcriber = Transcriber(
                self.cfg.model_size, self.cfg.device, self.cfg.compute_type, self.cfg.language
            )
            self.tray.set_state("idle")

        threading.Thread(target=_load, daemon=True).start()

    def _on_hotkey(self) -> None:
        with self._lock:
            if self._transcriber is None or self._busy:
                return

            if not self._recording:
                self._recording = True
                self.recorder.start()
                self.tray.set_state("recording")
            else:
                self._recording = False
                self._busy = True
                self.tray.set_state("processing")
                audio = self.recorder.stop()
                threading.Thread(target=self._process, args=(audio,), daemon=True).start()

    def _process(self, audio) -> None:
        try:
            text = self._transcriber.transcribe(audio, self.cfg.sample_rate)
            log.info("Transcribed: %s", text)
            if text:
                inject_text(text, self.cfg.injection_method)
        except Exception:
            log.exception("Failed to transcribe/inject text")
        finally:
            with self._lock:
                self._busy = False
            self.tray.set_state("idle")

    def _quit(self, icon) -> None:
        try:
            keyboard.remove_hotkey(self.cfg.hotkey)
        except (KeyError, ValueError):
            pass
        icon.stop()

    def run(self) -> None:
        keyboard.add_hotkey(self.cfg.hotkey, self._on_hotkey)
        self._load_model_async()
        self.tray.run()


def main() -> None:
    os.makedirs(APP_DIR, exist_ok=True)
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
        handlers=[logging.FileHandler(LOG_PATH, encoding="utf-8"), logging.StreamHandler()],
    )
    App().run()


if __name__ == "__main__":
    main()
