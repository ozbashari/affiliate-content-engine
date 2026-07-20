-- Migration: Cron Distributed Locks
-- Defines the table and atomic RPC functions for distributed cron locking.

-- Create table
CREATE TABLE IF NOT EXISTS cron_locks (
  lock_key text PRIMARY KEY,
  owner_id text NOT NULL,
  acquired_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index on expires_at for lock cleanup / expiry check
CREATE INDEX IF NOT EXISTS idx_cron_locks_expires_at ON cron_locks (expires_at);

-- Atomic acquisition function
CREATE OR REPLACE FUNCTION try_acquire_cron_lock(
  p_lock_key text,
  p_owner_id text,
  p_ttl_seconds integer
) RETURNS boolean AS $$
DECLARE
  v_now timestamptz := now();
  v_expires_at timestamptz := now() + (p_ttl_seconds || ' seconds')::interval;
  v_acquired boolean := false;
BEGIN
  -- Validate inputs
  IF p_ttl_seconds <= 0 THEN
    RAISE EXCEPTION 'TTL seconds must be a positive integer';
  END IF;

  -- Attempt to insert the lock if missing.
  -- If it already exists, update it ONLY if the existing lock has expired.
  INSERT INTO cron_locks (lock_key, owner_id, acquired_at, expires_at, updated_at)
  VALUES (p_lock_key, p_owner_id, v_now, v_expires_at, v_now)
  ON CONFLICT (lock_key) DO UPDATE
  SET owner_id = p_owner_id,
      acquired_at = v_now,
      expires_at = v_expires_at,
      updated_at = v_now
  WHERE cron_locks.expires_at <= v_now
  RETURNING true INTO v_acquired;

  RETURN COALESCE(v_acquired, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Atomic release function
CREATE OR REPLACE FUNCTION release_cron_lock(
  p_lock_key text,
  p_owner_id text
) RETURNS boolean AS $$
DECLARE
  v_released boolean := false;
BEGIN
  -- Delete the lock if it exists and matches the owner ID.
  DELETE FROM cron_locks
  WHERE lock_key = p_lock_key AND owner_id = p_owner_id
  RETURNING true INTO v_released;

  RETURN COALESCE(v_released, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
