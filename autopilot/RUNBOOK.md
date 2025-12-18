# Etsy Autopilot Runbook

## Restarting after failure
1. Inspect `autopilot/demo.db` (or configured DB) for last completed run in `runs` table.
2. Replay from the `concepts` row where `status != 'published'` by re-running `python -m autopilot.orchestrator.run` with `demo_mode` disabled and `kill_switch=false`.
3. Use the `events` table to identify failing stage (research/design/pod/etsy) and reprocess only those records.

## Kill switch
- Set `kill_switch: true` in `autopilot/config/default.yml` (or environment override) to stop publishing immediately. The orchestrator will still log research outputs but will not call partner APIs.

## Human review gate
- Adjust `human_review_rate` to sample 1 in N listings for manual review. The demo run uses N=10; set to 1 to force review of every listing.

## Rate limits and retries
- Global retry policy is configured via `retry_attempts` and `retry_backoff_seconds` in `autopilot/config/default.yml`. In production, wrap partner API calls with exponential backoff + jitter (hooks exist in `pod/` and `etsy/` clients).

## Dry-run vs. publish
- `dry_run: true` keeps publishing in a safe preview state and returns `listing_id = "dry-run"`.
- `demo_mode: true` limits the orchestrator to 10 listings while exercising the full pipeline.

## Logs and observability
- Structured JSON logs are emitted by `autopilot/observability/logger.py`.
- All persisted artifacts (concepts, designs, pod products, listings, runs, events) live in SQLite under `autopilot/demo.db` by default.

## Data hygiene
- Update `BLOCKLIST` in `research/niche_researcher.py` and `BLOCKED_TERMS` in `etsy/client.py` to expand safety coverage.
- Ensure any new prompt templates avoid trademarked phrasing, celebrities, or team names.
