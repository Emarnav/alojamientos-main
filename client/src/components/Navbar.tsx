"use client";

import { NAVBAR_HEIGHT } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "aws-amplify/auth";
import { Bell, MessageCircle, Plus, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { SidebarTrigger } from "./ui/sidebar";

const Navbar = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();

  const isDashboardPage =
    pathname.includes("/propietario") || pathname.includes("/estudiante");

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <div
      className="fixed top-0 left-0 w-full z-50 shadow-xl"
      style={{ height: `${NAVBAR_HEIGHT}px` }}
    >
      <div className="flex justify-between items-center w-full py-3 px-8 bg-primary-700 text-white">
        <div className="flex items-center gap-4 md:gap-6">
          {isDashboardPage && (
            <div className="md:hidden">
              <SidebarTrigger />
            </div>
          )}
          <Link
            href="/"
            className="cursor-pointer hover:!text-primary-300"
            scroll={false}
          >
              <Image
                src="/logo.webp"
                alt="UCHCEU Logo"
                width={160}
                height={40}
                className="object-contain"
              />
          </Link>
          {isDashboardPage && authUser && (
            <Button
              variant="secondary"
              className="md:ml-4 bg-primary-50 text-primary-700 hover:bg-secondary-500 hover:text-primary-50"
              onClick={() =>
                router.push(
                  authUser.userRole?.toLowerCase() === "Propietario"
                    ? "/propietario/nuevo-alojamiento"
                    : "/busqueda"
                )
              }
            >
              {authUser.userRole?.toLowerCase() === "Propiertario" ? (
                <>
                  <Plus className="h-4 w-4" />
                  <span className="hidden md:block ml-2">Añadir nuevo alojamiento</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span className="hidden md:block ml-2">
                    Buscar propiedades
                  </span>
                </>
              )}
            </Button>
          )}
        </div>
        {!isDashboardPage && (
          <div className="hidden md:block">
            <Link href="/busqueda">
              <Button
                variant="outline"
                className="text-white border-white bg-transparent hover:bg-white hover:text-primary-700 rounded-lg"
              >
                Buscar propiedades
              </Button>
            </Link>
          </div>
        )}
        <div className="flex items-center gap-5">
          {authUser ? (
            <>
              <Button
                variant="ghost"
                className="text-white hover:text-primary-700"
                onClick={() => {
                  const role = authUser.userRole?.toLowerCase();
                  if (role === "Propietario") {
                    router.push("/propietario/alojamientos");
                  } else if (role === "Estudiante") {
                    router.push("/estudiante/solicitudes");
                  } else if (role === "Admin") {
                    router.push("/admin/alojamientos");
                  }
                }}
              >
                Panel de control
              </Button>

              <Button
                variant="ghost"
                className="text-white hover:text-primary-700"
                onClick={handleSignOut}
              >
                Cerrar sesión
              </Button>

            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="outline"
                  className="text-white border-white bg-transparent hover:bg-white hover:text-primary-700 rounded-lg"
                >
                  Iniciar sesión
                </Button>
              </Link>
              <Link href="/registro">
                <Button
                  variant="secondary"
                  className="text-white bg-secondary-600 hover:bg-white hover:text-primary-700 rounded-lg"
                >
                  Crear cuenta
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
