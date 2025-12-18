from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import List


@dataclass
class ImageValidationResult:
    file_path: Path
    passed: bool
    errors: List[str]


class ImageValidator:
    def __init__(self, min_px: int = 3000):
        self.min_px = min_px

    def validate(self, spec_path: Path) -> ImageValidationResult:
        errors: List[str] = []
        if not spec_path.exists():
            errors.append("file_missing")
        if spec_path.suffix.lower() != ".png":
            errors.append("invalid_format")
        # Since we do not generate real images here, we simulate size validation by naming convention
        if "lowres" in spec_path.name:
            errors.append("insufficient_resolution")
        return ImageValidationResult(file_path=spec_path, passed=len(errors) == 0, errors=errors)
