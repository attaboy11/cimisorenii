from __future__ import annotations

import json
import sqlite3
from contextlib import contextmanager
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional

SCHEMA_PATH = Path(__file__).resolve().parent / "schema.sql"


def init_db(db_path: Path) -> sqlite3.Connection:
    db_path.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(db_path)
    with conn:
        conn.executescript(SCHEMA_PATH.read_text())
    conn.row_factory = sqlite3.Row
    return conn


@contextmanager
def db_cursor(conn: sqlite3.Connection):
    cur = conn.cursor()
    try:
        yield cur
    finally:
        cur.close()


def insert(conn: sqlite3.Connection, table: str, payload: Dict[str, Any]) -> int:
    keys = ", ".join(payload.keys())
    placeholders = ", ".join([":" + key for key in payload.keys()])
    sql = f"INSERT INTO {table} ({keys}) VALUES ({placeholders})"
    with conn:
        cur = conn.execute(sql, payload)
        return int(cur.lastrowid)


def fetch_all(conn: sqlite3.Connection, table: str) -> List[Dict[str, Any]]:
    cur = conn.execute(f"SELECT * FROM {table}")
    return [dict(row) for row in cur.fetchall()]


def upsert_run(conn: sqlite3.Connection, config: Dict[str, Any], results: Optional[Dict[str, Any]] = None) -> int:
    run_id = insert(
        conn,
        "runs",
        {
            "config_json": json.dumps(config),
            "results_json": json.dumps(results or {}),
        },
    )
    return run_id


def record_event(
    conn: sqlite3.Connection,
    run_id: Optional[int],
    entity_type: str,
    entity_id: Optional[int],
    level: str,
    message: str,
    payload: Optional[Dict[str, Any]] = None,
) -> None:
    insert(
        conn,
        "events",
        {
            "run_id": run_id,
            "entity_type": entity_type,
            "entity_id": entity_id,
            "level": level,
            "message": message,
            "payload_json": json.dumps(payload or {}),
        },
    )


def log_concepts(conn: sqlite3.Connection, concepts: Iterable[Dict[str, Any]]) -> List[int]:
    ids: List[int] = []
    for concept in concepts:
        ids.append(
            insert(
                conn,
                "concepts",
                {
                    "niche": concept["niche"],
                    "audience": concept["audience"],
                    "keywords_json": json.dumps(concept["keywords"]),
                    "score": concept["score"],
                    "status": concept.get("status", "draft"),
                },
            )
        )
    return ids


def log_design(
    conn: sqlite3.Connection,
    concept_id: int,
    variant: str,
    prompt: str,
    file_path: str,
    validated: bool,
) -> int:
    return insert(
        conn,
        "designs",
        {
            "concept_id": concept_id,
            "variant": variant,
            "prompt": prompt,
            "file_path": file_path,
            "validated_bool": int(validated),
        },
    )


def log_pod_product(
    conn: sqlite3.Connection,
    design_id: int,
    partner: str,
    product_type: str,
    sku_json: Dict[str, Any],
    status: str,
) -> int:
    return insert(
        conn,
        "pod_products",
        {
            "design_id": design_id,
            "partner": partner,
            "product_type": product_type,
            "sku_json": json.dumps(sku_json),
            "status": status,
        },
    )


def log_listing(
    conn: sqlite3.Connection,
    pod_product_id: int,
    title: str,
    tags: List[str],
    description: str,
    listing_id_external: Optional[str],
    status: str,
) -> int:
    return insert(
        conn,
        "etsy_listings",
        {
            "pod_product_id": pod_product_id,
            "title": title,
            "tags_json": json.dumps(tags),
            "description": description,
            "listing_id_external": listing_id_external,
            "status": status,
        },
    )
