"use client";

import React, { useEffect } from "react";
import {
  Authenticator,
  Heading,
  Radio,
  RadioGroupField,
  useAuthenticator,
  View,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useRouter, usePathname } from "next/navigation";
import { I18n } from "aws-amplify/utils";
import { translations } from "@aws-amplify/ui-react";
import { fetchAuthSession, signOut } from "aws-amplify/auth";
import { jwtDecode } from "jwt-decode";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


I18n.putVocabularies(translations);
I18n.setLanguage("es");

const components = {
  SignIn: {
    Header() {
      return (
        <View className="mt-4 mb-7 !text-center">
          <Heading level={1} className="!text-2xl !font-bold">
            Inicio de sesión
          </Heading>
          <p className="text-muted-foreground mt-2">
            <span className="font-bold">¡Bienvenido!</span> Accede o regístrate para explorar las propiedades disponibles.
          </p>
        </View>
      );
    },
    Footer() {
      const { toSignUp, toForgotPassword } = useAuthenticator();
      return (
        <View className="text-center mt-4">
          <p className="text-muted-foreground">
            ¿No estás registrado?{" "}
            <button
              onClick={toSignUp}
              className="text-primary hover:underline bg-transparent border-none p-0 font-bold"
            >
              Regístrate.
            </button>
          </p>
          <p className="text-muted-foreground">
            <button
              onClick={toForgotPassword}
              className="text-primary hover:underline bg-transparent border-none p-0 mt-2"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </p>
        </View>
      );
    },
  },

  SignUp: {
    Header() {
      return (
        <View className="mt-4 mb-7 !text-center">
          <Heading level={1} className="!text-2xl !font-bold">
            Registro
          </Heading>
          <p className="text-muted-foreground mt-2">
            <span className="font-bold">¡Bienvenido!</span> Crea una cuenta para contactar con propietarios de alojamientos.
          </p>
        </View>
      );
    },
    FormFields() {
      const { validationErrors } = useAuthenticator();
      return (
        <>
          <Authenticator.SignUp.FormFields />
          <RadioGroupField
            legend="Perfil"
            name="custom:role"
            errorMessage={validationErrors?.["custom:role"]}
            hasError={!!validationErrors?.["custom:role"]}
            isRequired
          >
            <Radio value="Estudiante">Estudiante</Radio>
            <Radio value="Propietario">Propietario</Radio>
          </RadioGroupField>
        </>
      );
    },
    Footer() {
      const { toSignIn } = useAuthenticator();
      return (
        <View className="text-center mt-4">
          <p className="text-muted-foreground">
            ¿Ya estás registrado?{" "}
            <button
              onClick={toSignIn}
              className="text-primary hover:underline bg-transparent border-none p-0 font-bold"
            >
              Inicia sesión.
            </button>
          </p>
        </View>
      );
    },
  },

};

const formFields = {
  signIn: {
    username: {
      order: 1,
      placeholder: "Introduce tu email",
      label: "Email",
      isRequired: true,
    },
    password: {
      order: 2,
      placeholder: "Introduce tu contraseña",
      label: "Password",
      isRequired: true,
    },
  },
  signUp: {
    name: {
      order: 1,
      placeholder: "Introduce tu nombre completo",
      label: "Nombre",
      isRequired: true,
    },
    username: {
      order: 2,
      placeholder: "Introduce tu email",
      label: "Email",
      isRequired: true,
    },
    password: {
      order: 3,
      placeholder: "Introduce tu contraseña",
      label: "Contraseña",
      isRequired: true,
    },
    confirm_password: {
      order: 4,
      placeholder: "Confirma tu contraseña",
      label: "Confirmar contraseña",
      isRequired: true,
    },
  },
  forgotPassword: {
    username: {
      order: 1,
      placeholder: "Introduce tu email",
      label: "Email",
      isRequired: true,
    },
  },
};

const Auth = ({ children }: { children?: React.ReactNode }) => {
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname.match(/^\/(login|registro|recuperar-contrasena)$/);

  useEffect(() => {
    if (!isAuthPage || !user) return;

    const crearUsuarioEnBD = async () => {
      try {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();
        
        if (!idToken) return;

        const payload: any = jwtDecode(idToken);
        const { email, name, ["custom:role"]: role } = payload;

        if (!email || !name || !role) return;
        if (role.toLowerCase() !== "estudiante" && role.toLowerCase() !== "propietario") return;

        const endpoint = role === "estudiante" ? "/estudiante" : "/propietario";

        await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ nombre: name, telefono: "" }),
        });
      } catch (err) {
        console.error("Error creando usuario:", err);
      }
    };

    crearUsuarioEnBD();
  }, [isAuthPage, user]);

  useEffect(() => {
    if (user && isAuthPage) {
      router.push("/");
    }
  }, [user, isAuthPage, router]);

  if (isAuthPage) {
    return (
      <div className="flex flex-col min-h-screen" style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}>
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <Authenticator
            initialState={
              pathname.includes("registro")
                ? "signUp"
                : pathname.includes("recuperar-contrasena")
                ? "forgotPassword"
                : "signIn"
            }
            components={components}
            formFields={formFields}
          />
        </main>
        <Footer />
      </div>
    );
  }else{
    return <>{children}</>;

  }

};

export default Auth;