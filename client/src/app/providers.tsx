"use client";

import { Amplify } from "aws-amplify";

import StoreProvider from "@/state/redux";
import { Authenticator } from "@aws-amplify/ui-react";
import Auth from "./(auth)/authProvider";

// Debug: Verificar que las variables de entorno se carguen correctamente
console.log('🔧 Configuración de Cognito:');
console.log('User Pool ID:', process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID);
console.log('Client ID:', process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID);

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID!,
    },
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
