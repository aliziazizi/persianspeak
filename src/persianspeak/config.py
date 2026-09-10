import json
import os
from dataclasses import asdict, dataclass

APP_DIR = os.path.join(os.environ.get("APPDATA", os.path.expanduser("~")), "PersianSpeak")
CONFIG_PATH = os.path.join(APP_DIR, "config.json")
LOG_PATH = os.path.join(APP_DIR, "persianspeak.log")


@dataclass
class Config:
    hotkey: str = "ctrl+alt+space"
    model_size: str = "small"
    device: str = "cpu"
    compute_type: str = "int8"
    language: str = "fa"
    input_device: int | None = None
    sample_rate: int = 16000
    injection_method: str = "paste"  # "paste" or "type"


def load_config() -> Config:
    os.makedirs(APP_DIR, exist_ok=True)
    if not os.path.exists(CONFIG_PATH):
        cfg = Config()
        save_config(cfg)
        return cfg

    with open(CONFIG_PATH, "r", encoding="utf-8") as f:
        raw = json.load(f)

    defaults = asdict(Config())
    defaults.update(raw)
    return Config(**{k: defaults[k] for k in defaults if k in Config.__dataclass_fields__})


def save_config(cfg: Config) -> None:
    os.makedirs(APP_DIR, exist_ok=True)
    with open(CONFIG_PATH, "w", encoding="utf-8") as f:
        json.dump(asdict(cfg), f, ensure_ascii=False, indent=2)
