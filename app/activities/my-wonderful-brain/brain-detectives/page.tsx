
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import GameLayout from "@/components/game-layout";

const BASE = "/activities/my-wonderful-brain/meet-your-brain";

const regiones = [
  {
    id: "cerebro",
    nombre: "Cerebro",
    ingles: "Cerebrum",
    imagen: `${BASE}/01_cerebro.png`,
  },
  {
    id: "cerebelo",
    nombre: "Cerebelo",
    ingles: "Cerebellum",
    imagen: `${BASE}/02_cerebelo.png`,
  },
  {
    id: "tronco",
    nombre: "Tronco encefálico",
    ingles: "Brainstem",
    imagen: `${BASE}/03_tronco_encefalico.png`,
  },
  {
    id: "frontal",
    nombre: "Lóbulo frontal",
    ingles: "Frontal Lobe",
    imagen: `${BASE}/04_lobulo_frontal.png`,
  },
  {
    id: "parietal",
    nombre: "Lóbulo parietal",
    ingles: "Parietal Lobe",
    imagen: `${BASE}/05_lobulo_parietal.png`,
  },
  {
    id: "temporal",
    nombre: "Lóbulo temporal",
    ingles: "Temporal Lobe",
    imagen: `${BASE}/06_lobulo_temporal.png`,
  },
  {
    id: "occipital",
    nombre: "Lóbulo occipital",
    ingles: "Occipital Lobe",
    imagen: `${BASE}/07_lobulo_occipital.png`,
  },
  {
    id: "hipocampo",
    nombre: "Hipocampo",
    ingles: "Hippocampus",
    imagen: `${BASE}/08_hipocampo.png`,
  },
] as const;

type RegionId = (typeof regiones)[number]["id"];

type Caso = {
  id: number;
  titulo: string;
  tituloEn: string;
  pistas: string[];
  pistasEn: string[];
  respuesta: RegionId;
  explicacion: string;
  explicacionEn: string;
};

