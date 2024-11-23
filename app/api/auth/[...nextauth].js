import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import supabase from '@/app/lib/supabase'; // Adjust the path to your supabase client

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

        const { data: user, error } = await supabase
          .from('users') // Ensure you're querying the correct table
          .select('id, email, password') // Adjust columns as needed
          .eq('email', email)
          .single();

        if (error || !user) {
          throw new Error('Invalid credentials');
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
          throw new Error('Invalid credentials');
        }

        return { id: user.id, email: user.email };
      },
    }),
  ],
  pages: {
    signIn: '/login',  // Path to your custom login page
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.email = token.email;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET, // Secure cookie
  session: {
    strategy: 'jwt',
  },
};

export default NextAuth(authOptions);