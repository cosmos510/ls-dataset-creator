import bcrypt from 'bcryptjs';
import supabase from '@/app/lib/supabase';

export async function POST(req) {
  const { username, email, password } = await req.json();

  if (!username || !email || !password) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const { data, error } = await supabase
    .from('users')
    .insert([{ username, email, password: hashedPassword }]);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ message: 'User registered successfully' }), { status: 201 });
}