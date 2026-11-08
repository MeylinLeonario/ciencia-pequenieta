import Link from "next/link";
import Navbar from "@/components/navbar";
import ResponsiveBackground from "@/components/responsive-background";


const niveles = [
  {
    edad: "3 a 4 años",
    titulo: "Pequeños descubridores",
    tituloIngles: "Little Discoverers",
    descripcion: "¡Vamos a conocer nuestro cerebro!",
    color: "#FCE8EF",
    accent: "#C87899",
    juegos: [
      {
        icono: "🧠",
        titulo: "Conoce tu cerebro",
        tituloIngles: "Meet Your Brain",
        descripcion:
          "Toca, descubre y escucha los nombres de sus partes.",
        slug: "meet-your-brain",
      },
      {
        icono: "🎨",
        titulo: "Colores del cerebro",
        tituloIngles: "Brain Colors",
        descripcion:
          "¡Pinta tu cerebro siguiendo pequeñas pistas!",
        slug: "brain-colors",
      },
      {
        icono: "😊",
        titulo: "¿Cómo me siento?",
        tituloIngles: "How Do I Feel?",
        descripcion:
          "Descubre emociones y aprende a reconocerlas.",
        slug: "how-do-i-feel",
      },
    ],
  },
  {
    edad: "5 a 6 años",
    titulo: "Grandes exploradores",
    tituloIngles: "Great Explorers",
    descripcion: "¡Nuestro cerebro tiene mucho que enseñarnos!",
    color: "#F1E8FF",
    accent: "#66549B",
    juegos: [
      {
        icono: "🧩",
        titulo: "Arma tu cerebro",
        tituloIngles: "Build Your Brain",
        descripcion:
          "Completa un rompecabezas del cerebro.",
        slug: "build-your-brain",
      },
      {
        icono: "👀",
        titulo: "¿Quién hace qué?",
        tituloIngles: "Who Does What?",
        descripcion:
          "Relaciona distintas funciones con el cerebro.",
        slug: "who-does-what",
      },
      {
        icono: "⚡",
        titulo: "Mensajes veloces",
        tituloIngles: "Speedy Messages",
        descripcion:
          "Ayuda a las neuronas a enviar sus mensajes.",
        slug: "speedy-messages",
      },
    ],
  },
  {
    edad: "7 a 8 años",
    titulo: "Científicos curiosos",
    tituloIngles: "Curious Scientists",
    descripcion: "¡Es hora de resolver nuevos desafíos!",
    color: "#E8F2E5",
    accent: "#58764E",
    juegos: [
      {
        icono: "🔬",
        titulo: "Detectives del cerebro",
        tituloIngles: "Brain Detectives",
        descripcion:
          "Resuelve misterios sobre el cerebro y sus funciones.",
        slug: "brain-detectives",
      },
      {
        icono: "💭",
        titulo: "Misión memoria",
        tituloIngles: "Memory Mission",
        descripcion:
          "Pon a prueba tu memoria con secuencias divertidas.",
        slug: "memory-mission",
      },
      {
        icono: "🚀",
        titulo: "Neuroaventura",
        tituloIngles: "Neuro Adventure",
        descripcion:
          "Supera misiones usando todo lo aprendido.",
        slug: "neuro-adventure",
      },
    ],
  },
];


export default function MiCerebroMaravilloso() {
  return (
    <main className="relative isolate min-h-screen">
      <ResponsiveBackground />
      <Navbar />

      <div className="relative z-10 mx-auto max-w-6xl px-5 pb-24 pt-36 sm:px-8">

        {/* INTRODUCCIÓN */}
        <section className="mx-auto mb-16 max-w-3xl text-center">
          <span className="font-['Fredoka'] text-lg text-[#D984A4]">
            My Wonderful Brain
          </span>

          <h1 className="mt-4 font-['Fredoka'] text-4xl font-semibold leading-tight text-[#66549B] sm:text-6xl">
            ¡Mi cerebro maravilloso!
          </h1>

          <p className="mx-auto mt-6 max-w-2xl font-['Nunito'] text-lg leading-relaxed text-[#635B70]">
            ¡Bienvenidos a una aventura dentro de nuestro cerebro!
            Aquí encontrarás nueve juegos para descubrir,
            explorar y aprender mientras te diviertes.
          </p>

          <Link
            href="/activities"
            className="mt-7 inline-block rounded-full bg-white/95 px-6 py-3 font-['Fredoka'] text-[#66549B] shadow-sm transition-colors hover:bg-[#F1E8FF]"
          >
            ← Volver a actividades
          </Link>
        </section>

        {/* NIVELES */}
        <div className="space-y-12">
          {niveles.map((nivel) => (
            <section
              key={nivel.edad}
              className="rounded-[36px] border border-white/80 bg-white/95 p-6 shadow-md sm:p-10"
            >
              {/* ENCABEZADO DEL NIVEL */}
              <div className="mb-8 text-center">
                <span
                  className="inline-block rounded-full px-6 py-2 font-['Fredoka'] text-lg"
                  style={{
                    backgroundColor: nivel.color,
                    color: nivel.accent,
                  }}
                >
                  {nivel.edad}
                </span>

                <h2 className="mt-5 font-['Fredoka'] text-3xl text-[#66549B] sm:text-4xl">
                {nivel.titulo}
                </h2>

                <p
                lang="en"
                className="mt-1 font-['Fredoka'] text-xl text-[#C87899]"
                >
                {nivel.tituloIngles}
                </p>

                <p className="mt-3 font-['Nunito'] text-lg text-[#635B70]">
                  {nivel.descripcion}
                </p>
              </div>

              {/* JUEGOS */}
              <div className="grid gap-6 md:grid-cols-3">
                {nivel.juegos.map((juego) => (
                  <article
                    key={juego.slug}
                    className="flex flex-col rounded-[28px] p-6 text-center transition-transform duration-300 hover:-translate-y-1"
                    style={{
                      backgroundColor: nivel.color,
                    }}
                  >
                    <div className="mb-5 text-5xl">
                      {juego.icono}
                    </div>

                    {/* TÍTULO EN ESPAÑOL */}
                    <h3 className="font-['Fredoka'] text-2xl text-[#66549B]">
                    {juego.titulo}
                    </h3>

                    {/* TÍTULO EN INGLÉS */}
                    <p
                    lang="en"
                    className="mt-1 font-['Fredoka'] text-lg text-[#C87899]"
                    >
                    {juego.tituloIngles}
                    </p>

                    <p className="mt-4 flex-1 font-['Nunito'] leading-relaxed text-[#635B70]">
                      {juego.descripcion}
                    </p>

                    <Link
                      href={`/activities/my-wonderful-brain/${juego.slug}`}
                      className="mt-7 block rounded-full bg-white px-6 py-3 font-['Fredoka'] text-lg font-semibold text-[#66549B] shadow-sm transition-colors hover:bg-white/70"
                    >
                      ¡JUGAR!
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* MENSAJE FINAL */}
        <section className="mt-16 rounded-[36px] bg-[#F1E8FF]/95 px-7 py-12 text-center shadow-md sm:px-14">
          <h2 className="font-['Fredoka'] text-3xl text-[#66549B] sm:text-4xl">
            ¡Tu cerebro es maravilloso!
          </h2>

          <p className="mx-auto mt-5 max-w-2xl font-['Nunito'] text-lg leading-relaxed text-[#635B70]">
            Cada vez que juegas, preguntas y descubres
            algo nuevo, estás aprendiendo.
            ¡Sigue explorando!
          </p>
        </section>

      </div>
    </main>
  );
}