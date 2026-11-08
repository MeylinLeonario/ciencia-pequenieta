
"use client";

import { useEffect, useState } from "react";
import GameLayout from "@/components/game-layout";

const emociones = [
  {
    id: "feliz",
    icono: "😊",
    nombre: "Feliz",
    ingles: "Happy",
    color: "#FFF0C9",
  },
  {
    id: "triste",
    icono: "😢",
    nombre: "Triste",
    ingles: "Sad",
    color: "#E4F1FF",
  },
  {
    id: "asustado",
    icono: "😨",
    nombre: "Asustado",
    ingles: "Scared",
    color: "#F1E8FF",
  },
  {
    id: "enojado",
    icono: "😠",
    nombre: "Enojado",
    ingles: "Angry",
    color: "#FCE8EF",
  },
  {
    id: "sorprendido",
    icono: "😮",
    nombre: "Sorprendido",
    ingles: "Surprised",
    color: "#FFEAD9",
  },
  {
    id: "tranquilo",
    icono: "😌",
    nombre: "Tranquilo",
    ingles: "Calm",
    color: "#E8F2E5",
  },
  {
    id: "emocionado",
    icono: "🤩",
    nombre: "Emocionado",
    ingles: "Excited",
    color: "#FFF0D9",
  },
  {
    id: "confundido",
    icono: "😕",
    nombre: "Confundido",
    ingles: "Confused",
    color: "#EAE6FA",
  },
];

const situaciones = [
  {
    es: "¡Hoy voy a jugar con mis amigos!",
    en: "Today I'm going to play with my friends!",
    sugeridas: ["feliz", "emocionado"],
  },
  {
    es: "Mi juguete favorito se rompió.",
    en: "My favorite toy broke.",
    sugeridas: ["triste", "enojado"],
  },
  {
    es: "Escuché un ruido muy fuerte de repente.",
    en: "I suddenly heard a very loud noise.",
    sugeridas: ["asustado", "sorprendido"],
  },
  {
    es: "Alguien tomó mi juguete sin preguntarme.",
    en: "Someone took my toy without asking.",
    sugeridas: ["enojado", "triste"],
  },
  {
    es: "¡Me prepararon una fiesta sorpresa!",
    en: "They threw me a surprise party!",
    sugeridas: ["sorprendido", "feliz", "emocionado"],
  },
  {
    es: "Estoy descansando mientras escucho música suave.",
    en: "I'm resting while listening to soft music.",
    sugeridas: ["tranquilo", "feliz"],
  },
  {
    es: "¡Mañana iremos a conocer un lugar nuevo!",
    en: "Tomorrow we're visiting a new place!",
    sugeridas: ["emocionado", "feliz", "asustado"],
  },
  {
    es: "No entiendo cómo funciona este juguete.",
    en: "I don't understand how this toy works.",
    sugeridas: ["confundido", "enojado"],
  },
  {
    es: "Mi mamá me dio un abrazo.",
    en: "My mom gave me a hug.",
    sugeridas: ["feliz", "tranquilo"],
  },
  {
    es: "No encuentro mi peluche favorito.",
    en: "I can't find my favorite stuffed animal.",
    sugeridas: ["triste", "asustado", "confundido"],
  },
  {
    es: "¡Aprendí a hacer algo que antes no podía!",
    en: "I learned to do something I couldn't do before!",
    sugeridas: ["feliz", "emocionado", "sorprendido"],
  },
  {
    es: "Llegué a un lugar donde no conozco a nadie.",
    en: "I arrived somewhere where I don't know anyone.",
    sugeridas: ["asustado", "confundido", "emocionado"],
  },
];

type Emocion = (typeof emociones)[number];
type Situacion = (typeof situaciones)[number];

function mezclar<T,>(elementos: T[]): T[] {
  const resultado = [...elementos];

  for (let i = resultado.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [resultado[i], resultado[j]] = [
      resultado[j],
      resultado[i],
    ];
  }

  return resultado;
}

function crearPartida() {
  return mezclar(situaciones)
    .slice(0, 8)
    .map((situacion) => ({
      ...situacion,
      opciones: mezclar(emociones),
    }));
}

