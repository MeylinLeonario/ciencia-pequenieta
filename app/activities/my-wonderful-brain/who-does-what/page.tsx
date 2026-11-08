
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import GameLayout from "@/components/game-layout";

const BASE = "/activities/my-wonderful-brain/meet-your-brain";

const partes = [
  {
    id: "cerebro",
    nombre: "Cerebro",
    ingles: "Cerebrum",
    imagen: `${BASE}/01_cerebro.png`,
    pregunta: "¡Estoy pensando cómo resolver un problema!",
    preguntaEn: "I'm thinking about how to solve a problem!",
    explicacion: "El cerebro trabaja en conjunto para ayudarnos a pensar, aprender y recordar.",
    explicacionEn: "The cerebrum helps us think, learn, and remember.",
  },
  {
    id: "cerebelo",
    nombre: "Cerebelo",
    ingles: "Cerebellum",
    imagen: `${BASE}/02_cerebelo.png`,
    pregunta: "¡Estoy intentando mantener el equilibrio en un pie!",
    preguntaEn: "I'm trying to balance on one foot!",
    explicacion: "El cerebelo ayuda a coordinar nuestros movimientos y mantener el equilibrio.",
    explicacionEn: "The cerebellum helps coordinate our movements and balance.",
  },
  {
    id: "tronco",
    nombre: "Tronco encefálico",
    ingles: "Brainstem",
    imagen: `${BASE}/03_tronco_encefalico.png`,
    pregunta: "¡Estoy respirando mientras duermo!",
    preguntaEn: "I'm breathing while I sleep!",
    explicacion: "El tronco encefálico ayuda a controlar funciones automáticas como la respiración.",
    explicacionEn: "The brainstem helps control automatic functions like breathing.",
  },
  {
    id: "frontal",
    nombre: "Lóbulo frontal",
    ingles: "Frontal Lobe",
    imagen: `${BASE}/04_lobulo_frontal.png`,
    pregunta: "¡Estoy planeando cómo construir una torre de bloques!",
    preguntaEn: "I'm planning how to build a tower of blocks!",
    explicacion: "El lóbulo frontal participa en la planificación, las decisiones y el control de movimientos.",
    explicacionEn: "The frontal lobe helps us plan, make decisions, and control movements.",
  },
  {
    id: "parietal",
    nombre: "Lóbulo parietal",
    ingles: "Parietal Lobe",
    imagen: `${BASE}/05_lobulo_parietal.png`,
    pregunta: "¡Estoy sintiendo una manta suave con mis manos!",
    preguntaEn: "I'm feeling a soft blanket with my hands!",
    explicacion: "El lóbulo parietal ayuda a procesar sensaciones como el tacto.",
    explicacionEn: "The parietal lobe helps process sensations like touch.",
  },
  {
    id: "temporal",
    nombre: "Lóbulo temporal",
    ingles: "Temporal Lobe",
    imagen: `${BASE}/06_lobulo_temporal.png`,
    pregunta: "¡Estoy escuchando mi canción favorita!",
    preguntaEn: "I'm listening to my favorite song!",
    explicacion: "El lóbulo temporal participa en el procesamiento de los sonidos.",
    explicacionEn: "The temporal lobe helps process sounds.",
  },
  {
    id: "occipital",
    nombre: "Lóbulo occipital",
    ingles: "Occipital Lobe",
    imagen: `${BASE}/07_lobulo_occipital.png`,
    pregunta: "¡Estoy mirando un arcoíris lleno de colores!",
    preguntaEn: "I'm looking at a colorful rainbow!",
    explicacion: "El lóbulo occipital ayuda a procesar la información que recibimos con los ojos.",
    explicacionEn: "The occipital lobe helps process visual information.",
  },
  {
    id: "hipocampo",
    nombre: "Hipocampo",
    ingles: "Hippocampus",
    imagen: `${BASE}/08_hipocampo.png`,
    pregunta: "¡Estoy aprendiendo el camino para llegar a mi escuela!",
    preguntaEn: "I'm learning the way to my school!",
    explicacion: "El hipocampo participa en la formación de recuerdos y en aprender lugares y caminos.",
    explicacionEn: "The hippocampus helps form memories and learn places and routes.",
  },
];

type Parte = (typeof partes)[number];

type Desafio = {
  correcta: Parte;
  opciones: Parte[];
};

function mezclar<T,>(elementos: T[]): T[] {
  const copia = [...elementos];

  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [copia[i], copia[j]] = [copia[j], copia[i]];
  }

  return copia;
}

