-- Supabase PostgreSQL Schema für Kontenlage (Free Tier Cloud DB)

-- 1. Tabelle: Nutzer & Abonnements (State lives in Backend DB)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(100),
    subscription_tier VARCHAR(50) DEFAULT 'free', -- 'free', 'pro_9', 'executive_29'
    stripe_customer_id VARCHAR(100),
    double_opt_in_confirmed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabelle: Audit Log / System Decisions (Everything Is Logged)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(100) NOT NULL, -- 'LEAD_DOWNLOAD', 'SUBSCRIPTION_CHECKOUT', 'CALCULATOR_RUN'
    user_email VARCHAR(255),
    input_snapshot JSONB,
    decision_reason TEXT,
    affected_parameters JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabelle: Hermes Self-Improvement & Post Performance Track
CREATE TABLE IF NOT EXISTS hermes_learnings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_headline TEXT NOT NULL,
    platform VARCHAR(50) NOT NULL, -- 'LinkedIn', 'X', 'Instagram', 'TikTok'
    hook_framework VARCHAR(100),
    clicks INT DEFAULT 0,
    conversions INT DEFAULT 0,
    confidence_score NUMERIC(3,2) DEFAULT 0.85,
    learned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabelle: DeFi Protokolle (Stammdaten)
CREATE TABLE IF NOT EXISTS defi_protocols (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(150) NOT NULL,
    chain VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'lending', 'dex', 'staking', 'yield'
    contract_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabelle: DeFi Signale (Rohdaten aus APIs)
CREATE TABLE IF NOT EXISTS defi_signals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    protocol_slug VARCHAR(100) NOT NULL,
    domain VARCHAR(50) NOT NULL, -- 'tvl', 'yield', 'security', 'governance'
    metric_name VARCHAR(100) NOT NULL,
    numeric_value NUMERIC,
    source VARCHAR(100) NOT NULL,
    confidence_level VARCHAR(50) NOT NULL, -- 'BESTÄTIGT', 'WAHRSCHEINLICH', 'UNBESTÄTIGT'
    observed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabelle: Ensemble Risk Scores (Deterministische Berechnung)
CREATE TABLE IF NOT EXISTS defi_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    protocol_slug VARCHAR(100) NOT NULL,
    rule_score NUMERIC(5,2),
    anomaly_score NUMERIC(5,2),
    peer_score NUMERIC(5,2),
    external_score NUMERIC(5,2),
    divergence NUMERIC(5,2),
    consensus_status VARCHAR(100),
    confidence_score NUMERIC(3,2),
    decision_reason TEXT,
    affected_parameters JSONB,
    computed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabelle: Backtest & Accuracy Audit Logs (2x wöchentliche Qualitätsprüfung)
CREATE TABLE IF NOT EXISTS defi_backtest_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    run_date DATE NOT NULL,
    total_incidents_analyzed INT DEFAULT 0,
    accuracy_percentage NUMERIC(5,2),
    quality_score_percentage NUMERIC(5,2),
    false_positives INT DEFAULT 0,
    false_negatives INT DEFAULT 0,
    avg_warning_lead_days NUMERIC(4,1),
    recommendations JSONB,
    confidence_score NUMERIC(3,2),
    decision_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RLS (Row Level Security) aktivieren
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE hermes_learnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE defi_protocols ENABLE ROW LEVEL SECURITY;
ALTER TABLE defi_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE defi_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE defi_backtest_logs ENABLE ROW LEVEL SECURITY;
