import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://grrcsarbbvexwdlocnqr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdycmNzYXJiYnZleHdkbG9jbnFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk5MDk3ODIsImV4cCI6MjA5NTQ4NTc4Mn0.jk7F4yBkh31D6VQ9pPyb8gcIkRnwgeR2DHjwNYSWCgM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { detectSessionInUrl: false },
})

export function toCamel(str) {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
}

export function camelize(val) {
  if (Array.isArray(val)) return val.map(camelize)
  if (val && typeof val === 'object' && val.constructor === Object) {
    return Object.fromEntries(
      Object.entries(val).map(([k, v]) => [toCamel(k), camelize(v)])
    )
  }
  return val
}
