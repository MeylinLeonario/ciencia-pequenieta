
"use client";

import { useEffect, useState } from "react";
import GameLayout from "@/components/game-layout";

const colores = [
  { nombre: "Rosado", ingles: "Pink", valor: "#F4A6C1" },
  { nombre: "Morado", ingles: "Purple", valor: "#B8A0E6" },
  { nombre: "Verde", ingles: "Green", valor: "#A9CFA5" },
  { nombre: "Azul", ingles: "Blue", valor: "#477DCA" },
  { nombre: "Amarillo", ingles: "Yellow", valor: "#F7D66B" },
  { nombre: "Naranja", ingles: "Orange", valor: "#F6AD70" },
  { nombre: "Rojo", ingles: "Red", valor: "#DC6666" },
  { nombre: "Celeste", ingles: "Light Blue", valor: "#A9DDED" },
  { nombre: "Café", ingles: "Brown", valor: "#B9957B" },
  { nombre: "Gris", ingles: "Gray", valor: "#A9A9B5" },
];

type Color = (typeof colores)[number];

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
  return {
    preguntas: mezclar(colores),
    paleta: mezclar(colores),
  };
}

export default function BrainColors() {
  const [partida, setPartida] = useState<ReturnType<
    typeof crearPartida
  > | null>(null);

  const [paso, setPaso] = useState(0);
  const [mensaje, setMensaje] = useState("");
  const [aciertos, setAciertos] = useState(0);
  const [bloqueado, setBloqueado] = useState(false);
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

  function escuchar(
    texto: string,
    idioma: "es" | "en"
  ) {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const voz = new SpeechSynthesisUtterance(texto);

    voz.lang = idioma === "es" ? "es-CL" : "en-US";
    voz.rate = 0.8;
    voz.pitch = 1;

    const disponible =
      voces.find(
        (v) =>
          v.lang.toLowerCase() ===
          (idioma === "es" ? "es-cl" : "en-us")
      ) ??
      voces.find((v) =>
        v.lang.toLowerCase().startsWith(idioma)
      );

    if (disponible) {
      voz.voice = disponible;
      voz.lang = disponible.lang;
    }

    window.speechSynthesis.speak(voz);
  }

  function comenzar() {
    window.speechSynthesis?.cancel();

    setPartida(crearPartida());
    setPaso(0);
    setMensaje("");
    setAciertos(0);
    setBloqueado(false);
  }

  function responder(color: Color) {
    if (!partida || bloqueado) return;

    const correcto = partida.preguntas[paso];

    if (!correcto) return;

    if (color.valor === correcto.valor) {
      setMensaje("¡Muy bien! ¡Encontraste el color!");
      setAciertos((actual) => actual + 1);
      setBloqueado(true);
    } else {
      setMensaje("¡Casi! Intenta con otro color.");
    }
  }

  function siguiente() {
    if (!partida) return;

    setPaso((actual) => actual + 1);
    setMensaje("");
    setBloqueado(false);
  }

  const preguntas = partida?.preguntas ?? [];
  const terminado = partida !== null && paso >= preguntas.length;
  const pregunta = preguntas[paso];

  return (
    <GameLayout
      titulo="Colores del cerebro"
      tituloIngles="Brain Colors"
      descripcion="¡Aprende los colores en español e inglés mientras juegas!"
    >
      {/* PANTALLA INICIAL */}
      {!partida ? (
        <div className="py-12 text-center">

          <h2 className="font-['Fredoka'] text-3xl text-[#66549B]">
            ¡Vamos a descubrir los colores!
          </h2>

          <p className="mx-auto mt-5 max-w-lg font-['Nunito'] text-lg leading-relaxed text-[#635B70]">
            Escucha el nombre de un color,
            encuentra el círculo correcto
            y descubre cuántos colores conoces.
          </p>

          <div className="mx-auto mt-8 flex max-w-md flex-wrap justify-center gap-3">
            {colores.map((color) => (
              <div
                key={color.nombre}
                className="h-12 w-12 rounded-full border-4 border-white shadow-sm"
                style={{
                  backgroundColor: color.valor,
                }}
              />
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
            Pregunta {paso + 1} de {preguntas.length}
          </p>

          <div
            role="progressbar"
            aria-label="Progreso del juego"
            aria-valuemin={0}
            aria-valuemax={preguntas.length}
            aria-valuenow={paso + (bloqueado ? 1 : 0)}
            className="mx-auto mt-4 h-4 max-w-md overflow-hidden rounded-full bg-[#F1E8FF]"
          >
            <div
              className="h-full rounded-full bg-[#B8A0E6] transition-all duration-300"
              style={{
                width: `${
                  ((paso + (bloqueado ? 1 : 0)) /
                    preguntas.length) *
                  100
                }%`,
              }}
            />
          </div>

          {/* PREGUNTA */}
          <section className="mx-auto mt-9 max-w-xl rounded-[32px] bg-[#F8F3FF] px-6 py-10">

            <span className="font-['Fredoka'] text-lg text-[#C87899]">
              ¡Tu desafío!
            </span>

            <h2 className="mt-5 font-['Fredoka'] text-3xl text-[#66549B] sm:text-4xl">
              ¿Dónde está el {pregunta.nombre.toLowerCase()}?
            </h2>

            <p
              lang="en"
              className="mt-3 font-['Fredoka'] text-xl text-[#C87899]"
            >
              Where is {pregunta.ingles.toLowerCase()}?
            </p>

            {/* AUDIOS */}
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={() =>
                  escuchar(pregunta.nombre, "es")
                }
                className="rounded-full bg-white px-6 py-3 font-['Fredoka'] text-[#66549B] shadow-sm"
              >
                🔊 Español
              </button>

              <button
                type="button"
                onClick={() =>
                  escuchar(pregunta.ingles, "en")
                }
                className="rounded-full bg-[#B8A0E6] px-6 py-3 font-['Fredoka'] text-white shadow-sm"
              >
                🔊 English
              </button>
            </div>
          </section>

          {/* OPCIONES */}
          <h3 className="mt-9 font-['Fredoka'] text-xl text-[#66549B]">
            ¡Toca el color correcto!
          </h3>

          <div className="mx-auto mt-6 grid max-w-xl grid-cols-3 gap-4 sm:grid-cols-5">
            {partida.paleta.map((color) => (
              <button
                key={color.nombre}
                type="button"
                onClick={() => responder(color)}
                disabled={bloqueado}
                aria-label={color.nombre}
                className="flex min-h-24 flex-col items-center justify-center gap-2 rounded-[24px] bg-white p-3 shadow-sm transition-transform hover:scale-105 focus-visible:outline-4 focus-visible:outline-[#66549B] disabled:cursor-default"
              >
                <span
                  className="block h-14 w-14 rounded-full border-4 border-white shadow-md sm:h-16 sm:w-16"
                  style={{
                    backgroundColor: color.valor,
                  }}
                />

                <span className="font-['Nunito'] text-xs text-[#635B70]">
                  {color.nombre}
                </span>
              </button>
            ))}
          </div>

          {/* RESULTADO */}
          <div aria-live="polite" className="mt-8 min-h-20">
            <p className="font-['Fredoka'] text-xl text-[#66549B]">
              {mensaje}
            </p>

            {bloqueado && (
              <button
                type="button"
                onClick={siguiente}
                className="mt-5 rounded-full bg-[#B8A0E6] px-9 py-3 font-['Fredoka'] text-lg text-white shadow-sm"
              >
                {paso === preguntas.length - 1
                  ? "¡TERMINAR!"
                  : "¡SIGUIENTE!"}
              </button>
            )}
          </div>

        </div>
      ) : (
        /* PANTALLA FINAL */
        <div className="py-10 text-center">

          <h2 className="font-['Fredoka'] text-4xl text-[#66549B]">
            ¡Lo lograste!
          </h2>

          <p
            lang="en"
            className="mt-3 font-['Fredoka'] text-xl text-[#C87899]"
          >
            You did it!
          </p>

          <p className="mx-auto mt-6 max-w-lg font-['Nunito'] text-lg leading-relaxed text-[#635B70]">
            ¡Has encontrado los {aciertos} colores!
            Ahora conoces sus nombres en español e inglés.
          </p>

          <div className="mx-auto mt-8 flex max-w-md flex-wrap justify-center gap-3">
            {preguntas.map((color) => (
              <div
                key={color.nombre}
                className="h-12 w-12 rounded-full border-4 border-white shadow-sm"
                style={{
                  backgroundColor: color.valor,
                }}
              />
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
