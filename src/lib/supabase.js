import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!url || !key) {
  throw new Error(
    '[NeuroSphera] Mungojnë variablat e mjedisit.\n' +
    'Kopjo .env.example si .env.local dhe plotëso VITE_SUPABASE_URL dhe VITE_SUPABASE_ANON_KEY.'
  )
}

export const supabase = createClient(url, key, {
  auth: {
    persistSession:     true,
    autoRefreshToken:   true,
    detectSessionInUrl: true,
    storageKey:         'ns_auth',
  },
})
