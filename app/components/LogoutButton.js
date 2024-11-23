"use client";

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = async () => {
    if (session) {
      await signOut({ redirect: false });

      document.cookie = 'next-auth.session-token=; Max-Age=0; path=/;';
      document.cookie = 'next-auth.csrf-token=; Max-Age=0; path=/;';
      document.cookie = 'next-auth.callback-url=; Max-Age=0; path=/;';
    }
    router.push('/');
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
}