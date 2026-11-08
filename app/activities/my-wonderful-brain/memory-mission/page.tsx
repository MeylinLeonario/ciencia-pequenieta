
"use client";

import { useEffect, useRef, useState } from "react";
import GameLayout from "@/components/game-layout";

const TOTAL_RONDAS = 10;

const simbolos = [
  {
    id: 0,
    nombre: "Flor",
    ingles: "Flower",
    icono: "🌸",
    fondo: "#FCE8EF",
  },
  {
    id: 1,
    nombre: "Estrella",
    ingles: "Star",
    icono: "⭐",
    fondo: "#F1E8FF",
  },
  {
    id: 2,
    nombre: "Hoja",
    ingles: "Leaf",
    icono: "🍃",
    fondo: "#E8F2E5",
  },
  {
    id: 3,
    nombre: "Sol",
    ingles: "Sun",
    icono: "☀️",
    fondo: "#FFF0D9",
  },
];

type Fase =
  | "inicio"
  | "observando"
  | "respondiendo"
  | "correcto"
  | "terminado";

function crearSecuencia(longitud: number): number[] {
  return Array.from(
    { length: longitud },
    () => Math.floor(Math.random() * simbolos.length)
  );
}

function longitudRonda(ronda: number): number {
  return Math.min(6, 2 + Math.floor(ronda / 2));
}

