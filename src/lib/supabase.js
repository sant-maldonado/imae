import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://grrcsarbbvexwdlocnqr.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_AMW03S5ma0E_OhkW-TIu6g_5tUbYejq'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
