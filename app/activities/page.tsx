import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/navbar";
import ResponsiveBackground from "@/components/responsive-background";

const libros = [
  {
    titulo: "Mi cerebro maravilloso",
    tituloIngles: "My Wonderful Brain",
    descripcion:
      "¡Descubre cómo funciona tu cerebro con juegos, desafíos y pequeñas aventuras científicas!",
    portada: "/book-covers/mi-cerebro.png",
    ruta: "/activities/my-wonderful-brain",
    edad: "3 a 8 años",
    color: "#F1E8FF",
  },
];

export default function ActividadesPage() {
  return (
    <main className="relative isolate min-h-screen">
      <ResponsiveBackground />
      <Navbar />

      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-24 pt-36 sm:px-8">

        {/* INTRODUCCIÓN */}
        <section className="mx-auto mb-16 max-w-3xl text-center">

          <span className="font-['Fredoka'] text-lg text-[#D984A4]">
            Little Science
          </span>

          <h1 className="mt-4 font-['Fredoka'] text-4xl font-semibold leading-tight text-[#66549B] sm:text-6xl">
            Pequeños juegos,
            <br />
            grandes descubrimientos
          </h1>

          <p className="mx-auto mt-6 max-w-2xl font-['Nunito'] text-lg leading-relaxed text-[#635B70]">
            ¡La aventura continúa después de leer!
            Cada libro de Ciencia Pequeñita
            tiene actividades especiales para
            aprender, explorar y divertirse.
          </p>

          <p className="mx-auto mt-4 max-w-2xl font-['Nunito'] text-lg leading-relaxed text-[#635B70]">
            Escoge tu libro favorito y
            prepárate para descubrir
            un mundo lleno de ciencia.
          </p>

        </section>

        {/* CATÁLOGO DE ACTIVIDADES */}
        <section className="mb-20">

          <div className="mb-10 text-center">
            <h2 className="font-['Fredoka'] text-3xl text-[#66549B] sm:text-4xl">
              ¡Elige tu aventura!
            </h2>

            <p className="mx-auto mt-4 max-w-2xl font-['Nunito'] text-lg text-[#635B70]">
              Cada historia esconde
              nuevos juegos por descubrir.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">

            {libros.map((libro) => (
              <article
                key={libro.titulo}
                className="w-full max-w-sm rounded-[32px] border border-purple-100 bg-white/95 p-7 shadow-md transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg"
              >

                {/* PORTADA */}
                <div
                  className="relative mb-6 aspect-[4/5] overflow-hidden rounded-[24px] p-4"
                  style={{
                    backgroundColor: libro.color,
                  }}
                >
                  <Image
                    src={libro.portada}
                    alt={`Portada de ${libro.titulo}`}
                    fill
                    sizes="(max-width: 640px) 100vw, 384px"
                    className="object-contain p-4"
                  />
                </div>

                {/* INFORMACIÓN */}
                <div className="text-center">

                  <span className="inline-block rounded-full bg-[#FCE8EF] px-5 py-2 font-['Nunito'] text-sm font-semibold text-[#C87899]">
                    {libro.edad}
                  </span>

                  {/* TÍTULO EN ESPAÑOL */}
                    <h3 className="mt-5 font-['Fredoka'] text-3xl text-[#66549B]">
                    {libro.titulo}
                    </h3>

                    {/* TÍTULO EN INGLÉS */}
                    <p
                    lang="en"
                    className="mt-1 font-['Fredoka'] text-xl text-[#C87899]"
                    >
                    {libro.tituloIngles}
                    </p>

                  <p className="mt-4 font-['Nunito'] text-base leading-relaxed text-[#635B70]">
                    {libro.descripcion}
                  </p>

                  {/* BOTÓN JUGAR */}
                  <Link
                    href={libro.ruta}
                    className="mt-7 block rounded-full bg-[#B8A0E6] px-8 py-4 text-center font-['Fredoka'] text-xl font-semibold text-white shadow-sm transition-colors hover:bg-[#9E83D3]"
                  >
                    ¡JUGAR!
                  </Link>

                </div>
              </article>
            ))}

          </div>
        </section>

        {/* MENSAJE FINAL */}
        <section className="rounded-[36px] bg-[#F1E8FF]/95 px-7 py-12 text-center shadow-md sm:px-14">

          <h2 className="font-['Fredoka'] text-3xl text-[#66549B] sm:text-4xl">
            ¡La curiosidad no tiene límites!
          </h2>

          <p className="mx-auto mt-6 max-w-2xl font-['Nunito'] text-lg leading-relaxed text-[#635B70]">
            Cada juego es una oportunidad
            para hacer preguntas, imaginar
            nuevas posibilidades y descubrir
            algo maravilloso.
          </p>

          <p className="mx-auto mt-4 max-w-2xl font-['Nunito'] text-lg leading-relaxed text-[#635B70]">
            Porque los grandes científicos
            también comenzaron siendo
            pequeños exploradores.
          </p>

        </section>

      </div>
    </main>
  );
}