import sqlite3
from pathlib import Path

from autopilot.db import client as db_client


def test_listing_insertion_is_idempotent():
    db_path = Path("/tmp/autopilot-test.db")
    if db_path.exists():
        db_path.unlink()
    conn = db_client.init_db(db_path)
    pod_id = db_client.log_pod_product(
        conn,
        design_id=1,
        partner="printify",
        product_type="tee",
        sku_json={"id": "SKU-1"},
        status="created",
    )
    db_client.log_listing(
        conn,
        pod_product_id=pod_id,
        title="Example",
        tags=["tag"],
        description="desc",
        listing_id_external="dry-run",
        status="pending",
    )
    try:
        db_client.log_listing(
            conn,
            pod_product_id=pod_id,
            title="Example",
            tags=["tag"],
            description="desc",
            listing_id_external="dry-run",
            status="pending",
        )
    except sqlite3.IntegrityError:
        pass
    else:
        raise AssertionError("Duplicate listing insert should fail for idempotency")
