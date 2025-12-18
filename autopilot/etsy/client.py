from __future__ import annotations

import itertools
import re
from dataclasses import dataclass
from typing import Dict, List, Optional

BLOCKED_TERMS = {"official", "replica", "knockoff"}
TAG_LIMIT = 13
TAG_CHAR_LIMIT = 20
TITLE_LIMIT = 140


@dataclass
class EtsyPayload:
    title: str
    description: str
    tags: List[str]
    materials: List[str]
    who_made: str = "i_did"
    when_made: str = "made_to_order"


class EtsyClient:
    def __init__(self):
        self._listing_counter = itertools.count(5000)

    def sanitize_text(self, text: str) -> str:
        lowered = text.lower()
        for blocked in BLOCKED_TERMS:
            if blocked in lowered:
                raise ValueError(f"Blocked keyword detected: {blocked}")
        cleaned = re.sub(r"\s+", " ", text).strip()
        return cleaned[:TITLE_LIMIT]

    def build_payload(
        self,
        title: str,
        description: str,
        tags: List[str],
        materials: Optional[List[str]] = None,
    ) -> EtsyPayload:
        sanitized_title = self.sanitize_text(title)
        sanitized_tags = [self.sanitize_text(tag)[:TAG_CHAR_LIMIT] for tag in tags[:TAG_LIMIT]]
        return EtsyPayload(
            title=sanitized_title,
            description=description.strip(),
            tags=sanitized_tags,
            materials=materials or ["cotton", "water-based inks"],
        )

    def publish(self, payload: EtsyPayload, dry_run: bool = True) -> Dict[str, str]:
        if dry_run:
            return {"listing_id": "dry-run", "status": "pending"}
        listing_id = f"etsy-{next(self._listing_counter)}"
        return {"listing_id": listing_id, "status": "published"}
