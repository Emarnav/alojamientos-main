"use client";

import Link from "next/link";
import Image from "next/image";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-neutral-800 text-white py-6 w-full">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Logo CEU */}
        <div className="flex items-center">
          <Image
            src="/logo.webp"
            alt="UCH CEU"
            width={160}
            height={40}
            className="object-contain"
          />
        </div>

        {/* Enlaces legales */}
        <div className="flex flex-wrap gap-6 text-sm font-medium">
          <Link href="/aviso-legal" className="hover:underline">
            Aviso Legal
          </Link>
          <Link href="/privacy" className="hover:underline">
            Política de privacidad
          </Link>
          <Link href="/cookies" className="hover:underline">
            Política de Cookies
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
