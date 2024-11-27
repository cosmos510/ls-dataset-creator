import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
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
      
        try {
          const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();
      
          if (error || !data) return null;
      
          const isValid = await bcrypt.compare(password, data.password);
          if (!isValid) return null;
      
          return { id: data.id, email: data.email };
        } catch (err) {
          console.error('Error during credentials login:', err);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id || token.id;
        token.email = user.email || token.email;
      }
    
      if (account?.provider === "google") {
        token.id = account.providerAccountId;
        token.email = user.email;
    
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", user.email)
          .single();
    
        if (error || !data) {
          try {
            const { data: newUser, error: insertError } = await supabase
              .from("users")
              .insert({
                email: user.email,
                username: user.name || user.email.split('@')[0],
                google_id: account.providerAccountId,
                password: null,
              })
              .single();
    
            console.log('New User Inserted:', newUser);
            console.error('Insert Error:', insertError);
    
            if (insertError) {
              console.error('Error saving Google user to the database:', insertError);
            } else {
              if (newUser && newUser.id) {
                token.id = newUser.id;
              } else {
                console.error('User inserted, but id is missing:', newUser);
              }
            }
          } catch (err) {
            console.error('Error saving Google user to the database:', err);
          }
        } else {
          token.id = data.id;
        }
      }
    
      return token;
    },

    async session({ session, token }) {
      if (token?.id) {
        session.user = {
          ...session.user,
          id: token.id,
          email: token.email,
        };
      }
    
      return session;
    },
  },
  secret: process.env.JWT_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };