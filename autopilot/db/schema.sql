-- Core schema for Etsy Autopilot agent
CREATE TABLE IF NOT EXISTS concepts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    niche TEXT NOT NULL,
    audience TEXT NOT NULL,
    keywords_json TEXT NOT NULL,
    score REAL NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS designs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    concept_id INTEGER NOT NULL,
    variant TEXT NOT NULL,
    prompt TEXT NOT NULL,
    file_path TEXT NOT NULL,
    validated_bool INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (concept_id) REFERENCES concepts (id)
);

CREATE TABLE IF NOT EXISTS pod_products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    design_id INTEGER NOT NULL,
    partner TEXT NOT NULL,
    product_type TEXT NOT NULL,
    sku_json TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (design_id) REFERENCES designs (id)
);

CREATE TABLE IF NOT EXISTS etsy_listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pod_product_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    tags_json TEXT NOT NULL,
    description TEXT NOT NULL,
    listing_id_external TEXT,
    status TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(pod_product_id),
    FOREIGN KEY (pod_product_id) REFERENCES pod_products (id)
);

CREATE TABLE IF NOT EXISTS runs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    config_json TEXT NOT NULL,
    results_json TEXT
);

CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    run_id INTEGER,
    entity_type TEXT NOT NULL,
    entity_id INTEGER,
    level TEXT NOT NULL,
    message TEXT NOT NULL,
    payload_json TEXT,
    ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (run_id) REFERENCES runs (id)
);