function esperar(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function MemoryMission() {
  const [fase, setFase] = useState<Fase>("inicio");
  const [ronda, setRonda] = useState(0);
  const [secuencia, setSecuencia] = useState<number[]>([]);
  const [respuesta, setRespuesta] = useState<number[]>([]);
  const [activo, setActivo] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [errores, setErrores] = useState(0);
  const [repeticiones, setRepeticiones] = useState(0);
  const [estrellas, setEstrellas] = useState(0);

  const ejecucion = useRef(0);
  const montado = useRef(true);

  useEffect(() => {
    montado.current = true;

    return () => {
      montado.current = false;
      ejecucion.current++;
    };
  }, []);

  async function mostrarSecuencia(numeros: number[]) {
    const actual = ++ejecucion.current;

    setFase("observando");
    setActivo(null);
    setRespuesta([]);
    setMensaje("¡Observa con atención!");

    await esperar(600);

    for (const numero of numeros) {
      if (!montado.current || actual !== ejecucion.current) return;

      setActivo(numero);
      await esperar(750);

      if (!montado.current || actual !== ejecucion.current) return;

      setActivo(null);
      await esperar(300);
    }

    if (!montado.current || actual !== ejecucion.current) return;

    setFase("respondiendo");
    setMensaje("¡Ahora repite la secuencia!");
  }

  function comenzarRonda(numero: number) {
    const nuevaSecuencia = crearSecuencia(longitudRonda(numero));

    setRonda(numero);
    setSecuencia(nuevaSecuencia);
    setRespuesta([]);
    setErrores(0);
    setRepeticiones(0);
    setActivo(null);

    void mostrarSecuencia(nuevaSecuencia);
  }

  function comenzar() {
    setEstrellas(0);
    comenzarRonda(0);
  }

  function repetir() {
    if (fase !== "respondiendo") return;

    setRepeticiones((actual) => actual + 1);
    setRespuesta([]);
    void mostrarSecuencia(secuencia);
  }

  function responder(id: number) {
    if (fase !== "respondiendo") return;

    const posicion = respuesta.length;

    if (secuencia[posicion] !== id) {
      setErrores((actual) => actual + 1);
      setRespuesta([]);
      setMensaje(
        "¡Casi! Vuelve a intentarlo desde el principio."
      );
      return;
    }

    const nuevaRespuesta = [...respuesta, id];
    setRespuesta(nuevaRespuesta);

    if (nuevaRespuesta.length === secuencia.length) {
      const ganadas =
        errores === 0 && repeticiones === 0
          ? 3
          : errores <= 1 && repeticiones <= 1
          ? 2
          : 1;

      setEstrellas((actual) => actual + ganadas);
      setFase("correcto");
      setMensaje("¡Excelente memoria! ¡Secuencia completada!");
    } else {
      setMensaje("¡Muy bien! ¡Continúa!");
    }
  }

  function siguiente() {
    if (ronda + 1 >= TOTAL_RONDAS) {
      setFase("terminado");
      setMensaje("");
    } else {
      comenzarRonda(ronda + 1);
    }
  }

  function reiniciar() {
    ejecucion.current++;
    setFase("inicio");
    setRonda(0);
    setSecuencia([]);
    setRespuesta([]);
    setActivo(null);
    setMensaje("");
    setErrores(0);
    setRepeticiones(0);
    setEstrellas(0);
  }

  return (
    <GameLayout
      titulo="Misión memoria"
      tituloIngles="Memory Mission"
      descripcion="¡Observa, recuerda y repite las secuencias!"
    >
      {fase === "inicio" ? (
        /* PANTALLA INICIAL */
        <div className="py-10 text-center">
          <h2 className="font-['Fredoka'] text-3xl text-[#66549B]">
            ¡Bienvenido al laboratorio de memoria!
          </h2>

          <p className="mx-auto mt-5 max-w-xl font-['Nunito'] text-lg leading-relaxed text-[#635B70]">
            Tu cerebro puede recordar muchas cosas.
            Observa los símbolos que se iluminan y
            después tócalos en el mismo orden.
          </p>

          <div className="mx-auto mt-8 grid max-w-sm grid-cols-2 gap-4">
            {simbolos.map((simbolo) => (
              <div
                key={simbolo.id}
                className="flex aspect-square flex-col items-center justify-center rounded-[28px] border-4 border-white shadow-sm"
                style={{ backgroundColor: simbolo.fondo }}
              >
                <span className="text-6xl">
                  {simbolo.icono}
                </span>

                <p className="mt-3 font-['Fredoka'] text-xl text-[#66549B]">
                  {simbolo.nombre}
                </p>

                <p
                  lang="en"
                  className="font-['Nunito'] text-sm text-[#C87899]"
                >
                  {simbolo.ingles}
                </p>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-7 max-w-lg font-['Nunito'] text-[#635B70]">
            ¡Tendrás diez misiones y podrás repetir
            las secuencias cuando lo necesites!
          </p>

          <button
            type="button"
            onClick={comenzar}
            className="mt-9 rounded-full bg-[#B8A0E6] px-10 py-4 font-['Fredoka'] text-xl text-white shadow-md transition-transform hover:scale-105"
          >
            ¡COMENZAR!
          </button>
        </div>
      ) : fase === "terminado" ? (
        /* PANTALLA FINAL */
        <div className="py-10 text-center">
          <div className="text-6xl">🌟</div>

          <h2 className="mt-5 font-['Fredoka'] text-4xl text-[#66549B]">
            ¡Misión completada!
          </h2>

          <p
            lang="en"
            className="mt-3 font-['Fredoka'] text-xl text-[#C87899]"
          >
            Memory Mission Complete!
          </p>

          <p className="mx-auto mt-5 max-w-lg font-['Nunito'] text-lg text-[#635B70]">
            ¡Completaste las diez rondas y pusiste
            a prueba tu memoria de trabajo!
          </p>

          <div className="mx-auto mt-8 max-w-sm rounded-[28px] bg-[#FFF0D9] p-7">
            <p className="font-['Fredoka'] text-xl text-[#66549B]">
              Tus estrellas
            </p>

            <p className="mt-4 font-['Fredoka'] text-4xl text-[#66549B]">
              {estrellas} / {TOTAL_RONDAS * 3}
            </p>
          </div>

          <p className="mx-auto mt-7 max-w-lg font-['Nunito'] text-[#635B70]">
            La memoria de trabajo nos ayuda a mantener
            información en nuestra mente durante un
            momento, como cuando recordamos instrucciones.
          </p>

          <button
            type="button"
            onClick={reiniciar}
            className="mt-9 rounded-full bg-[#B8A0E6] px-10 py-4 font-['Fredoka'] text-xl text-white shadow-md transition-transform hover:scale-105"
          >
            ¡JUGAR OTRA VEZ!
          </button>
        </div>
      ) : (
        /* JUEGO */
        <div className="text-center">

          {/* PROGRESO */}
          <p className="font-['Nunito'] text-[#635B70]">
            Misión {ronda + 1} de {TOTAL_RONDAS}
          </p>

          <div
            role="progressbar"
            aria-label="Progreso de las misiones"
            aria-valuemin={0}
            aria-valuemax={TOTAL_RONDAS}
            aria-valuenow={ronda + (fase === "correcto" ? 1 : 0)}
            className="mx-auto mt-4 h-4 max-w-md overflow-hidden rounded-full bg-[#F1E8FF]"
          >
            <div
              className="h-full rounded-full bg-[#B8A0E6] transition-all duration-300"
              style={{
                width: `${
                  ((ronda + (fase === "correcto" ? 1 : 0)) /
                    TOTAL_RONDAS) *
                  100
                }%`,
              }}
            />
          </div>

          {/* PANEL DE MISIÓN */}
          <section className="mx-auto mt-9 max-w-2xl rounded-[32px] bg-[#F8F3FF] p-6 sm:p-9">

            <h2 className="font-['Fredoka'] text-3xl text-[#66549B]">
              {fase === "observando"
                ? "¡Observa!"
                : fase === "respondiendo"
                ? "¡Tu turno!"
                : "¡Lo lograste!"}
            </h2>

            <p
              lang="en"
              className="mt-2 font-['Nunito'] text-lg text-[#C87899]"
            >
              {fase === "observando"
                ? "Watch carefully!"
                : fase === "respondiendo"
                ? "Your turn!"
                : "You did it!"}
            </p>

            <p className="mt-5 font-['Nunito'] text-[#635B70]">
              Recuerda {secuencia.length} símbolos en orden.
            </p>

            {/* TABLERO */}
            <div className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-4 sm:gap-5">
              {simbolos.map((simbolo) => {
                const iluminado =
                  fase === "observando" &&
                  activo === simbolo.id;

                const disponible = fase === "respondiendo";

                return (
                  <button
                    key={simbolo.id}
                    type="button"
                    onClick={() => responder(simbolo.id)}
                    disabled={!disponible}
                    aria-label={simbolo.nombre}
                    className={`flex aspect-square flex-col items-center justify-center rounded-[28px] border-4 shadow-sm transition-all duration-200 ${
                      iluminado
                        ? "scale-110 border-[#66549B] shadow-xl brightness-110"
                        : "border-white"
                    } ${
                      disponible
                        ? "cursor-pointer hover:scale-105 active:scale-95"
                        : "cursor-default"
                    }`}
                    style={{
                      backgroundColor: simbolo.fondo,
                    }}
                  >
                    <span className="text-5xl sm:text-6xl">
                      {simbolo.icono}
                    </span>

                    <span className="mt-3 font-['Fredoka'] text-lg text-[#66549B]">
                      {simbolo.nombre}
                    </span>

                    <span
                      lang="en"
                      className="font-['Nunito'] text-sm text-[#C87899]"
                    >
                      {simbolo.ingles}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* RESPUESTA */}
            {fase === "respondiendo" && (
              <div className="mt-8">
                <p className="font-['Fredoka'] text-lg text-[#66549B]">
                  Tu secuencia
                </p>

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {secuencia.map((_, index) => {
                    const id = respuesta[index];
                    const simbolo =
                      id !== undefined
                        ? simbolos[id]
                        : null;

                    return (
                      <div
                        key={index}
                        className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm"
                      >
                        {simbolo?.icono ?? "?"}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <p
              aria-live="polite"
              className="mt-7 min-h-7 font-['Fredoka'] text-xl text-[#66549B]"
            >
              {mensaje}
            </p>

            {/* CONTROLES */}
            {fase === "respondiendo" && (
              <button
                type="button"
                onClick={repetir}
                className="mt-5 rounded-full bg-[#FCE8EF] px-7 py-3 font-['Fredoka'] text-[#66549B] shadow-sm"
              >
                ¡VER SECUENCIA OTRA VEZ!
              </button>
            )}

            {fase === "correcto" && (
              <button
                type="button"
                onClick={siguiente}
                className="mt-6 rounded-full bg-[#B8A0E6] px-9 py-4 font-['Fredoka'] text-lg text-white shadow-sm"
              >
                {ronda === TOTAL_RONDAS - 1
                  ? "¡TERMINAR!"
                  : "¡SIGUIENTE MISIÓN!"}
              </button>
            )}
          </section>

          {/* REINICIAR */}
          <button
            type="button"
            onClick={reiniciar}
            className="mt-7 font-['Nunito'] text-sm text-[#635B70] underline"
          >
            Volver al inicio
          </button>
        </div>
      )}
    </GameLayout>
  );
}
