
"use client";

import { useState } from "react";
import GameLayout from "@/components/game-layout";

const BASE = "/activities/my-wonderful-brain/build-your-brain";
const IMAGEN = `${BASE}/imagen_completa.png`;

const niveles = [
  { nombre: "Explorador", filas: 2, columnas: 5 },
  { nombre: "Investigador", filas: 3, columnas: 6 },
  { nombre: "Científico", filas: 5, columnas: 10 },
];

type Pieza = {
  id: number;
  fila: number;
  columna: number;
  imagen: string;
};

function mezclar<T,>(array: T[]): T[] {
  const copia = [...array];

  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }

  return copia;
}

function crearPiezas(filas: number, columnas: number): Pieza[] {
  return Array.from({ length: filas * columnas }, (_, id) => {
    const fila = Math.floor(id / columnas);
    const columna = id % columnas;

    const numero = String(id + 1).padStart(2, "0");
    const numeroFila = fila + 1;
    const numeroColumna = String(columna + 1).padStart(2, "0");

    const imagen =
      filas === 5 && columnas === 10
        ? `${BASE}/piezas/pieza_${numero}_fila_${numeroFila}_columna_${numeroColumna}.png`
        : IMAGEN;

    return { id, fila, columna, imagen };
  });
}

function Estampa({
  pieza,
  filas,
  columnas,
}: {
  pieza: Pieza;
  filas: number;
  columnas: number;
}) {
  const usaArchivos = filas === 5 && columnas === 10;

  return (
    <div
      className="h-full w-full"
      style={
        usaArchivos
          ? {
              backgroundImage: `url("${pieza.imagen}")`,
              backgroundSize: "100% 100%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }
          : {
              backgroundImage: `url("${IMAGEN}")`,
              backgroundSize: `${columnas * 100}% ${filas * 100}%`,
              backgroundPosition: `${
                columnas === 1
                  ? 0
                  : (pieza.columna / (columnas - 1)) * 100
              }% ${
                filas === 1
                  ? 0
                  : (pieza.fila / (filas - 1)) * 100
              }%`,
              backgroundRepeat: "no-repeat",
            }
      }
    />
  );
}

export default function BuildYourBrain() {
  const [nivel, setNivel] = useState<number | null>(null);
  const [piezas, setPiezas] = useState<Pieza[]>([]);
  const [bandeja, setBandeja] = useState<number[]>([]);
  const [colocadas, setColocadas] = useState<Record<number, number>>({});
  const [seleccionada, setSeleccionada] = useState<number | null>(null);
  const [mostrarReferencia, setMostrarReferencia] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const configuracion = nivel === null ? null : niveles[nivel];
  const total = piezas.length;
  const completadas = Object.keys(colocadas).length;
  const terminado = total > 0 && completadas === total;

  function comenzar(indice: number) {
    const config = niveles[indice];
    const nuevas = crearPiezas(config.filas, config.columnas);

    setNivel(indice);
    setPiezas(nuevas);
    setBandeja(mezclar(nuevas.map((p) => p.id)));
    setColocadas({});
    setSeleccionada(null);
    setMostrarReferencia(false);
    setMensaje("");
  }

  function colocar(idPieza: number, posicion: number) {
    if (colocadas[posicion] !== undefined) return;

    if (idPieza === posicion) {
      setColocadas((actual) => ({
        ...actual,
        [posicion]: idPieza,
      }));

      setBandeja((actual) =>
        actual.filter((id) => id !== idPieza)
      );

      setSeleccionada(null);
      setMensaje("¡Muy bien! ¡Esa pieza encaja!");
    } else {
      setMensaje("¡Casi! Prueba en otro lugar.");
    }
  }

  function tocarCasilla(posicion: number) {
    if (seleccionada === null) return;
    colocar(seleccionada, posicion);
  }

  function soltar(
    evento: React.DragEvent<HTMLDivElement>,
    posicion: number
  ) {
    evento.preventDefault();

    const id = Number(
      evento.dataTransfer.getData("text/plain")
    );

    if (Number.isNaN(id)) return;
    colocar(id, posicion);
  }

  return (
    <GameLayout
      titulo="Arma tu cerebro"
      tituloIngles="Build Your Brain"
      descripcion="¡Une las piezas y descubre cómo se ve tu cerebro!"
    >
      {nivel === null ? (
        <div className="py-8 text-center">
          <h2 className="font-['Fredoka'] text-3xl text-[#66549B]">
            ¡Construyamos un cerebro!
          </h2>

          <p className="mx-auto mt-4 max-w-lg font-['Nunito'] text-lg text-[#635B70]">
            Elige tu desafío y coloca cada pieza en
            el lugar correcto.
          </p>

          <div className="mt-9 grid gap-5 sm:grid-cols-3">
            {niveles.map((item, index) => (
              <button
                key={item.nombre}
                onClick={() => comenzar(index)}
                className="rounded-[28px] bg-[#F1E8FF] p-7 transition-transform hover:scale-105"
              >
                <h3 className="font-['Fredoka'] text-2xl text-[#66549B]">
                  {item.nombre}
                </h3>

                <p className="mt-3 font-['Nunito'] text-[#635B70]">
                  {item.filas * item.columnas} piezas
                </p>

                <span className="mt-6 inline-block rounded-full bg-white px-6 py-3 font-['Fredoka'] text-[#66549B]">
                  ¡JUGAR!
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center">

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setNivel(null)}
              className="rounded-full bg-[#F1E8FF] px-5 py-3 font-['Fredoka'] text-[#66549B]"
            >
              Cambiar nivel
            </button>

            <button
              onClick={() => setMostrarReferencia(true)}
              className="rounded-full bg-[#FCE8EF] px-5 py-3 font-['Fredoka'] text-[#66549B]"
            >
              Ver cerebro completo
            </button>

            <button
              onClick={() => comenzar(nivel)}
              className="rounded-full bg-[#E8F2E5] px-5 py-3 font-['Fredoka'] text-[#66549B]"
            >
              Reiniciar
            </button>
          </div>

          <p className="mt-7 font-['Fredoka'] text-xl text-[#66549B]">
            {completadas} de {total} piezas
          </p>

          <div className="mx-auto mt-3 h-4 max-w-md overflow-hidden rounded-full bg-[#F1E8FF]">
            <div
              className="h-full rounded-full bg-[#B8A0E6] transition-all"
              style={{
                width: `${(completadas / total) * 100}%`,
              }}
            />
          </div>

          {terminado ? (
            <div className="mt-10 rounded-[32px] bg-[#E8F2E5] p-8">
              <h2 className="font-['Fredoka'] text-3xl text-[#66549B]">
                ¡Construiste tu cerebro!
              </h2>

              <p lang="en" className="mt-2 font-['Nunito'] text-lg text-[#C87899]">
                You built your brain!
              </p>

              <img
                src={IMAGEN}
                alt="Cerebro completo"
                className="mx-auto mt-6 max-h-80 w-full object-contain"
              />

              <button
                onClick={() => comenzar(nivel)}
                className="mt-7 rounded-full bg-[#B8A0E6] px-8 py-4 font-['Fredoka'] text-white"
              >
                ¡JUGAR OTRA VEZ!
              </button>
            </div>
          ) : (
            <>
              {/* TABLERO */}
              <div className="mx-auto mt-9 max-w-3xl rounded-[28px] bg-[#F8F3FF] p-3 sm:p-5">
                <div
                  className="grid w-full overflow-hidden rounded-xl"
                  style={{
                    gridTemplateColumns: `repeat(${configuracion!.columnas}, minmax(0, 1fr))`,
                    aspectRatio: `${configuracion!.columnas} / ${configuracion!.filas}`,
                  }}
                >
                  {piezas.map((pieza) => {
                    const colocada = colocadas[pieza.id] !== undefined;

                    return (
                      <div
                        key={pieza.id}
                        onClick={() => tocarCasilla(pieza.id)}
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => soltar(e, pieza.id)}
                        className={`relative min-h-0 min-w-0 overflow-hidden border border-[#D9CDED] ${
                          colocada
                            ? "bg-white"
                            : "cursor-pointer bg-[#EEE6FA] hover:bg-[#E2D5F4]"
                        }`}
                        style={{ aspectRatio: "1 / 1" }}
                      >
                        {colocada ? (
                          <Estampa
                            pieza={pieza}
                            filas={configuracion!.filas}
                            columnas={configuracion!.columnas}
                          />
                        ) : (
                          <span className="absolute inset-0 flex items-center justify-center font-['Nunito'] text-xs text-[#A698BE]">
                            {pieza.id + 1}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <p aria-live="polite" className="mt-5 min-h-7 font-['Fredoka'] text-lg text-[#66549B]">
                {mensaje}
              </p>

              {/* BANDEJA */}
              <h3 className="mt-8 font-['Fredoka'] text-2xl text-[#66549B]">
                Tus piezas
              </h3>

              <p className="mt-2 font-['Nunito'] text-[#635B70]">
                Toca una pieza y luego su lugar,
                o arrástrala hasta el tablero.
              </p>

              <div className="mx-auto mt-6 grid max-w-3xl grid-cols-5 gap-2 sm:grid-cols-8">
                {bandeja.map((id) => {
                  const pieza = piezas[id];

                  return (
                    <div
                      key={id}
                      draggable
                      onDragStart={(e) =>
                        e.dataTransfer.setData(
                          "text/plain",
                          String(id)
                        )
                      }
                      onClick={() => {
                        setSeleccionada(id);
                        setMensaje("¡Ahora busca dónde va!");
                      }}
                      className={`aspect-square cursor-grab overflow-hidden rounded-lg border-4 bg-white shadow-sm transition-transform hover:scale-105 ${
                        seleccionada === id
                          ? "border-[#66549B] scale-105"
                          : "border-white"
                      }`}
                    >
                      <Estampa
                        pieza={pieza}
                        filas={configuracion!.filas}
                        columnas={configuracion!.columnas}
                      />
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* REFERENCIA */}
          {mostrarReferencia && (
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Imagen completa del cerebro"
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5"
            >
              <div className="w-full max-w-2xl rounded-[32px] bg-white p-6 text-center shadow-xl">
                <h3 className="font-['Fredoka'] text-2xl text-[#66549B]">
                  ¡Así se ve tu cerebro!
                </h3>

                <img
                  src={IMAGEN}
                  alt="Imagen completa del rompecabezas"
                  className="mx-auto mt-5 max-h-[60vh] w-full object-contain"
                />

                <button
                  onClick={() => setMostrarReferencia(false)}
                  className="mt-6 rounded-full bg-[#B8A0E6] px-8 py-3 font-['Fredoka'] text-white"
                >
                  ¡SEGUIR JUGANDO!
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </GameLayout>
  );
}
