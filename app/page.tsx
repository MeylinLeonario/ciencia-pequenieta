import Navbar from "@/components/navbar";
import ResponsiveBackground from "@/components/responsive-background";
import Image from "next/image";

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <ResponsiveBackground/>
      <div className="relative z-10">
        <Navbar />

        <section
          id="inicio"
          className="flex min-h-screen flex-col items-center justify-center px-6 pt-28 text-center"
        >
          <h1 className="font-['Fredoka'] text-5xl font-semibold text-[#66549B] md:text-7xl">
            Ciencia Pequeñita
          </h1>

          <p className="mt-5 max-w-xl font-['Nunito'] text-lg text-[#635B70]">
            Grandes descubrimientos para pequeñas
            mentes curiosas
          </p>
        </section>
      </div>
    </main>
  );
}
