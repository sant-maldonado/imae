import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://grrcsarbbvexwdlocnqr.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycmNzYXJiYnZleHdkbG9jbnFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MDk3ODIsImV4cCI6MjA5NTQ4NTc4Mn0.jk7F4yBkh31D6VQ9pPyb8gcIkRnwgeR2DHjwNYSWCgM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
