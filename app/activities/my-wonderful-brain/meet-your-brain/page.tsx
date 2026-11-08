"use client";

import { useEffect, useState } from "react";
import GameLayout from "@/components/game-layout";
import Image from "next/image";

const partes = [
  {
    nombre: "Cerebro",
    ingles: "Cerebrum",
    descripcion: "¡Me ayuda a pensar, aprender y recordar!",
    ejemplo: "Cuando aprendo una canción, ¡mi cerebro está trabajando!",
    pregunta: "¿Qué canción te gusta cantar?",
    color: "#FCE8EF",
    imagen: "/activities/my-wonderful-brain/meet-your-brain/01_cerebro.png",
  },
  {
    nombre: "Cerebelo",
    ingles: "Cerebellum",
    descripcion: "¡Me ayuda a mantener el equilibrio y moverme con coordinación!",
    ejemplo: "Cuando camino sobre una línea, mi cerebelo me ayuda.",
    pregunta: "¿Puedes mantenerte sobre un pie?",
    color: "#F1E8FF",
    imagen: "/activities/my-wonderful-brain/meet-your-brain/02_cerebelo.png",
  },
  {
    nombre: "Tronco encefálico",
    ingles: "Brainstem",
    descripcion: "¡Ayuda a mi cuerpo a respirar, incluso cuando duermo!",
    ejemplo: "Respiro sin tener que pensar en cada respiración.",
    pregunta: "¿Puedes sentir cómo entra y sale el aire?",
    color: "#E8F2E5",
    imagen: "/activities/my-wonderful-brain/meet-your-brain/03_tronco_encefalico.png",
  },
  {
    nombre: "Lóbulo frontal",
    ingles: "Frontal Lobe",
    descripcion: "¡Me ayuda a planear, elegir y controlar mis movimientos!",
    ejemplo: "Cuando decido qué dibujo hacer, esta región participa.",
    pregunta: "¿Qué te gustaría dibujar hoy?",
    color: "#FFF0D9",
    imagen: "/activities/my-wonderful-brain/meet-your-brain/04_lobulo_frontal.png",
  },
  {
    nombre: "Lóbulo parietal",
    ingles: "Parietal Lobe",
    descripcion: "¡Me ayuda a sentir el tacto y saber dónde está mi cuerpo!",
    ejemplo: "Cuando toco algo suave, esta región me ayuda a sentirlo.",
    pregunta: "¿Puedes encontrar algo suave cerca de ti?",
    color: "#E4F1FF",
    imagen: "/activities/my-wonderful-brain/meet-your-brain/05_lobulo_parietal.png",
  },
  {
    nombre: "Lóbulo temporal",
    ingles: "Temporal Lobe",
    descripcion: "¡Me ayuda a comprender sonidos y participa en la memoria!",
    ejemplo: "Cuando escucho una canción, esta región está trabajando.",
    pregunta: "¿Qué sonido escuchas ahora?",
    color: "#FCE8EF",
    imagen: "/activities/my-wonderful-brain/meet-your-brain/06_lobulo_temporal.png",
  },
  {
    nombre: "Lóbulo occipital",
    ingles: "Occipital Lobe",
    descripcion: "¡Me ayuda a comprender las imágenes que veo!",
    ejemplo: "Cuando miro un arcoíris, esta región procesa lo que veo.",
    pregunta: "¿Cuál es tu color favorito?",
    color: "#F1E8FF",
    imagen: "/activities/my-wonderful-brain/meet-your-brain/07_lobulo_occipital.png",
  },
  {
    nombre: "Hipocampo",
    ingles: "Hippocampus",
    descripcion: "¡Me ayuda a formar nuevos recuerdos!",
    ejemplo: "Cuando recuerdo una aventura, mi hipocampo ha participado.",
    pregunta: "¿Recuerdas algo divertido que hiciste ayer?",
    color: "#E8F2E5",
    imagen: "/activities/my-wonderful-brain/meet-your-brain/08_hipocampo.png",
  },
];

