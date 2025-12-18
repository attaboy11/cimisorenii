from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List

PHRASE_PATTERNS = [
    "{niche} mindset in clean lines",
    "Quiet {niche} confidence",
    "{niche} and nothing else",
]


@dataclass
class DesignSpec:
    concept_id: int
    variant: str
    prompt: str
    file_path: Path
    validated: bool = False


class Designer:
    def __init__(self, output_dir: Path):
        self.output_dir = output_dir
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def variants_for_concept(self, concept: Dict[str, str]) -> List[DesignSpec]:
        specs: List[DesignSpec] = []
        niche = concept["niche"]
        for idx, pattern in enumerate(PHRASE_PATTERNS, start=1):
            prompt = pattern.format(niche=niche)
            filename = self.output_dir / f"concept-{concept['id']}-v{idx}.png"
            filename.touch()
            specs.append(
                DesignSpec(
                    concept_id=concept["id"],
                    variant=f"v{idx}",
                    prompt=prompt,
                    file_path=filename,
                    validated=False,
                )
            )
        return specs
