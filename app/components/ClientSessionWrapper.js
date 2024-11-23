"use client";

import { SessionProvider } from "next-auth/react";

export default function ClientSessionWrapper({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}