export default function ConoceTuCerebro() {
  const [seleccion, setSeleccion] = useState<number | null>(null);
  const [visitadas, setVisitadas] = useState<number[]>([]);
  const [voces, setVoces] = useState<SpeechSynthesisVoice[]>([]);
  const [vozIngles, setVozIngles] = useState("");
  const [mostrarVoces, setMostrarVoces] = useState(false);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;

    const cargarVoces = () => {
      const disponibles = window.speechSynthesis.getVoices();
      setVoces(disponibles);

      setVozIngles((actual) => {
        if (actual && disponibles.some((v) => v.voiceURI === actual)) {
          return actual;
        }

        const inglesas = disponibles.filter((v) =>
          v.lang.toLowerCase().startsWith("en")
        );

        const preferida =
          inglesas.find((v) =>
            /natural|neural|premium|samantha|google/i.test(v.name)
          ) ?? inglesas[0];

        return preferida?.voiceURI ?? "";
      });
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
    mensaje.rate = idioma === "en" ? 0.78 : 0.88;
    mensaje.pitch = 1;

    let voz: SpeechSynthesisVoice | undefined;

    if (idioma === "en") {
      voz = voces.find((v) => v.voiceURI === vozIngles);
    } else {
      voz =
        voces.find((v) => v.lang.toLowerCase() === "es-cl") ??
        voces.find((v) =>
          v.lang.toLowerCase().startsWith("es")
        );
    }

    if (voz) {
      mensaje.voice = voz;
      mensaje.lang = voz.lang;
    }

    window.speechSynthesis.speak(mensaje);
  }

  function seleccionar(index: number) {
    setSeleccion(index);
    setVisitadas((actual) =>
      actual.includes(index) ? actual : [...actual, index]
    );

    escuchar(partes[index].nombre, "es");
  }

  function reiniciar() {
    window.speechSynthesis?.cancel();
    setSeleccion(null);
    setVisitadas([]);
  }

  const parte = seleccion === null ? null : partes[seleccion];
  const completado = visitadas.length === partes.length;

  const vocesInglesas = voces.filter((v) =>
    v.lang.toLowerCase().startsWith("en")
  );

  return (
    <GameLayout
      titulo="Conoce tu cerebro"
      tituloIngles="Meet Your Brain"
      descripcion="¡Explora las partes de tu cerebro y descubre sus secretos!"
    >
      {/* PROGRESO */}
      <div className="mb-9 text-center">
        <p className="font-['Fredoka'] text-xl text-[#66549B]">
          ¡Vamos a descubrir!
        </p>

        <p className="mt-2 font-['Nunito'] text-[#635B70]">
          Has conocido {visitadas.length} de {partes.length} partes
        </p>

        <div
          role="progressbar"
          aria-valuenow={visitadas.length}
          aria-valuemin={0}
          aria-valuemax={partes.length}
          aria-label="Partes descubiertas"
          className="mx-auto mt-4 h-4 max-w-md overflow-hidden rounded-full bg-[#F1E8FF]"
        >
          <div
            className="h-full rounded-full bg-[#B8A0E6] transition-all duration-500"
            style={{
              width: `${(visitadas.length / partes.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* PARTES DEL CEREBRO */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {partes.map((item, index) => {
          const activa = seleccion === index;
          const descubierta = visitadas.includes(index);

          return (
            <button
              key={item.nombre}
              type="button"
              onClick={() => seleccionar(index)}
              aria-pressed={activa}
              className={`relative flex min-h-40 flex-col items-center justify-center rounded-[28px] border-4 p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-md focus-visible:outline-4 focus-visible:outline-[#66549B] ${
                activa ? "border-[#B8A0E6] shadow-lg" : "border-transparent"
              }`}
              style={{ backgroundColor: item.color }}
            >
              {descubierta && (
                <span className="absolute right-3 top-3 text-lg">
                  ⭐
                </span>
              )}

              <div className="relative h-28 w-full sm:h-32">
                <Image
                  src={item.imagen}
                  alt={`Ilustración de ${item.nombre}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-contain"
                />
              </div>

              <span className="mt-3 font-['Fredoka'] text-lg text-[#66549B]">
                {item.nombre}
              </span>

              <span
                lang="en"
                className="mt-1 font-['Nunito'] text-sm text-[#C87899]"
              >
                {item.ingles}
              </span>
            </button>
          );
        })}
      </div>

      {/* EXPLICACIÓN DE LA REGIÓN */}
      {parte ? (
        <section
          aria-live="polite"
          className="mt-9 rounded-[32px] bg-[#F8F3FF] p-6 text-center sm:p-9"
        >
          <div
            className="relative mx-auto mb-6 h-56 w-full max-w-sm overflow-hidden rounded-[24px] sm:h-72"
            style={{ backgroundColor: parte.color }}
          >
            <Image
              src={parte.imagen}
              alt={`Ilustración de ${parte.nombre}`}
              fill
              sizes="(max-width: 640px) 100vw, 384px"
              className="object-contain p-4"
            />
          </div>

          <h2 className="mt-4 font-['Fredoka'] text-3xl text-[#66549B]">
            {parte.nombre}
          </h2>

          <p
            lang="en"
            className="mt-2 font-['Fredoka'] text-xl text-[#C87899]"
          >
            {parte.ingles}
          </p>

          <p className="mx-auto mt-5 max-w-xl font-['Nunito'] text-lg leading-relaxed text-[#635B70]">
            {parte.descripcion}
          </p>

          {/* AUDIO BILINGÜE */}
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => escuchar(parte.nombre, "es")}
              className="rounded-full bg-white px-7 py-3 font-['Fredoka'] text-lg text-[#66549B] shadow-sm"
            >
              🔊 Español
            </button>

            <button
              type="button"
              onClick={() => escuchar(parte.ingles, "en")}
              className="rounded-full bg-[#B8A0E6] px-7 py-3 font-['Fredoka'] text-lg text-white shadow-sm"
            >
              🔊 English
            </button>
          </div>

          {/* EJEMPLO COTIDIANO */}
          <div className="mt-8 rounded-[24px] bg-white p-6">
            <h3 className="font-['Fredoka'] text-xl text-[#C87899]">
              ¡En mi vida diaria!
            </h3>

            <p className="mt-3 font-['Nunito'] text-lg text-[#635B70]">
              {parte.ejemplo}
            </p>
          </div>

          {/* PREGUNTA */}
          <div className="mt-5 rounded-[24px] bg-[#E8F2E5] p-6">
            <h3 className="font-['Fredoka'] text-xl text-[#66549B]">
              ¡Ahora tú!
            </h3>

            <p className="mt-3 font-['Nunito'] text-lg text-[#635B70]">
              {parte.pregunta}
            </p>
          </div>
        </section>
      ) : (
        <div className="mt-9 rounded-[28px] bg-[#F1E8FF] p-8 text-center">
          <p className="font-['Fredoka'] text-xl text-[#66549B]">
            ¡Toca una tarjeta para comenzar!
          </p>
        </div>
      )}

      {/* FELICITACIÓN */}
      {completado && (
        <div
          role="status"
          className="mt-8 rounded-[32px] bg-[#E8F2E5] p-8 text-center"
        >
          <div className="text-5xl">🌟</div>

          <h2 className="mt-4 font-['Fredoka'] text-3xl text-[#66549B]">
            ¡Maravilloso!
          </h2>

          <p className="mt-3 font-['Nunito'] text-lg text-[#635B70]">
            ¡Has descubierto las ocho partes!
            Tu aventura científica continúa.
          </p>

          <button
            type="button"
            onClick={reiniciar}
            className="mt-6 rounded-full bg-white px-8 py-3 font-['Fredoka'] text-[#66549B] shadow-sm"
          >
            Volver a explorar
          </button>
        </div>
      )}

      {/* CONFIGURACIÓN DE VOZ */}
      <div className="mt-10 border-t border-purple-100 pt-6 text-center">
        <button
          type="button"
          onClick={() => setMostrarVoces(!mostrarVoces)}
          aria-expanded={mostrarVoces}
          className="font-['Nunito'] text-sm text-[#847B8D] underline"
        >
          Configurar pronunciación en inglés
        </button>

        {mostrarVoces && (
          <div className="mx-auto mt-5 max-w-md rounded-[24px] bg-[#F8F3FF] p-5">
            <label
              htmlFor="voz-ingles"
              className="block font-['Nunito'] text-sm text-[#635B70]"
            >
              Elige una voz inglesa
            </label>

            <select
              id="voz-ingles"
              value={vozIngles}
              onChange={(e) => setVozIngles(e.target.value)}
              className="mt-3 w-full rounded-xl border border-purple-100 bg-white p-3 font-['Nunito'] text-[#66549B]"
            >
              {vocesInglesas.length === 0 && (
                <option value="">No hay voces inglesas disponibles</option>
              )}

              {vocesInglesas.map((voz) => (
                <option key={voz.voiceURI} value={voz.voiceURI}>
                  {voz.name} ({voz.lang})
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => escuchar("Hello! This is my wonderful brain!", "en")}
              disabled={!vozIngles}
              className="mt-4 rounded-full bg-[#B8A0E6] px-6 py-3 font-['Fredoka'] text-white disabled:opacity-50"
            >
              🔊 Probar voz
            </button>
          </div>
        )}
      </div>
    </GameLayout>
  );
}