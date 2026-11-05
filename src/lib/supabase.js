import { createClient } from '@supabase/supabase-js'

// Both values come from Supabase → Project Settings → API. The anon key is meant to be public;
// what protects your data is the row-level security in supabase/schema.sql.
const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

// null means "not configured": the app falls back to the browser-only demo mode.
export const supabase = url && key ? createClient(url, key) : null