function crearPartida(): Desafio[] {
  return mezclar(partes).map((correcta) => {
    const incorrectas = mezclar(
      partes.filter((parte) => parte.id !== correcta.id)
    ).slice(0, 2);

    return {
      correcta,
      opciones: mezclar([correcta, ...incorrectas]),
    };
  });
}

export default function WhoDoesWhat() {
  const [partida, setPartida] = useState<Desafio[] | null>(null);
  const [paso, setPaso] = useState(0);
  const [seleccion, setSeleccion] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState("");
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

    const mensajeVoz = new SpeechSynthesisUtterance(texto);

    mensajeVoz.lang = idioma === "es" ? "es-CL" : "en-US";
    mensajeVoz.rate = 0.82;

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
      mensajeVoz.voice = voz;
      mensajeVoz.lang = voz.lang;
    }

    window.speechSynthesis.speak(mensajeVoz);
  }

  function comenzar() {
    window.speechSynthesis?.cancel();

    setPartida(crearPartida());
    setPaso(0);
    setSeleccion(null);
    setMensaje("");
  }

  function responder(id: string) {
    if (!partida || seleccion !== null) return;

    const correcta = partida[paso].correcta;

    if (id === correcta.id) {
      setSeleccion(id);
      setMensaje("¡Excelente! ¡Encontraste la parte correcta!");
    } else {
      setMensaje("¡Casi! Observa las imágenes e inténtalo otra vez.");
    }
  }

  function siguiente() {
    window.speechSynthesis?.cancel();

    setPaso((actual) => actual + 1);
    setSeleccion(null);
    setMensaje("");
  }

  const terminado = partida !== null && paso >= partida.length;
  const desafio = partida?.[paso];
  const completados = paso + (seleccion !== null ? 1 : 0);

  return (
    <GameLayout
      titulo="¿Quién hace qué?"
      tituloIngles="Who Does What?"
      descripcion="¡Descubre qué partes del cerebro nos ayudan cada día!"
    >
      {!partida ? (
        /* INICIO */
        <div className="py-10 text-center">
          <h2 className="font-['Fredoka'] text-3xl text-[#66549B]">
            ¡Tu cerebro tiene muchos talentos!
          </h2>

          <p className="mx-auto mt-5 max-w-xl font-['Nunito'] text-lg leading-relaxed text-[#635B70]">
            Cada parte de nuestro cerebro tiene funciones
            especiales. Lee o escucha las historias y
            descubre qué parte nos ayuda en cada situación.
          </p>

          <div className="mx-auto mt-8 grid max-w-lg grid-cols-4 gap-3">
            {partes.map((parte) => (
              <div
                key={parte.id}
                className="rounded-[20px] bg-[#F1E8FF] p-3"
              >
                <div className="relative aspect-square w-full">
                  <Image
                    src={parte.imagen}
                    alt={parte.nombre}
                    fill
                    sizes="120px"
                    className="object-contain"
                  />
                </div>
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
      ) : !terminado && desafio ? (
        <div className="text-center">

          {/* PROGRESO */}
          <p className="font-['Nunito'] text-[#635B70]">
            Desafío {paso + 1} de {partida.length}
          </p>

          <div
            role="progressbar"
            aria-label="Progreso del juego"
            aria-valuemin={0}
            aria-valuemax={partida.length}
            aria-valuenow={completados}
            className="mx-auto mt-4 h-4 max-w-md overflow-hidden rounded-full bg-[#F1E8FF]"
          >
            <div
              className="h-full rounded-full bg-[#B8A0E6] transition-all duration-300"
              style={{
                width: `${(completados / partida.length) * 100}%`,
              }}
            />
          </div>

          {/* SITUACIÓN */}
          <section className="mx-auto mt-9 max-w-2xl rounded-[32px] bg-[#FCE8EF] px-6 py-9">
            <span className="font-['Fredoka'] text-lg text-[#C87899]">
              ¡Descubre la función!
            </span>

            <h2 className="mt-5 font-['Fredoka'] text-2xl leading-relaxed text-[#66549B] sm:text-3xl">
              {desafio.correcta.pregunta}
            </h2>

            <p
              lang="en"
              className="mt-4 font-['Nunito'] text-lg leading-relaxed text-[#C87899]"
            >
              {desafio.correcta.preguntaEn}
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() =>
                  escuchar(desafio.correcta.pregunta, "es")
                }
                className="rounded-full bg-white px-6 py-3 font-['Fredoka'] text-[#66549B] shadow-sm"
              >
                🔊 Español
              </button>

              <button
                type="button"
                onClick={() =>
                  escuchar(desafio.correcta.preguntaEn, "en")
                }
                className="rounded-full bg-[#B8A0E6] px-6 py-3 font-['Fredoka'] text-white shadow-sm"
              >
                🔊 English
              </button>
            </div>
          </section>

          {/* PREGUNTA */}
          <h3 className="mt-9 font-['Fredoka'] text-2xl text-[#66549B]">
            ¿Qué parte de mi cerebro me ayuda?
          </h3>

          <p
            lang="en"
            className="mt-2 font-['Nunito'] text-lg text-[#C87899]"
          >
            Which part of my brain helps me?
          </p>

          {/* OPCIONES */}
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            {desafio.opciones.map((parte) => {
              const activa = seleccion === parte.id;

              return (
                <button
                  key={parte.id}
                  type="button"
                  onClick={() => responder(parte.id)}
                  disabled={seleccion !== null}
                  className={`rounded-[28px] border-4 p-5 transition-transform hover:scale-105 focus-visible:outline-4 focus-visible:outline-[#66549B] ${
                    activa
                      ? "border-[#B8A0E6] bg-[#E8F2E5]"
                      : "border-transparent bg-[#F1E8FF]"
                  }`}
                >
                  <div className="relative mx-auto h-36 w-full sm:h-44">
                    <Image
                      src={parte.imagen}
                      alt={parte.nombre}
                      fill
                      sizes="(max-width: 640px) 100vw, 250px"
                      className="object-contain"
                    />
                  </div>

                  <h4 className="mt-4 font-['Fredoka'] text-xl text-[#66549B]">
                    {parte.nombre}
                  </h4>

                  <p
                    lang="en"
                    className="mt-1 font-['Nunito'] text-sm text-[#C87899]"
                  >
                    {parte.ingles}
                  </p>
                </button>
              );
            })}
          </div>

          {/* MENSAJE */}
          <p
            aria-live="polite"
            className="mt-8 min-h-7 font-['Fredoka'] text-xl text-[#66549B]"
          >
            {mensaje}
          </p>

          {/* EXPLICACIÓN */}
          {seleccion !== null && (
            <section className="mt-7 rounded-[30px] bg-[#E8F2E5] p-7">
              <h3 className="font-['Fredoka'] text-2xl text-[#66549B]">
                ¡Es el {desafio.correcta.nombre}!
              </h3>

              <p className="mx-auto mt-4 max-w-lg font-['Nunito'] text-lg leading-relaxed text-[#635B70]">
                {desafio.correcta.explicacion}
              </p>

              <p
                lang="en"
                className="mx-auto mt-3 max-w-lg font-['Nunito'] text-base leading-relaxed text-[#C87899]"
              >
                {desafio.correcta.explicacionEn}
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    escuchar(desafio.correcta.explicacion, "es")
                  }
                  className="rounded-full bg-white px-6 py-3 font-['Fredoka'] text-[#66549B]"
                >
                  🔊 Español
                </button>

                <button
                  type="button"
                  onClick={() =>
                    escuchar(desafio.correcta.explicacionEn, "en")
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
                  : "¡SIGUIENTE!"}
              </button>
            </section>
          )}
        </div>
      ) : (
        /* FINAL */
        <div className="py-10 text-center">
          <h2 className="font-['Fredoka'] text-4xl text-[#66549B]">
            ¡Eres un gran explorador!
          </h2>

          <p
            lang="en"
            className="mt-3 font-['Fredoka'] text-xl text-[#C87899]"
          >
            You're a great explorer!
          </p>

          <p className="mx-auto mt-6 max-w-lg font-['Nunito'] text-lg text-[#635B70]">
            ¡Descubriste ocho partes de tu cerebro
            y aprendiste cómo nos ayudan cada día!
          </p>

          <div className="mx-auto mt-8 grid max-w-lg grid-cols-4 gap-3">
            {partes.map((parte) => (
              <div
                key={parte.id}
                className="rounded-[20px] bg-[#E8F2E5] p-3"
              >
                <div className="relative aspect-square w-full">
                  <Image
                    src={parte.imagen}
                    alt={parte.nombre}
                    fill
                    sizes="120px"
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={comenzar}
            className="mt-10 rounded-full bg-[#B8A0E6] px-10 py-4 font-['Fredoka'] text-xl text-white shadow-md transition-transform hover:scale-105"
          >
            ¡JUGAR OTRA VEZ!
          </button>
        </div>
      )}
    </GameLayout>
  );
}
