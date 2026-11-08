
import Link from "next/link";
import Navbar from "@/components/navbar";
import ResponsiveBackground from "@/components/responsive-background";

const books = [
  {
    title: "Mi cerebro maravilloso",
    english: "My Wonderful Brain",
    description:
      "Descubre cómo funciona nuestro cerebro y cómo nos ayuda a pensar, sentir y aprender.",
    topics: ["Cerebro", "Emociones", "Aprendizaje"],
    image: "/images/mi-cerebro.png",
    slug: "mi-cerebro-maravilloso",
  },
];

export default function OurBooks() {
  return (
    <main className="relative isolate min-h-screen">
      <ResponsiveBackground />
      <Navbar />

      <section className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-40 sm:px-8">
        <div className="mb-12 text-center">
          <h1 className="font-['Fredoka'] text-4xl font-semibold text-[#66549B] sm:text-6xl">
            Nuestros libros
          </h1>

          <p className="mx-auto mt-5 max-w-2xl font-['Nunito'] text-lg text-[#635B70]">
            Historias bilingües de ciencia para
            pequeñas mentes curiosas, creadas
            con cariño, juego e imaginación
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {books.map((book) => (
            <article
              key={book.slug}
              className="flex flex-col overflow-hidden rounded-[32px] border border-purple-100 bg-white/95 p-5 shadow-lg transition-transform duration-300 hover:-translate-y-2"
            >
              <div className="flex h-64 items-center justify-center overflow-hidden rounded-[24px] bg-[#F2ECFF]">
                <img
                  src={book.image}
                  alt={`Portada de ${book.title}`}
                  className="h-full w-full object-contain"
                />
              </div>

              <h2 className="mt-5 font-['Fredoka'] text-2xl font-semibold text-[#66549B]">
                {book.title}
              </h2>

              <p className="font-['Fredoka'] text-lg text-[#E48BA7]">
                {book.english}
              </p>

              <p className="mt-4 flex-1 font-['Nunito'] text-[#635B70]">
                {book.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {book.topics.map((topic) => (
                  <span
                    key={topic}
                    className="rounded-full bg-[#FFF0D8] px-3 py-1 font-['Nunito'] text-xs font-bold text-[#946C39]"
                  >
                    {topic}
                  </span>
                ))}
              </div>

              <Link
                href={`/our-books/${book.slug}`}
                className="mt-7 rounded-full bg-[#B6A1E5] px-6 py-3 text-center font-['Fredoka'] font-medium text-white transition-colors hover:bg-[#9B83D2]"
              >
                Conocer más
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
