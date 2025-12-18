from autopilot.research.niche_researcher import NicheResearcher


def test_keyword_clustering_respects_blocklist():
    researcher = NicheResearcher(blocked_niches=["disney"])
    cluster = researcher.cluster_keywords("urban gardening", ["urban gardening aesthetic", "disney inspired"])
    assert "disney" not in " ".join(cluster["secondary"])
    assert cluster["primary"] == ["urban gardening"]


def test_rank_concepts_orders_by_score():
    researcher = NicheResearcher()
    ranked = researcher.rank_concepts([
        ("trail running", "outdoor athletes"),
        ("cold brew", "coffee lovers"),
    ])
    scores = [c.score for c in ranked]
    assert scores == sorted(scores, reverse=True)
