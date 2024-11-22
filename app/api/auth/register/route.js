import bcrypt from 'bcryptjs'
import supabase from '@/app/lib/supabase'
import PasswordValidator from 'password-validator'

const passwordSchema = new PasswordValidator()
  .is().min(8)
  .has().uppercase()
  .has().lowercase()
  .has().digits()
  .has().symbols();

  export async function POST(req) {
    const { username, email, password } = await req.json()
  
    if (!username || !email || !password) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
    }
  
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email format' }), { status: 400 })
    }
  
    const passwordValid = passwordSchema.validate(password)
    if (!passwordValid) {
      return new Response(JSON.stringify({ error: 'Password must contain at least 8 characters, including uppercase, lowercase, digits, and symbols' }), { status: 400 })
    }
  
    try {
      const hashedPassword = await bcrypt.hash(password, 12)
  
      const { data, error } = await supabase
        .from('users')
        .insert([{ username, email, password: hashedPassword }])
  
      if (error) {
        console.error(error.message)
        return new Response(JSON.stringify({ error: 'Failed to register user' }), { status: 400 })
      }
  
  
      return new Response(JSON.stringify({ message: 'User registered successfully', user: data }), { status: 200 })
    } catch (err) {
      console.error("Unexpected error:", err)
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
    }
  }