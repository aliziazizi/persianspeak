import logging

import numpy as np
from faster_whisper import WhisperModel

log = logging.getLogger("persianspeak")


class Transcriber:
    """Wraps a local faster-whisper model for Persian speech-to-text."""

    def __init__(self, model_size: str, device: str, compute_type: str, language: str):
        self.language = language
        log.info("Loading Whisper model '%s' (device=%s, compute_type=%s)...", model_size, device, compute_type)
        self._model = WhisperModel(model_size, device=device, compute_type=compute_type)
        log.info("Model loaded.")

    def transcribe(self, audio: np.ndarray, sample_rate: int) -> str:
        if audio.size == 0:
            return ""

        min_duration_sec = 0.3
        if audio.size < sample_rate * min_duration_sec:
            return ""

        segments, _info = self._model.transcribe(
            audio,
            language=self.language,
            vad_filter=True,
            beam_size=5,
        )
        text = "".join(segment.text for segment in segments).strip()
        return text
