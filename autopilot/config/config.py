from __future__ import annotations

import json
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional

DEFAULT_CONFIG_PATH = Path(__file__).resolve().parent / "default.yml"


@dataclass
class ThrottleRule:
    service: str
    rate_per_minute: int
    burst: int = 1


@dataclass
class RunConfig:
    target_listings: int = 1000
    horizon_hours: int = 72
    dry_run: bool = True
    demo_mode: bool = False
    batch_size: int = 25
    concurrency: int = 4
    retry_attempts: int = 3
    retry_backoff_seconds: float = 1.5
    kill_switch: bool = False
    human_review_rate: int = 10
    product_templates: List[str] = field(default_factory=lambda: ["tee", "hoodie", "mug"])
    allowed_niches: List[str] = field(default_factory=list)
    blocked_niches: List[str] = field(default_factory=list)
    pricing_margin: float = 0.55
    throttle_rules: List[ThrottleRule] = field(
        default_factory=lambda: [
            ThrottleRule("etsy", rate_per_minute=20, burst=3),
            ThrottleRule("printify", rate_per_minute=30, burst=3),
        ]
    )

    @staticmethod
    def from_file(path: Optional[Path] = None) -> "RunConfig":
        resolved = path or DEFAULT_CONFIG_PATH
        data = json.loads(resolved.read_text())
        throttle_rules = [ThrottleRule(**rule) for rule in data.get("throttle_rules", [])]
        data["throttle_rules"] = throttle_rules
        return RunConfig(**data)

    def to_json(self) -> str:
        payload: Dict[str, Any] = {
            "target_listings": self.target_listings,
            "horizon_hours": self.horizon_hours,
            "dry_run": self.dry_run,
            "demo_mode": self.demo_mode,
            "batch_size": self.batch_size,
            "concurrency": self.concurrency,
            "retry_attempts": self.retry_attempts,
            "retry_backoff_seconds": self.retry_backoff_seconds,
            "kill_switch": self.kill_switch,
            "human_review_rate": self.human_review_rate,
            "product_templates": self.product_templates,
            "allowed_niches": self.allowed_niches,
            "blocked_niches": self.blocked_niches,
            "pricing_margin": self.pricing_margin,
            "throttle_rules": [rule.__dict__ for rule in self.throttle_rules],
        }
        return json.dumps(payload, indent=2)


def load_config(custom_path: Optional[str] = None) -> RunConfig:
    path = Path(custom_path) if custom_path else None
    return RunConfig.from_file(path)
