// app/api/auth/register/route.js
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.LSF_SUPABASE_URL,
  process.env.LSF_NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(req) {
  const { username, email, password } = await req.json()

  if (!username || !email || !password) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    // Insert into Supabase
    const { data, error } = await supabase
      .from('users')
      .insert([{ username, email, password: hashedPassword }])

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 })
    }

    return new Response(JSON.stringify({ data }), { status: 200 })
  } catch (err) {
    console.error("Unexpected error:", err)
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
  }
}