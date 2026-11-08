"use client";

import { useState } from "react";
import Link from "next/link";

const links = [
  { label: "Inicio", href: "/" },
  { label: "Nuestros libros", href: "/our-books" },
  { label: "Actividades", href: "/activities" },
  { label: "Sobre nosotros", href: "#nosotros" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-4 left-0 z-50 w-full px-4">
      <nav className="mx-auto max-w-6xl rounded-[32px] border border-purple-100 bg-white px-5 py-3 shadow-[0_6px_25px_rgba(90,70,120,0.10)] md:px-8">
        <div className="flex items-center justify-between gap-4">

          {/* Marca */}
          <a
            href="#inicio"
            className="flex items-center gap-3"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAE2FF] text-2xl">
              ✿
            </span>

            <span className="font-['Fredoka'] text-xl font-semibold tracking-tight text-[#66549B] sm:text-2xl">
              Ciencia{" "}
              <span className="text-[#E48BA7]">
                Pequeñita
              </span>
            </span>
          </a>

          {/* Navegación escritorio */}
          <div className="hidden items-center gap-2 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 font-['Nunito'] text-sm font-bold text-[#635B70] transition-colors hover:bg-[#F2ECFF] hover:text-[#66549B]"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Botón tienda */}
          <a
            href="#tienda"
            className="hidden rounded-full bg-[#B6A1E5] px-5 py-2.5 font-['Fredoka'] font-medium text-white transition-all hover:-translate-y-0.5 hover:bg-[#9B83D2] md:block"
          >
            Ver tienda 
          </a>

          {/* Botón móvil */}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F2ECFF] text-xl text-[#66549B] md:hidden"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Menú móvil */}
        {menuOpen && (
          <div
            id="mobile-menu"
            className="mt-4 flex flex-col gap-2 border-t border-purple-100 pt-4 md:hidden"
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="rounded-2xl px-4 py-3 font-['Nunito'] font-bold text-[#635B70] hover:bg-[#F2ECFF]"
              >
                {link.label}
              </a>
            ))}

            <a
              href="#tienda"
              onClick={() => setMenuOpen(false)}
              className="mt-2 rounded-full bg-[#B6A1E5] px-5 py-3 text-center font-['Fredoka'] font-medium text-white"
            >
              Ver tienda 
            </a>
          </div>
        )}
      </nav>
    </header>
  );
}
