import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import supabase from '../../../lib/supabase';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .single();

        if (error || !data) return null;

        const isValid = await bcrypt.compare(password, data.password);
        if (!isValid) return null;

        return { id: data.id, email: data.email };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/auth/error",
    signOut: "/",
  },
  session: {
    jwt: true,
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
  secret: process.env.JWT_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };