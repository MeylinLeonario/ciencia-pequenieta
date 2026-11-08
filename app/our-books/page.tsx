
import Navbar from "@/components/navbar";
import ResponsiveBackground from "@/components/responsive-background";

const methods = [
  {
    icon: "🎧",
    title: "Escuchamos",
    description:
      "Audios en español e inglés para descubrir nuevas palabras, escuchar su pronunciación y familiarizarnos con ambos idiomas.",
    color: "#F1E8FF",
  },
  {
    icon: "🎮",
    title: "Jugamos",
    description:
      "Juegos interactivos relacionados con las historias para reconocer conceptos, asociar palabras y aprender jugando.",
    color: "#FCE8EF",
  },
  {
    icon: "🔬",
    title: "Exploramos",
    description:
      "Preguntas, observaciones y pequeñas actividades científicas que conectan las historias con el mundo real.",
    color: "#E8F2E5",
  },
];

export default function OurBooks() {
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
            Pequeños libros,
            <br />
            grandes descubrimientos
          </h1>

          <p className="mx-auto mt-6 max-w-2xl font-['Nunito'] text-lg leading-relaxed text-[#635B70]">
            En Ciencia Pequeñita creemos que nunca
            es demasiado temprano para comenzar
            a descubrir el mundo.
          </p>

          <p className="mx-auto mt-4 max-w-2xl font-['Nunito'] text-lg leading-relaxed text-[#635B70]">
            Creamos historias bilingües que unen
            ciencia, creatividad y juego, para
            que aprender se convierta en una
            aventura compartida.
          </p>
        </section>

        {/* MISIÓN Y VISIÓN */}
        <section className="mb-20 grid gap-6 md:grid-cols-2">
          <article className="rounded-[32px] border border-pink-100 bg-white/95 p-8 shadow-md sm:p-10">

            <h2 className="font-['Fredoka'] text-3xl text-[#C87899]">
              Nuestra misión
            </h2>

            <p className="mt-5 font-['Nunito'] text-lg leading-relaxed text-[#635B70]">
              Acercar la ciencia y el inglés
              a niñas y niños mediante libros
              bilingües, ilustraciones
              artesanales y experiencias
              educativas que despierten
              su curiosidad.
            </p>
          </article>

          <article className="rounded-[32px] border border-purple-100 bg-white/95 p-8 shadow-md sm:p-10">

            <h2 className="font-['Fredoka'] text-3xl text-[#66549B]">
              Nuestra visión
            </h2>

            <p className="mt-5 font-['Nunito'] text-lg leading-relaxed text-[#635B70]">
              Soñamos con una infancia donde
              la ciencia sea cercana, divertida
              y accesible, y donde cada
              pregunta sea una oportunidad
              para imaginar, experimentar
              y descubrir.
            </p>
          </article>
        </section>

        {/* EDADES */}
        <section className="mb-20 rounded-[36px] bg-white/95 px-6 py-12 text-center shadow-md sm:px-12">

          <h2 className="mt-4 font-['Fredoka'] text-3xl text-[#66549B] sm:text-4xl">
            ¿Para quiénes son nuestros libros?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl font-['Nunito'] text-lg leading-relaxed text-[#635B70]">
            Nuestros libros están pensados
            principalmente para niñas y niños
            de 3 a 8 años, con experiencias
            que pueden adaptarse a distintas
            etapas de desarrollo.
          </p>

          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {[
              {
                age: "3 a 4 años",
                title: "Descubrir",
                description:
                  "Imágenes, sonidos, preguntas sencillas y lectura acompañada.",
                color: "#FCE8EF",
              },
              {
                age: "5 a 6 años",
                title: "Explorar",
                description:
                  "Historias, vocabulario bilingüe, asociaciones y juegos.",
                color: "#F1E8FF",
              },
              {
                age: "7 a 8 años",
                title: "Comprender",
                description:
                  "Conceptos científicos, razonamiento y actividades con mayor autonomía.",
                color: "#E8F2E5",
              },
            ].map((stage) => (
              <div
                key={stage.age}
                className="rounded-[24px] p-6"
                style={{ backgroundColor: stage.color }}
              >
                <h3 className="font-['Fredoka'] text-xl text-[#66549B]">
                  {stage.age}
                </h3>

                <p className="mt-2 font-['Fredoka'] text-lg text-[#C87899]">
                  {stage.title}
                </p>

                <p className="mt-3 font-['Nunito'] text-sm leading-relaxed text-[#635B70]">
                  {stage.description}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-6 font-['Nunito'] text-sm text-[#847B8D]">
            Edades orientativas: cada niño
            aprende a su propio ritmo.
          </p>
        </section>

        {/* APRENDIZAJE BILINGÜE */}
        <section className="mb-20">
          <div className="mb-10 text-center">
            <h2 className="font-['Fredoka'] text-3xl text-[#66549B] sm:text-4xl">
              ¿Cómo aprendemos inglés?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl font-['Nunito'] text-lg text-[#635B70]">
              No se trata de memorizar listas
              de palabras, sino de escuchar,
              jugar y descubrir su significado
              dentro de una historia.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {methods.map((method) => (
              <article
                key={method.title}
                className="rounded-[30px] border border-white bg-white/95 p-7 text-center shadow-md"
              >
                <div
                  className="mx-auto flex h-20 w-20 items-center justify-center rounded-full text-4xl"
                  style={{
                    backgroundColor: method.color,
                  }}
                >
                  {method.icon}
                </div>

                <h3 className="mt-6 font-['Fredoka'] text-2xl text-[#66549B]">
                  {method.title}
                </h3>

                <p className="mt-4 font-['Nunito'] leading-relaxed text-[#635B70]">
                  {method.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* FILOSOFÍA */}
        <section className="rounded-[36px] bg-[#F1E8FF]/95 px-7 py-12 text-center shadow-md sm:px-14">

          <h2 className="mt-5 font-['Fredoka'] text-3xl text-[#66549B] sm:text-4xl">
            Hechos con cariño,
            pensados para descubrir
          </h2>

          <p className="mx-auto mt-6 max-w-2xl font-['Nunito'] text-lg leading-relaxed text-[#635B70]">
            Cada historia nace de una idea
            sencilla: la curiosidad merece
            ser acompañada.
          </p>

          <p className="mx-auto mt-4 max-w-2xl font-['Nunito'] text-lg leading-relaxed text-[#635B70]">
            Por eso combinamos ilustraciones
            de inspiración artesanal,
            ciencia explicada con sencillez
            y recursos bilingües para
            compartir momentos de aprendizaje
            en familia.
          </p>
        </section>
      </div>
    </main>
  );
}
