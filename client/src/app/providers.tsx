"use client";

import { Amplify } from "aws-amplify";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css"; // <- importante

import StoreProvider from "@/state/redux";
import Auth from "./(auth)/authProvider";

// Si tu pool es "eu-west-3_xxx", la región es "eu-west-3"
const REGION = process.env.NEXT_PUBLIC_AWS_REGION || "eu-west-3";

const cognitoConfig = {
  region: REGION, // <- FALTABA
  userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID || "eu-west-3_p28VlhMWK",
  userPoolClientId:
    process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID || "2r1fm39255mocklti7m0sdb7qc",
  // opcional, si solo quieres login por email:
  loginWith: { email: true, username: false },
};

Amplify.configure({
  Auth: {
    Cognito: cognitoConfig,
  },
});

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <Authenticator.Provider>
        <div>
          <Auth>{children}</Auth>
        </div>
      </Authenticator.Provider>
    </StoreProvider>
  );
};

export default Providers;
