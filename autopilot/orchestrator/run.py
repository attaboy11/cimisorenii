from __future__ import annotations

import itertools
import json
from pathlib import Path
from typing import Dict, List

from autopilot.config.config import RunConfig, load_config
from autopilot.db import client as db_client
from autopilot.design.designer import Designer
from autopilot.etsy.client import EtsyClient
from autopilot.image_processing.validator import ImageValidator
from autopilot.observability.logger import log_event
from autopilot.pod.printify_client import PrintifyClient
from autopilot.research.niche_researcher import NicheResearcher


class Orchestrator:
    def __init__(self, db_path: Path, output_dir: Path, config: RunConfig):
        self.db_path = db_path
        self.output_dir = output_dir
        self.config = config
        self.conn = db_client.init_db(db_path)
        self.researcher = NicheResearcher(config.allowed_niches, config.blocked_niches)
        self.designer = Designer(output_dir)
        self.validator = ImageValidator()
        self.pod_client = PrintifyClient(pricing_margin=config.pricing_margin)
        self.etsy_client = EtsyClient()
        self._id_counter = itertools.count(1)

    def run(self, demo: bool = False) -> Dict[str, int]:
        run_id = db_client.upsert_run(self.conn, json.loads(self.config.to_json()))
        seeds = self._seed_niches(demo)
        backlog = self.researcher.to_backlog(seeds, limit=self.config.target_listings)
        for concept in backlog:
            concept["id"] = next(self._id_counter)
        db_client.log_concepts(self.conn, backlog)

        totals = {"concepts": len(backlog), "designs": 0, "pod_products": 0, "listings": 0}

        for concept in backlog[: self._demo_cap(demo)]:
            specs = self.designer.variants_for_concept(concept)
            for spec in specs:
                validation = self.validator.validate(spec.file_path)
                design_id = db_client.log_design(
                    self.conn,
                    concept_id=concept["id"],
                    variant=spec.variant,
                    prompt=spec.prompt,
                    file_path=str(spec.file_path),
                    validated=validation.passed,
                )
                pod_product = self.pod_client.create_product(
                    design_id=design_id,
                    product_type=self.config.product_templates[0],
                    variants=["S", "M", "L", "XL"],
                )
                pod_id = db_client.log_pod_product(
                    self.conn,
                    design_id=design_id,
                    partner=pod_product.partner,
                    product_type=pod_product.product_type,
                    sku_json=pod_product.sku,
                    status=pod_product.status,
                )
                payload = self.etsy_client.build_payload(
                    title=f"{concept['niche']} {spec.variant} minimal shirt",
                    description=self._description(concept),
                    tags=self._tags(concept),
                )
                if self.config.kill_switch:
                    publish_result = {"listing_id": None, "status": "killed"}
                else:
                    publish_result = self.etsy_client.publish(payload, dry_run=self.config.dry_run)
                if self._requires_review(spec.variant):
                    publish_result["status"] = "pending_review"
                db_client.log_listing(
                    self.conn,
                    pod_product_id=pod_id,
                    title=payload.title,
                    tags=payload.tags,
                    description=payload.description,
                    listing_id_external=publish_result.get("listing_id"),
                    status=publish_result["status"],
                )
                totals["designs"] += 1
                totals["pod_products"] += 1
                totals["listings"] += 1
                log_event(run_id, "listing", pod_id, "info", "Created listing", publish_result)

        db_client.record_event(self.conn, run_id, "run", run_id, "info", "Run completed", totals)
        return totals

    def _seed_niches(self, demo: bool) -> List[tuple[str, str]]:
        base = [
            ("urban gardening", "apartment dwellers"),
            ("trail running", "outdoor athletes"),
            ("cold brew", "coffee lovers"),
            ("minimalist travel", "remote workers"),
            ("book clubs", "readers"),
        ]
        return base if not demo else base[:3]

    def _description(self, concept: Dict[str, str]) -> str:
        return (
            f"Original, IP-safe {concept['niche']} design. Printed on premium cotton with water-based inks. "
            "Machine washable, made to order, fulfilled via Printify. Ships in 2-5 business days."
        )

    def _tags(self, concept: Dict[str, str]) -> List[str]:
        keywords = concept.get("keywords", {})
        primary = keywords.get("primary", [])[:1]
        secondary = keywords.get("secondary", [])[:12]
        return [kw[:20] for kw in (primary + secondary)]

    def _demo_cap(self, demo: bool) -> int:
        if demo or self.config.demo_mode:
            return 10
        return self.config.target_listings

    def _requires_review(self, variant: str) -> bool:
        if self.config.human_review_rate <= 0:
            return False
        index = int(variant.strip("v") or 0)
        return index % self.config.human_review_rate == 0


def run_demo():
    config = load_config()
    config.demo_mode = True
    config.dry_run = True
    orchestrator = Orchestrator(
        db_path=Path("autopilot/demo.db"),
        output_dir=Path("autopilot/output"),
        config=config,
    )
    totals = orchestrator.run(demo=True)
    return totals


if __name__ == "__main__":
    results = run_demo()
    print(json.dumps(results, indent=2))
