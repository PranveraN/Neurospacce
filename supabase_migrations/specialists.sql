-- ── Specialists table ────────────────────────────────────────────────────────
-- Run this once in Supabase SQL Editor (Dashboard → SQL Editor → New query)

CREATE TABLE IF NOT EXISTS public.specialists (
  id             TEXT PRIMARY KEY,
  data           JSONB NOT NULL DEFAULT '{}',
  display_order  INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Row Level Security ────────────────────────────────────────────────────────
ALTER TABLE public.specialists ENABLE ROW LEVEL SECURITY;

-- Anyone (anon + authenticated) can read the specialists list
CREATE POLICY "specialists_public_select"
  ON public.specialists FOR SELECT
  USING (true);

-- Only authenticated users (admin at app level) can write
CREATE POLICY "specialists_auth_insert"
  ON public.specialists FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "specialists_auth_update"
  ON public.specialists FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "specialists_auth_delete"
  ON public.specialists FOR DELETE
  TO authenticated
  USING (true);

-- ── Auto-update updated_at ─────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS specialists_updated_at ON public.specialists;
CREATE TRIGGER specialists_updated_at
  BEFORE UPDATE ON public.specialists
  FOR EACH ROW EXECUTE PROCEDURE public.set_updated_at();
