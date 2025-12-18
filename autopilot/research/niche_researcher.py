from __future__ import annotations

import json
from dataclasses import dataclass
from typing import Dict, Iterable, List, Tuple

BLOCKLIST = {
    "disney",
    "marvel",
    "harry potter",
    "nba",
    "nfl",
    "taylor swift",
    "star wars",
    "fifa",
    "lego",
    "pokemon",
    "barbie",
    "nintendo",
}


@dataclass
class ListingConcept:
    niche: str
    audience: str
    keywords: Dict[str, List[str]]
    score: float
    differentiation: str


class NicheResearcher:
    def __init__(self, allowed_niches: Iterable[str] | None = None, blocked_niches: Iterable[str] | None = None):
        self.allowed_niches = {n.lower() for n in allowed_niches or []}
        self.blocked_niches = BLOCKLIST.union({n.lower() for n in blocked_niches or []})

    def _is_allowed(self, term: str) -> bool:
        normalized = term.lower()
        contains_blocked = any(b in normalized for b in self.blocked_niches)
        return (not self.allowed_niches or normalized in self.allowed_niches) and not contains_blocked

    def cluster_keywords(self, primary: str, secondaries: List[str]) -> Dict[str, List[str]]:
        filtered = [kw for kw in secondaries if self._is_allowed(kw)]
        return {"primary": [primary], "secondary": filtered[:8]}

    def rank_concepts(self, seeds: List[Tuple[str, str]]) -> List[ListingConcept]:
        concepts: List[ListingConcept] = []
        for niche, audience in seeds:
            if not self._is_allowed(niche):
                continue
            keywords = self.cluster_keywords(niche, self._secondary_keywords(niche))
            score = self._score_concept(keywords)
            concepts.append(
                ListingConcept(
                    niche=niche,
                    audience=audience,
                    keywords=keywords,
                    score=score,
                    differentiation=f"Lean into clean typography and {niche} insider language without violating IP.",
                )
            )
        return sorted(concepts, key=lambda c: c.score, reverse=True)

    def _secondary_keywords(self, niche: str) -> List[str]:
        return [
            f"{niche} gift",
            f"{niche} quote",
            f"{niche} aesthetic",
            f"minimal {niche} shirt",
            f"{niche} mug",
            f"{niche} line art",
            f"{niche} typography",
            f"{niche} minimalist",
        ]

    def _score_concept(self, keywords: Dict[str, List[str]]) -> float:
        primary_strength = len(keywords.get("primary", []))
        secondary_strength = len(keywords.get("secondary", []))
        diversity_bonus = len({kw.split()[0] for kw in keywords.get("secondary", [])})
        return round(0.6 * primary_strength + 0.3 * secondary_strength + 0.1 * diversity_bonus, 2)

    def to_backlog(self, seeds: List[Tuple[str, str]], limit: int = 50) -> List[Dict[str, str]]:
        ranked = self.rank_concepts(seeds)[:limit]
        backlog = []
        for concept in ranked:
            backlog.append(
                {
                    "niche": concept.niche,
                    "audience": concept.audience,
                    "keywords": concept.keywords,
                    "score": concept.score,
                    "differentiation": concept.differentiation,
                }
            )
        return backlog


def serialize_concepts(concepts: List[ListingConcept]) -> str:
    payload = [concept.__dict__ for concept in concepts]
    return json.dumps(payload, indent=2)
