"use client";

import { Authenticator } from "@aws-amplify/ui-react";
import AuthProvider from "./authProvider"; // solo aquí

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Authenticator.Provider>
      <AuthProvider>{children}</AuthProvider>
    </Authenticator.Provider>
  );
}
