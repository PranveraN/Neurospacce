# NeuroSphera — Database Migrations

## Si të ekzekutosh

**Herën e parë (databazë e re):**
1. Supabase Dashboard → SQL Editor
2. Hap `20260518000000_initial_schema.sql`
3. Kliko Run

**Nëse shton ndryshime të reja:**
Krijo skedar të ri me emër: `YYYYMMDDHHMMSS_description.sql`
Shembull: `20260601120000_add_notifications_table.sql`

## Tabelat

| Tabela | Qëllimi |
|---|---|
| `profiles` | Profili i çdo përdoruesi (role, plan, status) |
| `mood_entries` | Historia e humorit — 1 entry/ditë/user |
| `journal_entries` | Shënimet e ditarit |
| `appointments` | Rezervimet me psikologë |
| `specialists` | Psikologët (JSONB i plotë) |
| `feature_usage` | Gjurmim kuote për plan enforcement |

## Funksionet RPC

| Funksioni | Qëllimi |
|---|---|
| `check_and_use(feature)` | Kontrollon + inkremenon kuotën server-side |
| `get_usage(feature)` | Lexon numrin aktual të përdorimit |
| `handle_new_user()` | Trigger — krijon `profiles` row pas signup-it |
