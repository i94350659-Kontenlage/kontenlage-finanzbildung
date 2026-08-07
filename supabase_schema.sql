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

-- RLS (Row Level Security) aktivieren
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE hermes_learnings ENABLE ROW LEVEL SECURITY;
