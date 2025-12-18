# Etsy Shop Autopilot

A modular Python pipeline that can generate and publish Print-on-Demand listings while respecting Etsy and POD partner policies. Includes a dry-run demo that walks 10 listings through research → design → validation → POD sync → Etsy payload creation.

## Repo structure (autopilot scope)
- `config/` — run config + throttle rules (`default.yml`).
- `db/` — schema + lightweight SQLite helpers.
- `research/` — niche discovery + keyword clustering with safety blocklist.
- `design/` — prompt + variant generator (placeholder assets saved to `autopilot/output`).
- `image_processing/` — validation hooks (format + resolution flags).
- `pod/` — Printify-style client and SKU builder.
- `etsy/` — payload builder + sanitizer + mock publisher.
- `orchestrator/` — run controller + demo entrypoint.
- `observability/` — structured JSON logging.
- `RUNBOOK.md` — recovery + safety controls.

## Database schema (SQLite)
See `db/schema.sql` for create statements. Key tables: `concepts`, `designs`, `pod_products`, `etsy_listings`, `runs`, `events`.

## Orchestration pseudocode
```text
load RunConfig
connect SQLite + init schema
seed niches -> keyword backlog
for concept in backlog (demo: first 10):
    generate 3 design variants
    validate image placeholders
    create POD product + SKU
    build Etsy payload (title/tags/description)
    publish (dry-run returns pending id)
    log artifacts + events
record totals in runs/events
```

## Running a 10-listing demo
```bash
python -m autopilot.orchestrator.run
```
Outputs and artifacts:
- SQLite DB: `autopilot/demo.db`
- Generated placeholder assets: `autopilot/output/`
- Structured logs (stdout) + DB records for concepts/designs/pod products/listings

## Configuration
- Edit `config/default.yml` to adjust target listings, batch sizes, throttle rules, and safety toggles.
- `.env.example` lists required secrets (all calls are dry-run by default; production would load tokens from env vars).

## Safety + compliance
- Blocklists prevent trademarked/celebrity terms in research and Etsy payloads.
- Titles and tags are sanitized to remove risky phrasing and length overflows.
- `dry_run` and `kill_switch` guardrails keep publishing controlled; `human_review_rate` controls manual review sampling.
