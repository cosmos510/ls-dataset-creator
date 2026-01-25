import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.LSF_NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.LSF_NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.LSF_SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey)

export default supabase