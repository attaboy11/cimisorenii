from __future__ import annotations

import itertools
import random
from dataclasses import dataclass
from typing import Dict, List


@dataclass
class PodProduct:
    design_id: int
    partner: str
    product_type: str
    sku: Dict[str, str]
    status: str


class PrintifyClient:
    def __init__(self, pricing_margin: float):
        self.pricing_margin = pricing_margin
        self._sku_counter = itertools.count(1000)

    def create_product(self, design_id: int, product_type: str, variants: List[str]) -> PodProduct:
        base_cost = 10.0 if product_type == "tee" else 16.0
        price = round(base_cost * (1 + self.pricing_margin), 2)
        sku = {
            "id": f"SKU-{next(self._sku_counter)}",
            "price": price,
            "variants": variants,
        }
        status = "created"
        return PodProduct(design_id=design_id, partner="printify", product_type=product_type, sku=sku, status=status)

    def mock_upload(self, file_path: str) -> str:
        random.seed(file_path)
        return f"asset-{abs(hash(file_path)) % 1_000_000}"