export default function ComoMeSiento() {
  const [partida, setPartida] = useState<
    ReturnType<typeof crearPartida> | null
  >(null);

  const [paso, setPaso] = useState(0);
  const [seleccion, setSeleccion] = useState<Emocion | null>(null);
  const [respuestas, setRespuestas] = useState<string[]>([]);
  const [voces, setVoces] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const cargarVoces = () => {
      setVoces(window.speechSynthesis.getVoices());
    };

    cargarVoces();

    window.speechSynthesis.addEventListener(
      "voiceschanged",
      cargarVoces
    );

    return () => {
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        cargarVoces
      );

      window.speechSynthesis.cancel();
    };
  }, []);

  function escuchar(texto: string, idioma: "es" | "en") {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const mensaje = new SpeechSynthesisUtterance(texto);

    mensaje.lang = idioma === "es" ? "es-CL" : "en-US";
    mensaje.rate = 0.82;
    mensaje.pitch = 1;

    const voz =
      voces.find(
        (v) =>
          v.lang.toLowerCase() ===
          (idioma === "es" ? "es-cl" : "en-us")
      ) ??
      voces.find((v) =>
        v.lang.toLowerCase().startsWith(idioma)
      );

    if (voz) {
      mensaje.voice = voz;
      mensaje.lang = voz.lang;
    }

    window.speechSynthesis.speak(mensaje);
  }

  function comenzar() {
    window.speechSynthesis?.cancel();

    setPartida(crearPartida());
    setPaso(0);
    setSeleccion(null);
    setRespuestas([]);
  }

  function responder(emocion: Emocion) {
    if (seleccion) return;

    setSeleccion(emocion);
    setRespuestas((actual) => [...actual, emocion.id]);
  }

  function siguiente() {
    window.speechSynthesis?.cancel();

    setSeleccion(null);
    setPaso((actual) => actual + 1);
  }

  const terminado = partida !== null && paso >= partida.length;
  const pregunta = partida?.[paso];

  const esSugerida =
    pregunta && seleccion
      ? pregunta.sugeridas.includes(seleccion.id)
      : false;

  return (
    <GameLayout
      titulo="¿Cómo me siento?"
      tituloIngles="How Do I Feel?"
      descripcion="¡Descubre las emociones y aprende a expresar cómo te sientes!"
    >
      {!partida ? (
        /* PANTALLA INICIAL */
        <div className="py-10 text-center">
          <h2 className="font-['Fredoka'] text-3xl text-[#66549B]">
            ¡Todas las emociones son importantes!
          </h2>

          <p className="mx-auto mt-5 max-w-xl font-['Nunito'] text-lg leading-relaxed text-[#635B70]">
            Escucha pequeñas historias, observa las caritas
            y descubre cómo podrías sentirte.
            ¡No hay emociones malas!
          </p>

          <div className="mx-auto mt-8 flex max-w-lg flex-wrap justify-center gap-4">
            {emociones.map((emocion) => (
              <div
                key={emocion.id}
                className="flex h-16 w-16 items-center justify-center rounded-[22px] text-4xl"
                style={{ backgroundColor: emocion.color }}
              >
                {emocion.icono}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={comenzar}
            className="mt-10 rounded-full bg-[#B8A0E6] px-10 py-4 font-['Fredoka'] text-xl text-white shadow-md transition-transform hover:scale-105"
          >
            ¡COMENZAR!
          </button>
        </div>
      ) : !terminado && pregunta ? (
        <div className="text-center">

          {/* PROGRESO */}
          <p className="font-['Nunito'] text-[#635B70]">
            Historia {paso + 1} de {partida.length}
          </p>

          <div
            role="progressbar"
            aria-label="Progreso de las historias"
            aria-valuemin={0}
            aria-valuemax={partida.length}
            aria-valuenow={paso + (seleccion ? 1 : 0)}
            className="mx-auto mt-4 h-4 max-w-md overflow-hidden rounded-full bg-[#F1E8FF]"
          >
            <div
              className="h-full rounded-full bg-[#B8A0E6] transition-all duration-300"
              style={{
                width: `${
                  ((paso + (seleccion ? 1 : 0)) /
                    partida.length) *
                  100
                }%`,
              }}
            />
          </div>

          {/* HISTORIA */}
          <section className="mx-auto mt-9 max-w-2xl rounded-[32px] bg-[#FCE8EF] px-6 py-9">

            <span className="font-['Fredoka'] text-lg text-[#C87899]">
              ¡Una pequeña historia!
            </span>

            <h2 className="mt-5 font-['Fredoka'] text-2xl leading-relaxed text-[#66549B] sm:text-3xl">
              {pregunta.es}
            </h2>

            <p
              lang="en"
              className="mt-4 font-['Nunito'] text-lg leading-relaxed text-[#C87899]"
            >
              {pregunta.en}
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() => escuchar(pregunta.es, "es")}
                className="rounded-full bg-white px-6 py-3 font-['Fredoka'] text-[#66549B] shadow-sm"
              >
                🔊 Español
              </button>

              <button
                type="button"
                onClick={() => escuchar(pregunta.en, "en")}
                className="rounded-full bg-[#B8A0E6] px-6 py-3 font-['Fredoka'] text-white shadow-sm"
              >
                🔊 English
              </button>
            </div>
          </section>

          {/* PREGUNTA */}
          <h3 className="mt-9 font-['Fredoka'] text-2xl text-[#66549B]">
            ¿Cómo te sentirías tú?
          </h3>

          <p
            lang="en"
            className="mt-2 font-['Nunito'] text-lg text-[#C87899]"
          >
            How would you feel?
          </p>

          {/* EMOCIONES */}
          <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {pregunta.opciones.map((emocion) => {
              const activa = seleccion?.id === emocion.id;

              return (
                <button
                  key={emocion.id}
                  type="button"
                  onClick={() => responder(emocion)}
                  disabled={seleccion !== null}
                  aria-pressed={activa}
                  className={`rounded-[28px] border-4 p-5 transition-transform hover:scale-105 focus-visible:outline-4 focus-visible:outline-[#66549B] ${
                    activa
                      ? "border-[#B8A0E6] shadow-lg"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: emocion.color }}
                >
                  <div className="text-5xl" aria-hidden="true">
                    {emocion.icono}
                  </div>

                  <p className="mt-4 font-['Fredoka'] text-xl text-[#66549B]">
                    {emocion.nombre}
                  </p>

                  <p
                    lang="en"
                    className="mt-1 font-['Nunito'] text-sm text-[#C87899]"
                  >
                    {emocion.ingles}
                  </p>
                </button>
              );
            })}
          </div>

          {/* RESPUESTA */}
          {seleccion && (
            <section
              aria-live="polite"
              className="mt-9 rounded-[30px] bg-[#E8F2E5] p-7"
            >
              <div className="text-5xl">
                {seleccion.icono}
              </div>

              <h3 className="mt-4 font-['Fredoka'] text-2xl text-[#66549B]">
                ¡Elegiste {seleccion.nombre.toLowerCase()}!
              </h3>

              <p
                lang="en"
                className="mt-2 font-['Fredoka'] text-lg text-[#C87899]"
              >
                {seleccion.ingles}
              </p>

              <p className="mx-auto mt-5 max-w-lg font-['Nunito'] text-lg leading-relaxed text-[#635B70]">
                {esSugerida
                  ? "¡Es una emoción que muchas personas podrían sentir en esta situación!"
                  : "¡También podrías sentirte así! Cada persona puede reaccionar de manera diferente."}
              </p>

              <p className="mx-auto mt-3 max-w-lg font-['Nunito'] text-[#635B70]">
                Lo importante es reconocer lo que sentimos
                y poder hablar de ello.
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    escuchar(seleccion.nombre, "es")
                  }
                  className="rounded-full bg-white px-6 py-3 font-['Fredoka'] text-[#66549B]"
                >
                  🔊 Español
                </button>

                <button
                  type="button"
                  onClick={() =>
                    escuchar(seleccion.ingles, "en")
                  }
                  className="rounded-full bg-white px-6 py-3 font-['Fredoka'] text-[#66549B]"
                >
                  🔊 English
                </button>
              </div>

              <button
                type="button"
                onClick={siguiente}
                className="mt-7 rounded-full bg-[#B8A0E6] px-9 py-4 font-['Fredoka'] text-lg text-white shadow-sm"
              >
                {paso === partida.length - 1
                  ? "¡TERMINAR!"
                  : "¡SIGUIENTE HISTORIA!"}
              </button>
            </section>
          )}
        </div>
      ) : (
        /* FINAL */
        <div className="py-10 text-center">

          <h2 className="font-['Fredoka'] text-4xl text-[#66549B]">
            ¡Qué gran explorador de emociones!
          </h2>

          <p
            lang="en"
            className="mt-3 font-['Fredoka'] text-xl text-[#C87899]"
          >
            Wonderful job!
          </p>

          <p className="mx-auto mt-6 max-w-xl font-['Nunito'] text-lg leading-relaxed text-[#635B70]">
            ¡Exploraste ocho historias y descubriste
            distintas formas de sentir!
          </p>

          <div className="mx-auto mt-8 flex max-w-lg flex-wrap justify-center gap-3">
            {respuestas.map((id, index) => {
              const emocion = emociones.find((e) => e.id === id);

              return (
                <div
                  key={index}
                  className="flex h-16 w-16 items-center justify-center rounded-[22px] text-4xl"
                  style={{
                    backgroundColor: emocion?.color ?? "#F1E8FF",
                  }}
                  title={emocion?.nombre}
                >
                  {emocion?.icono}
                </div>
              );
            })}
          </div>

          <p className="mt-7 font-['Nunito'] text-lg text-[#635B70]">
            ¡Todas tus emociones merecen ser escuchadas!
          </p>

          <button
            type="button"
            onClick={comenzar}
            className="mt-9 rounded-full bg-[#B8A0E6] px-10 py-4 font-['Fredoka'] text-xl text-white shadow-md transition-transform hover:scale-105"
          >
            ¡JUGAR OTRA VEZ!
          </button>
        </div>
      )}
    </GameLayout>
  );
}
