import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import supabase from '@/app/lib/supabase';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
      
        console.log('Login attempt with email:', email);
      
        const { data: user, error } = await supabase
          .from('users')
          .select('id, email, password') // Select only necessary fields
          .eq('email', email);
      
        console.log('User Query Result:', user, 'Error:', error);
      
        if (!user || user.length === 0) {
          console.error('Invalid credentials: User not found');
          throw new Error('Invalid credentials');
        }
      
        const foundUser = user[0]; // First result
        const isValid = await bcrypt.compare(password, foundUser.password);
      
        if (!isValid) {
          console.error('Invalid credentials: Incorrect password');
          throw new Error('Invalid credentials');
        }
      
        return { id: foundUser.id, email: foundUser.email };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.id; // Attach user ID to session
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Store user ID in token
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Required for secure cookies
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };