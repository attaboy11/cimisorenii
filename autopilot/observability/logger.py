from __future__ import annotations

import json
import logging
from dataclasses import dataclass, asdict
from datetime import datetime
from typing import Any, Dict, Optional

logging.basicConfig(level=logging.INFO, format="%(message)s")
logger = logging.getLogger("autopilot")


@dataclass
class Event:
    run_id: Optional[int]
    entity_type: str
    entity_id: Optional[int]
    level: str
    message: str
    payload: Dict[str, Any]
    ts: str


def log_event(
    run_id: Optional[int],
    entity_type: str,
    entity_id: Optional[int],
    level: str,
    message: str,
    payload: Optional[Dict[str, Any]] = None,
) -> Event:
    event = Event(
        run_id=run_id,
        entity_type=entity_type,
        entity_id=entity_id,
        level=level,
        message=message,
        payload=payload or {},
        ts=datetime.utcnow().isoformat(),
    )
    logger.info(json.dumps(asdict(event)))
    return event
