from pathlib import Path

from autopilot.image_processing.validator import ImageValidator


def test_validator_flags_missing_file(tmp_path: Path):
    validator = ImageValidator()
    missing = tmp_path / "missing.png"
    result = validator.validate(missing)
    assert not result.passed
    assert "file_missing" in result.errors


def test_validator_accepts_png(tmp_path: Path):
    validator = ImageValidator()
    ok = tmp_path / "ok.png"
    ok.touch()
    result = validator.validate(ok)
    assert result.passed