const casos: Caso[] = [
  {
    id: 1,
    titulo: "El misterio de la música",
    tituloEn: "The Music Mystery",
    pistas: [
      "Escucho una melodía que conozco.",
      "Una región de mi cerebro ayuda a procesar los sonidos.",
      "Está ubicada cerca de los lados de mi cabeza.",
    ],
    pistasEn: [
      "I hear a melody I know.",
      "A region of my brain helps process sounds.",
      "It is located near the sides of my head.",
    ],
    respuesta: "temporal",
    explicacion:
      "El lóbulo temporal participa en el procesamiento de sonidos y del lenguaje.",
    explicacionEn:
      "The temporal lobe helps process sounds and language.",
  },
  {
    id: 2,
    titulo: "Los colores desaparecidos",
    tituloEn: "The Missing Colors",
    pistas: [
      "Veo un arcoíris lleno de colores.",
      "Mi cerebro necesita interpretar lo que reciben mis ojos.",
      "Esta región se encuentra en la parte posterior del cerebro.",
    ],
    pistasEn: [
      "I see a rainbow full of colors.",
      "My brain needs to interpret what my eyes receive.",
      "This region is at the back of the brain.",
    ],
    respuesta: "occipital",
    explicacion:
      "El lóbulo occipital participa en el procesamiento de la información visual.",
    explicacionEn:
      "The occipital lobe helps process visual information.",
  },
  {
    id: 3,
    titulo: "El equilibrista misterioso",
    tituloEn: "The Mysterious Balancer",
    pistas: [
      "Intento caminar sobre una línea sin caerme.",
      "Necesito coordinar mis movimientos y mantener el equilibrio.",
      "Esta estructura está en la parte posterior e inferior del encéfalo.",
    ],
    pistasEn: [
      "I try to walk along a line without falling.",
      "I need to coordinate my movements and keep my balance.",
      "This structure is at the lower back of the brain.",
    ],
    respuesta: "cerebelo",
    explicacion:
      "El cerebelo ayuda a coordinar los movimientos y mantener el equilibrio.",
    explicacionEn:
      "The cerebellum helps coordinate movements and maintain balance.",
  },
  {
    id: 4,
    titulo: "La respiración secreta",
    tituloEn: "The Secret Breathing",
    pistas: [
      "Estoy durmiendo profundamente.",
      "Sigo respirando aunque no lo esté pensando.",
      "Esta estructura conecta el cerebro con la médula espinal.",
    ],
    pistasEn: [
      "I am sleeping deeply.",
      "I keep breathing even when I am not thinking about it.",
      "This structure connects the brain to the spinal cord.",
    ],
    respuesta: "tronco",
    explicacion:
      "El tronco encefálico participa en el control automático de funciones vitales, como la respiración.",
    explicacionEn:
      "The brainstem helps automatically control vital functions such as breathing.",
  },
  {
    id: 5,
    titulo: "La torre imposible",
    tituloEn: "The Impossible Tower",
    pistas: [
      "Quiero construir una torre muy alta.",
      "Necesito planear qué bloque colocar primero.",
      "Esta región participa en la planificación y las decisiones.",
    ],
    pistasEn: [
      "I want to build a very tall tower.",
      "I need to plan which block to place first.",
      "This region helps with planning and decision-making.",
    ],
    respuesta: "frontal",
    explicacion:
      "El lóbulo frontal participa en la planificación, la toma de decisiones y el control de acciones.",
    explicacionEn:
      "The frontal lobe helps with planning, decision-making, and controlling actions.",
  },
  {
    id: 6,
    titulo: "La manta misteriosa",
    tituloEn: "The Mysterious Blanket",
    pistas: [
      "Toco una manta muy suave.",
      "Mi cerebro interpreta la sensación que llega desde mi piel.",
      "Esta región participa en el procesamiento del tacto.",
    ],
    pistasEn: [
      "I touch a very soft blanket.",
      "My brain interprets sensations coming from my skin.",
      "This region helps process touch.",
    ],
    respuesta: "parietal",
    explicacion:
      "El lóbulo parietal ayuda a procesar sensaciones corporales como el tacto.",
    explicacionEn:
      "The parietal lobe helps process body sensations such as touch.",
  },
  {
    id: 7,
    titulo: "El camino a casa",
    tituloEn: "The Way Home",
    pistas: [
      "Aprendí un camino nuevo para llegar a casa.",
      "Necesito recordar lugares y direcciones.",
      "Esta estructura es importante para formar recuerdos y orientarnos.",
    ],
    pistasEn: [
      "I learned a new way to get home.",
      "I need to remember places and directions.",
      "This structure is important for forming memories and finding our way.",
    ],
    respuesta: "hipocampo",
    explicacion:
      "El hipocampo participa en la formación de recuerdos y en la memoria espacial.",
    explicacionEn:
      "The hippocampus helps form memories and supports spatial memory.",
  },
  {
    id: 8,
    titulo: "El gran aprendizaje",
    tituloEn: "The Great Discovery",
    pistas: [
      "Estoy aprendiendo algo completamente nuevo.",
      "Muchas regiones trabajan juntas para ayudarme a comprender.",
      "Es la parte más grande del encéfalo.",
    ],
    pistasEn: [
      "I am learning something completely new.",
      "Many regions work together to help me understand.",
      "It is the largest part of the brain.",
    ],
    respuesta: "cerebro",
    explicacion:
      "El cerebro contiene regiones que trabajan juntas para ayudarnos a pensar, aprender y recordar.",
    explicacionEn:
      "The cerebrum contains regions that work together to help us think, learn, and remember.",
  },
  {
    id: 9,
    titulo: "El secreto del dibujo",
    tituloEn: "The Drawing Secret",
    pistas: [
      "Estoy dibujando una casa y debo decidir por dónde empezar.",
      "Organizo mis pasos antes de dibujar.",
      "Esta región ayuda a planear acciones.",
    ],
    pistasEn: [
      "I am drawing a house and deciding where to start.",
      "I organize my steps before drawing.",
      "This region helps plan actions.",
    ],
    respuesta: "frontal",
    explicacion:
      "El lóbulo frontal participa en la organización y planificación de nuestras acciones.",
    explicacionEn:
      "The frontal lobe helps organize and plan our actions.",
  },
  {
    id: 10,
    titulo: "El sonido escondido",
    tituloEn: "The Hidden Sound",
    pistas: [
      "Escucho a alguien llamarme desde otra habitación.",
      "Mi cerebro procesa la voz que escucho.",
      "Esta región participa en la audición.",
    ],
    pistasEn: [
      "I hear someone calling me from another room.",
      "My brain processes the voice I hear.",
      "This region helps with hearing.",
    ],
    respuesta: "temporal",
    explicacion:
      "El lóbulo temporal contiene regiones importantes para procesar los sonidos.",
    explicacionEn:
      "The temporal lobe contains regions important for processing sounds.",
  },
  {
    id: 11,
    titulo: "El misterio de los ojos",
    tituloEn: "The Mystery of the Eyes",
    pistas: [
      "Estoy observando las formas de las nubes.",
      "Mi cerebro procesa información visual.",
      "Esta región se encuentra detrás de mi cabeza.",
    ],
    pistasEn: [
      "I am looking at the shapes of clouds.",
      "My brain processes visual information.",
      "This region is at the back of my head.",
    ],
    respuesta: "occipital",
    explicacion:
      "El lóbulo occipital es una región importante para el procesamiento de imágenes.",
    explicacionEn:
      "The occipital lobe is important for processing visual images.",
  },
  {
    id: 12,
    titulo: "La bicicleta misteriosa",
    tituloEn: "The Mysterious Bicycle",
    pistas: [
      "Estoy aprendiendo a andar en bicicleta.",
      "Necesito coordinar mis movimientos y mantener el equilibrio.",
      "Esta estructura ayuda a que mis movimientos sean coordinados.",
    ],
    pistasEn: [
      "I am learning to ride a bicycle.",
      "I need to coordinate my movements and keep my balance.",
      "This structure helps coordinate my movements.",
    ],
    respuesta: "cerebelo",
    explicacion:
      "El cerebelo participa en el aprendizaje y la coordinación de movimientos.",
    explicacionEn:
      "The cerebellum helps with learning and coordinating movements.",
  },
];

