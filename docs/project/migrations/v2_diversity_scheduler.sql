-- Migration: Diversity Scheduler V2 tables
-- Creates tables for tracking discovery runs and published product diversity.

-- Table 1: discovery_run_history
CREATE TABLE IF NOT EXISTS discovery_run_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  run_at timestamptz NOT NULL DEFAULT now(),
  category_ids text[] NOT NULL,
  keywords text[] NOT NULL
);

-- Index on run_at descending to optimize retrieval of recent runs
CREATE INDEX IF NOT EXISTS idx_discovery_run_history_run_at ON discovery_run_history (run_at DESC);

-- Table 2: published_product_diversity
CREATE TABLE IF NOT EXISTS published_product_diversity (
  product_id text PRIMARY KEY,
  category_id text NOT NULL,
  keyword text NOT NULL,
  product_type text,
  published_at timestamptz NOT NULL DEFAULT now()
);

-- Index on published_at descending to check the category of the last published product
CREATE INDEX IF NOT EXISTS idx_published_product_diversity_published_at ON published_product_diversity (published_at DESC);
