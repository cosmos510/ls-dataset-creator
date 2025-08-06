import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.LSF_NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.LSF_NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase