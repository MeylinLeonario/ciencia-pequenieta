import Link from "next/link";
import Navbar from "@/components/navbar";
import ResponsiveBackground from "@/components/responsive-background";
import type { ReactNode } from "react";

type Props = {
  titulo: string;
  tituloIngles: string;
  descripcion: string;
  children: ReactNode;
};

export default function GameLayout({
  titulo,
  tituloIngles,
  descripcion,
  children,
}: Props) {
  return (
    <main className="relative isolate min-h-screen">
      <ResponsiveBackground />
      <Navbar />

      <div className="relative z-10 mx-auto max-w-5xl px-5 pb-24 pt-36 sm:px-8">
        <section className="mb-10 text-center">
          <span className="rounded-full bg-[#FCE8EF] px-6 py-2 font-['Fredoka'] text-[#C87899]">
            3 a 4 años
          </span>

          <h1 className="mt-7 font-['Fredoka'] text-4xl text-[#66549B] sm:text-5xl">
            {titulo}
          </h1>

          <p lang="en" className="mt-2 font-['Fredoka'] text-xl text-[#C87899]">
            {tituloIngles}
          </p>

          <p className="mx-auto mt-5 max-w-2xl font-['Nunito'] text-lg text-[#635B70]">
            {descripcion}
          </p>
        </section>

        <section className="rounded-[36px] bg-white/95 p-6 shadow-md sm:p-10">
          {children}
        </section>

        <div className="mt-8 text-center">
          <Link
            href="/activities/my-wonderful-brain"
            className="inline-block rounded-full bg-white/95 px-7 py-3 font-['Fredoka'] text-[#66549B] shadow-md"
          >
            ← Volver a los juegos
          </Link>
        </div>
      </div>
    </main>
  );
}