type Desafio = {
  caso: Caso;
  opciones: (typeof regiones)[number][];
};

type Resultado = {
  caso: Caso;
  estrellas: number;
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
  return mezclar(casos)
    .slice(0, 8)
    .map((caso) => {
      const correcta = regiones.find(
        (region) => region.id === caso.respuesta
      )!;

      const incorrectas = mezclar(
        regiones.filter(
          (region) => region.id !== caso.respuesta
        )
      ).slice(0, 2);

      return {
        caso,
        opciones: mezclar([correcta, ...incorrectas]),
      };
    });
}

export default function BrainDetectives() {
  const [partida, setPartida] = useState<Desafio[] | null>(null);
  const [paso, setPaso] = useState(0);
  const [pistasVisibles, setPistasVisibles] = useState(1);
  const [seleccion, setSeleccion] = useState<RegionId | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState(0);
  const [resultados, setResultados] = useState<Resultado[]>([]);
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
    setPistasVisibles(1);
    setSeleccion(null);
    setMensaje("");
    setErrores(0);
    setResultados([]);
  }

  function descubrirPista() {
    if (pistasVisibles >= 3 || seleccion !== null) return;

    setPistasVisibles((actual) => actual + 1);
    setMensaje("");
  }

  function responder(id: RegionId) {
    if (!partida || seleccion !== null) return;

    const caso = partida[paso].caso;

    if (id === caso.respuesta) {
      setSeleccion(id);
      setMensaje("¡Caso resuelto! ¡Excelente investigación!");

      const estrellas = Math.max(
        1,
        4 - pistasVisibles - errores
      );

      setResultados((actual) => [
        ...actual,
        { caso, estrellas },
      ]);
    } else {
      setErrores((actual) => actual + 1);
      setMensaje(
        "¡Buena hipótesis! Revisa las pistas e intenta otra vez."
      );
    }
  }

  function siguiente() {
    window.speechSynthesis?.cancel();

    setPaso((actual) => actual + 1);
    setPistasVisibles(1);
    setSeleccion(null);
    setMensaje("");
    setErrores(0);
  }

  const terminado = partida !== null && paso >= partida.length;
  const desafio = partida?.[paso];
  const regionCorrecta = desafio
    ? regiones.find(
        (region) => region.id === desafio.caso.respuesta
      )
    : null;

  const totalEstrellas = resultados.reduce(
    (total, resultado) => total + resultado.estrellas,
    0
  );

  return (
    <GameLayout
      titulo="Detectives del cerebro"
      tituloIngles="Brain Detectives"
      descripcion="¡Investiga pistas, formula hipótesis y resuelve misterios cerebrales!"
    >
      {!partida ? (
        /* PANTALLA INICIAL */
        <div className="py-10 text-center">
          <h2 className="font-['Fredoka'] text-3xl text-[#66549B]">
            ¡Bienvenido al laboratorio de detectives!
          </h2>

          <p className="mx-auto mt-5 max-w-xl font-['Nunito'] text-lg leading-relaxed text-[#635B70]">
            Tenemos ocho misterios por resolver.
            Investiga las pistas y descubre qué parte
            del cerebro participa en cada situación.
          </p>

          <div className="mx-auto mt-8 flex max-w-lg flex-wrap justify-center gap-3">
            {regiones.map((region) => (
              <div
                key={region.id}
                className="relative h-24 w-24 rounded-[22px] bg-[#E8F2E5] p-3"
              >
                <Image
                  src={region.imagen}
                  alt={region.nombre}
                  fill
                  sizes="96px"
                  className="object-contain p-3"
                />
              </div>
            ))}
          </div>

          <p className="mt-7 font-['Nunito'] text-[#635B70]">
            ¡Cuantas menos pistas necesites, más estrellas conseguirás!
          </p>

          <button
            type="button"
            onClick={comenzar}
            className="mt-8 rounded-full bg-[#B8A0E6] px-10 py-4 font-['Fredoka'] text-xl text-white shadow-md transition-transform hover:scale-105"
          >
            ¡COMENZAR INVESTIGACIÓN!
          </button>
        </div>
      ) : !terminado && desafio ? (
        <div className="text-center">

          {/* PROGRESO */}
          <p className="font-['Nunito'] text-[#635B70]">
            Caso {paso + 1} de {partida.length}
          </p>

          <div
            role="progressbar"
            aria-label="Progreso de la investigación"
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

          {/* EXPEDIENTE */}
          <section className="mx-auto mt-9 max-w-2xl rounded-[32px] bg-[#E8F2E5] px-6 py-9">

            <span className="font-['Fredoka'] text-lg text-[#64805E]">
              Expediente científico #{paso + 1}
            </span>

            <h2 className="mt-4 font-['Fredoka'] text-3xl text-[#66549B]">
              {desafio.caso.titulo}
            </h2>

            <p
              lang="en"
              className="mt-2 font-['Fredoka'] text-xl text-[#C87899]"
            >
              {desafio.caso.tituloEn}
            </p>

            {/* PISTAS */}
            <div className="mt-8 space-y-4 text-left">
              {desafio.caso.pistas
                .slice(0, pistasVisibles)
                .map((pista, index) => (
                  <div
                    key={index}
                    className="rounded-[24px] bg-white/90 p-5 shadow-sm"
                  >
                    <p className="font-['Fredoka'] text-lg text-[#66549B]">
                      Pista {index + 1}
                    </p>

                    <p className="mt-2 font-['Nunito'] text-lg text-[#635B70]">
                      {pista}
                    </p>

                    <p
                      lang="en"
                      className="mt-2 font-['Nunito'] text-base text-[#C87899]"
                    >
                      {desafio.caso.pistasEn[index]}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => escuchar(pista, "es")}
                        className="rounded-full bg-[#FCE8EF] px-4 py-2 font-['Fredoka'] text-sm text-[#66549B]"
                      >
                        🔊 Español
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          escuchar(
                            desafio.caso.pistasEn[index],
                            "en"
                          )
                        }
                        className="rounded-full bg-[#F1E8FF] px-4 py-2 font-['Fredoka'] text-sm text-[#66549B]"
                      >
                        🔊 English
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {pistasVisibles < 3 && seleccion === null && (
              <button
                type="button"
                onClick={descubrirPista}
                className="mt-7 rounded-full bg-white px-7 py-3 font-['Fredoka'] text-[#66549B] shadow-sm"
              >
                ¡DESCUBRIR OTRA PISTA!
              </button>
            )}
          </section>

          {/* HIPÓTESIS */}
          <h3 className="mt-9 font-['Fredoka'] text-2xl text-[#66549B]">
            ¿Cuál es tu hipótesis?
          </h3>

          <p
            lang="en"
            className="mt-2 font-['Nunito'] text-lg text-[#C87899]"
          >
            What's your hypothesis?
          </p>

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            {desafio.opciones.map((region) => {
              const activa = seleccion === region.id;

              return (
                <button
                  key={region.id}
                  type="button"
                  onClick={() => responder(region.id)}
                  disabled={seleccion !== null}
                  className={`rounded-[28px] border-4 p-5 transition-transform hover:scale-105 focus-visible:outline-4 focus-visible:outline-[#66549B] ${
                    activa
                      ? "border-[#B8A0E6] bg-[#E8F2E5]"
                      : "border-transparent bg-[#F1E8FF]"
                  }`}
                >
                  <div className="relative mx-auto h-36 w-full">
                    <Image
                      src={region.imagen}
                      alt={region.nombre}
                      fill
                      sizes="(max-width: 640px) 100vw, 250px"
                      className="object-contain"
                    />
                  </div>

                  <h4 className="mt-4 font-['Fredoka'] text-xl text-[#66549B]">
                    {region.nombre}
                  </h4>

                  <p
                    lang="en"
                    className="mt-1 font-['Nunito'] text-sm text-[#C87899]"
                  >
                    {region.ingles}
                  </p>
                </button>
              );
            })}
          </div>

          <p
            aria-live="polite"
            className="mt-7 min-h-7 font-['Fredoka'] text-xl text-[#66549B]"
          >
            {mensaje}
          </p>

          {/* CASO RESUELTO */}
          {seleccion !== null && regionCorrecta && (
            <section className="mt-7 rounded-[30px] bg-[#F8F3FF] p-7">
              <h3 className="font-['Fredoka'] text-3xl text-[#66549B]">
                ¡Caso resuelto!
              </h3>

              <div className="mt-5 flex justify-center gap-2 text-3xl">
                {Array.from(
                  {
                    length:
                      resultados[resultados.length - 1]
                        ?.estrellas ?? 1,
                  },
                  (_, i) => (
                    <span key={i}>⭐</span>
                  )
                )}
              </div>

              <div className="relative mx-auto mt-6 h-48 w-48">
                <Image
                  src={regionCorrecta.imagen}
                  alt={regionCorrecta.nombre}
                  fill
                  sizes="192px"
                  className="object-contain"
                />
              </div>

              <h4 className="mt-5 font-['Fredoka'] text-2xl text-[#66549B]">
                {regionCorrecta.nombre}
              </h4>

              <p className="mx-auto mt-4 max-w-lg font-['Nunito'] text-lg leading-relaxed text-[#635B70]">
                {desafio.caso.explicacion}
              </p>

              <p
                lang="en"
                className="mx-auto mt-3 max-w-lg font-['Nunito'] text-base leading-relaxed text-[#C87899]"
              >
                {desafio.caso.explicacionEn}
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    escuchar(
                      desafio.caso.explicacion,
                      "es"
                    )
                  }
                  className="rounded-full bg-white px-6 py-3 font-['Fredoka'] text-[#66549B]"
                >
                  🔊 Español
                </button>

                <button
                  type="button"
                  onClick={() =>
                    escuchar(
                      desafio.caso.explicacionEn,
                      "en"
                    )
                  }
                  className="rounded-full bg-white px-6 py-3 font-['Fredoka'] text-[#66549B]"
                >
                  🔊 English
                </button>
              </div>

              <button
                type="button"
                onClick={siguiente}
                className="mt-8 rounded-full bg-[#B8A0E6] px-9 py-4 font-['Fredoka'] text-lg text-white shadow-sm"
              >
                {paso === partida.length - 1
                  ? "¡TERMINAR INVESTIGACIÓN!"
                  : "¡SIGUIENTE CASO!"}
              </button>
            </section>
          )}
        </div>
      ) : (
        /* PANTALLA FINAL */
        <div className="py-10 text-center">
          <h2 className="font-['Fredoka'] text-4xl text-[#66549B]">
            ¡Investigación completada!
          </h2>

          <p
            lang="en"
            className="mt-3 font-['Fredoka'] text-xl text-[#C87899]"
          >
            Investigation complete!
          </p>

          <p className="mx-auto mt-5 max-w-lg font-['Nunito'] text-lg text-[#635B70]">
            ¡Resolviste ocho misterios del cerebro!
          </p>

          <div className="mx-auto mt-8 max-w-sm rounded-[28px] bg-[#FFF0D9] p-6">
            <p className="font-['Fredoka'] text-xl text-[#66549B]">
              Tus estrellas científicas
            </p>

            <p className="mt-3 font-['Fredoka'] text-4xl text-[#66549B]">
              {totalEstrellas} / 24
            </p>
          </div>

          <h3 className="mt-10 font-['Fredoka'] text-2xl text-[#66549B]">
            Mi cuaderno de descubrimientos
          </h3>

          <div className="mt-6 grid gap-4 text-left sm:grid-cols-2">
            {resultados.map((resultado) => {
              const region = regiones.find(
                (r) => r.id === resultado.caso.respuesta
              );

              return (
                <div
                  key={resultado.caso.id}
                  className="flex items-center gap-4 rounded-[24px] bg-[#E8F2E5] p-4"
                >
                  {region && (
                    <div className="relative h-20 w-20 shrink-0">
                      <Image
                        src={region.imagen}
                        alt={region.nombre}
                        fill
                        sizes="80px"
                        className="object-contain"
                      />
                    </div>
                  )}

                  <div>
                    <p className="font-['Fredoka'] text-lg text-[#66549B]">
                      {resultado.caso.titulo}
                    </p>

                    <p className="font-['Nunito'] text-sm text-[#635B70]">
                      {region?.nombre}
                    </p>

                    <p className="mt-1 text-sm">
                      {"⭐".repeat(resultado.estrellas)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={comenzar}
            className="mt-10 rounded-full bg-[#B8A0E6] px-10 py-4 font-['Fredoka'] text-xl text-white shadow-md transition-transform hover:scale-105"
          >
            ¡INVESTIGAR OTRA VEZ!
          </button>
        </div>
      )}
    </GameLayout>
  );
}
