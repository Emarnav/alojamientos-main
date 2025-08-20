"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (!authUser) {
      setIsLoading(false);
      return;
    }

    const userRole = authUser.userRole?.toLowerCase();

    if (userRole === "propietario" && pathname === "/") {
      router.push("/propietario/alojamientos", { scroll: false });
    } else {
      setIsLoading(false);
    }
  }, [authUser, authLoading, router, pathname]);

  if (authLoading || isLoading) return <>Cargando...</>;

  return (
    <div>
      <Navbar />
      <main
        className={`h-full flex w-full flex-col container mx-auto`}
        style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;