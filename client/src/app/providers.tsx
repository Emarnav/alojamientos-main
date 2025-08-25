"use client";

import { Amplify } from "aws-amplify";

import StoreProvider from "@/state/redux";
import { Authenticator } from "@aws-amplify/ui-react";
import Auth from "./(auth)/authProvider";

// Debug: Verificar variables de entorno
console.log('🔧 Configuración de Cognito:');
console.log('User Pool ID:', process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID);
console.log('Client ID:', process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID);

// Usar valores hardcoded temporalmente mientras se resuelve el problema de variables de entorno
const cognitoConfig = {
  userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID || "eu-west-3_p28VlhMWK",
  userPoolClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID || "2r1fm39255mocklti7m0sdb7qc",
};

console.log('🎯 Configuración final:', cognitoConfig);

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
