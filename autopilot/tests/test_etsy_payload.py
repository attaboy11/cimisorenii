import pytest

from autopilot.etsy.client import EtsyClient


def test_build_payload_limits_tags_and_length():
    client = EtsyClient()
    tags = [f"tag-{i}" for i in range(20)]
    payload = client.build_payload(
        title="Minimal trail running tee with breathable design",
        description="Simple description",
        tags=tags,
    )
    assert len(payload.tags) == 13
    assert all(len(tag) <= 20 for tag in payload.tags)
    assert len(payload.title) <= 140


def test_blocked_keyword_raises():
    client = EtsyClient()
    with pytest.raises(ValueError):
        client.build_payload(title="official replica", description="bad", tags=["safe"])
