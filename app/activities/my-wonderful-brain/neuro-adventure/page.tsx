
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import GameLayout from "@/components/game-layout";

type Punto = { x: number; y: number };
type Direccion = "up" | "down" | "left" | "right";
type Fase = "inicio" | "jugando" | "completado" | "final";

type Nivel = {
  nombre: string;
  ingles: string;
  descripcion: string;
  mapa: string[];
};

const niveles: Nivel[] = [
  {
    nombre: "El bosque de dendritas",
    ingles: "The Dendrite Forest",
    descripcion: "¡Encuentra energía para abrir la sinapsis!",
    mapa: [
      "#############",
      "#S....#.....#",
      "###.#.#.###.#",
      "#...#...#...#",
      "#.#######.#.#",
      "#...E.....#.#",
      "#.#########.#",
      "#.....*.....#",
      "#####.#####.#",
      "#.....#...G.#",
      "#.#####.###.#",
      "#...........#",
      "#############",
    ],
  },
  {
    nombre: "Los caminos secretos",
    ingles: "The Secret Pathways",
    descripcion: "¡Explora las ramificaciones neuronales!",
    mapa: [
      "#############",
      "#S....#.....#",
      "#.###.#.###.#",
      "#...#...#...#",
      "###.#####.#.#",
      "#...E.....#.#",
      "#.#########.#",
      "#.....*.....#",
      "#.#########.#",
      "#...#.....D.#",
      "#.#.#.#####.#",
      "#...........#",
      "#############",
    ],
  },
  {
    nombre: "La gran conexión",
    ingles: "The Great Connection",
    descripcion: "¡Completa el último viaje de Chispa!",
    mapa: [
      "#############",
      "#S....#.....#",
      "#.##..#.###.#",
      "#...#...#...#",
      "###.#####.#.#",
      "#...E.....#.#",
      "#.#########.#",
      "#.....*.....#",
      "#.#########.#",
      "#.....#...G.#",
      "#.###.#.###.#",
      "#...........#",
      "#############",
    ],
  },
];

const movimientos: Record<Direccion, Punto> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};

function buscar(mapa: string[], caracter: string): Punto {
  for (let y = 0; y < mapa.length; y++) {
    const x = mapa[y].indexOf(caracter);
    if (x !== -1) return { x, y };
  }

  return { x: 1, y: 1 };
}

function clave(p: Punto): string {
  return `${p.x},${p.y}`;
}

function crearEstado(nivel: number) {
  const mapa = niveles[nivel].mapa;
  const inicio = buscar(mapa, "S");

  return {
    posicion: inicio,
    energia: false,
    estrellas: new Set<string>(),
    visitados: new Set<string>([clave(inicio)]),
    pasos: 0,
  };
}

type Estado = ReturnType<typeof crearEstado>;

function Celda({
  tipo,
  chispa,
  visitada,
  energia,
  estrellaRecogida,
}: {
  tipo: string;
  chispa: boolean;
  visitada: boolean;
  energia: boolean;
  estrellaRecogida: boolean;
}) {
  const pared = tipo === "#";
  const puerta = tipo === "D";
  const energiaDisponible = tipo === "E" && !energia;
  const estrellaDisponible = tipo === "*" && !estrellaRecogida;

  return (
    <div
      className={`relative flex aspect-square items-center justify-center overflow-hidden rounded-[5px] transition-colors duration-200 ${
        pared
          ? "bg-[#B7A3D8]"
          : visitada
          ? "bg-white"
          : "bg-[#F0EAF9]"
      }`}
    >
      {pared ? (
        <svg viewBox="0 0 40 40" className="h-full w-full">
          <path
            d="M0 20 Q10 7 20 20 T40 20"
            stroke="#D8C8ED"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="20" cy="20" r="5" fill="#947CC0" />
        </svg>
      ) : (
        <>
          {visitada && (
            <div className="h-2 w-2 rounded-full bg-[#E8DDF5]" />
          )}

          {puerta && (
            <div
              className={`absolute inset-[15%] flex items-center justify-center rounded-lg ${
                energia
                  ? "bg-[#D7F0D5]"
                  : "bg-[#E9B7CD]"
              }`}
            >
              <span className="text-[clamp(9px,2vw,23px)]">
                {energia ? "✦" : "🔒"}
              </span>
            </div>
          )}

          {energiaDisponible && (
            <span className="absolute animate-pulse text-[clamp(12px,2.5vw,27px)]">
              ⚡
            </span>
          )}

          {estrellaDisponible && (
            <span className="absolute text-[clamp(12px,2.5vw,27px)]">
              ⭐
            </span>
          )}

          {tipo === "G" && (
            <div className="absolute inset-[12%] flex items-center justify-center rounded-full border-4 border-[#C87899] bg-[#FCE8EF]">
              <span className="text-[clamp(11px,2vw,24px)]">
                ✨
              </span>
            </div>
          )}

          {chispa && (
            <div className="absolute z-10 flex h-[75%] w-[75%] items-center justify-center rounded-full border-2 border-white bg-[#FFE18A] shadow-[0_0_18px_#F5C65A] transition-all duration-150">
              <svg viewBox="0 0 50 50" className="h-full w-full">
                <path
                  d="M28 5 L13 27 H25 L20 45 L39 20 H27 Z"
                  fill="#E9A63B"
                />
                <circle cx="21" cy="22" r="2" fill="#66549B" />
                <circle cx="30" cy="22" r="2" fill="#66549B" />
                <path
                  d="M22 29 Q26 33 30 29"
                  stroke="#66549B"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function NeuroAdventure() {
  const [fase, setFase] = useState<Fase>("inicio");
  const [nivel, setNivel] = useState(0);
  const [estado, setEstado] = useState<Estado>(() => crearEstado(0));
  const [mensaje, setMensaje] = useState("");
  const [estrellasTotales, setEstrellasTotales] = useState(0);

  const estadoRef = useRef(estado);
  const faseRef = useRef(fase);
  const nivelRef = useRef(nivel);

  useEffect(() => {
    estadoRef.current = estado;
    faseRef.current = fase;
    nivelRef.current = nivel;
  }, [estado, fase, nivel]);

  const mover = useCallback((direccion: Direccion) => {
    if (faseRef.current !== "jugando") return;

    const actual = estadoRef.current;
    const mapa = niveles[nivelRef.current].mapa;
    const delta = movimientos[direccion];

    const nueva = {
      x: actual.posicion.x + delta.x,
      y: actual.posicion.y + delta.y,
    };

    const celda = mapa[nueva.y]?.[nueva.x];

    if (!celda || celda === "#") return;

    if (celda === "D" && !actual.energia) {
      setMensaje(
        "¡La sinapsis está cerrada! Busca la energía primero."
      );
      return;
    }

    const nuevasEstrellas = new Set(actual.estrellas);
    const nuevosVisitados = new Set(actual.visitados);

    nuevosVisitados.add(clave(nueva));

    const tieneEnergia = actual.energia || celda === "E";

    if (celda === "*") {
      nuevasEstrellas.add(clave(nueva));
    }

    const siguiente: Estado = {
      posicion: nueva,
      energia: tieneEnergia,
      estrellas: nuevasEstrellas,
      visitados: nuevosVisitados,
      pasos: actual.pasos + 1,
    };

    estadoRef.current = siguiente;
    setEstado(siguiente);

    if (celda === "E" && !actual.energia) {
      setMensaje("¡Conseguiste energía! Ahora puedes abrir la sinapsis.");
    } else if (celda === "*" && !actual.estrellas.has(clave(nueva))) {
      setMensaje("¡Encontraste una estrella de descubrimiento!");
    } else if (celda === "D") {
      setMensaje("¡Sinapsis activada! Sigue explorando.");
    } else {
      setMensaje("");
    }

    if (celda === "G") {
      faseRef.current = "completado";
      setFase("completado");
      setMensaje("¡La señal llegó a su destino!");
    }
  }, []);

  useEffect(() => {
    function teclado(evento: KeyboardEvent) {
      const teclas: Record<string, Direccion> = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
        w: "up",
        s: "down",
        a: "left",
        d: "right",
      };

      const direccion = teclas[evento.key];

      if (direccion && faseRef.current === "jugando") {
        evento.preventDefault();
        mover(direccion);
      }
    }

    window.addEventListener("keydown", teclado);

    return () => {
      window.removeEventListener("keydown", teclado);
    };
  }, [mover]);

  function comenzar() {
    const nuevo = crearEstado(0);

    estadoRef.current = nuevo;
    faseRef.current = "jugando";
    nivelRef.current = 0;

    setNivel(0);
    setEstado(nuevo);
    setEstrellasTotales(0);
    setMensaje("");
    setFase("jugando");
  }

  function siguienteNivel() {
    const acumuladas =
      estrellasTotales + estado.estrellas.size;

    setEstrellasTotales(acumuladas);

    if (nivel === niveles.length - 1) {
      faseRef.current = "final";
      setFase("final");
      return;
    }

    const siguiente = nivel + 1;
    const nuevo = crearEstado(siguiente);

    estadoRef.current = nuevo;
    faseRef.current = "jugando";
    nivelRef.current = siguiente;

    setNivel(siguiente);
    setEstado(nuevo);
    setMensaje("");
    setFase("jugando");
  }

  function reiniciarNivel() {
    const nuevo = crearEstado(nivel);

    estadoRef.current = nuevo;
    faseRef.current = "jugando";

    setEstado(nuevo);
    setMensaje("");
    setFase("jugando");
  }

  const mapa = niveles[nivel].mapa;
  const actual = niveles[nivel];

  return (
    <GameLayout
      titulo="Neuroaventura"
      tituloIngles="Neuro Adventure"
      descripcion="¡Ayuda a Chispa a viajar por una red neuronal!"
    >
      {fase === "inicio" ? (
        <div className="py-10 text-center">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[#FFF0D9] shadow-lg">
            <span className="text-7xl">⚡</span>
          </div>

          <h2 className="mt-7 font-['Fredoka'] text-3xl text-[#66549B]">
            ¡Conoce a Chispa!
          </h2>

          <p
            lang="en"
            className="mt-2 font-['Fredoka'] text-xl text-[#C87899]"
          >
            Meet Spark!
          </p>

          <p className="mx-auto mt-6 max-w-xl font-['Nunito'] text-lg leading-relaxed text-[#635B70]">
            Chispa es una pequeña señal que necesita
            viajar por una red de neuronas.
            ¡Ayúdala a encontrar el camino!
          </p>

          <div className="mx-auto mt-8 max-w-lg rounded-[28px] bg-[#F1E8FF] p-7 text-left">
            <h3 className="font-['Fredoka'] text-xl text-[#66549B]">
              ¿Cómo jugar?
            </h3>

            <p className="mt-3 font-['Nunito'] text-[#635B70]">
              Usa las flechas del teclado o los botones
              de la pantalla para mover a Chispa.
            </p>

            <p className="mt-3 font-['Nunito'] text-[#635B70]">
              Recoge energía, activa las sinapsis
              y encuentra la neurona destino.
            </p>

            <p
              lang="en"
              className="mt-4 font-['Nunito'] text-sm text-[#C87899]"
            >
              Move Spark, collect energy, unlock synapses
              and reach the destination!
            </p>
          </div>

          <button
            onClick={comenzar}
            className="mt-9 rounded-full bg-[#B8A0E6] px-10 py-4 font-['Fredoka'] text-xl text-white shadow-md transition-transform hover:scale-105"
          >
            ¡COMENZAR AVENTURA!
          </button>
        </div>
      ) : fase === "final" ? (
        <div className="py-12 text-center">
          <div className="text-7xl">🌟</div>

          <h2 className="mt-6 font-['Fredoka'] text-4xl text-[#66549B]">
            ¡Neuroaventura completada!
          </h2>

          <p
            lang="en"
            className="mt-3 font-['Fredoka'] text-xl text-[#C87899]"
          >
            Neuro Adventure Complete!
          </p>

          <p className="mx-auto mt-6 max-w-xl font-['Nunito'] text-lg text-[#635B70]">
            ¡Ayudaste a Chispa a recorrer
            los tres niveles de la red neuronal!
          </p>

          <div className="mx-auto mt-8 max-w-sm rounded-[28px] bg-[#FFF0D9] p-7">
            <p className="font-['Fredoka'] text-xl text-[#66549B]">
              Estrellas descubiertas
            </p>

            <p className="mt-3 font-['Fredoka'] text-4xl text-[#66549B]">
              {estrellasTotales} / 3
            </p>
          </div>

          <p className="mx-auto mt-7 max-w-lg font-['Nunito'] text-[#635B70]">
            En nuestro cerebro, las neuronas se comunican
            mediante señales eléctricas y químicas.
            Chispa representa una de esas señales.
          </p>

          <button
            onClick={comenzar}
            className="mt-9 rounded-full bg-[#B8A0E6] px-10 py-4 font-['Fredoka'] text-xl text-white shadow-md"
          >
            ¡JUGAR OTRA VEZ!
          </button>
        </div>
      ) : (
        <div className="text-center">

          {/* INFORMACIÓN DEL NIVEL */}
          <p className="font-['Nunito'] text-[#635B70]">
            Nivel {nivel + 1} de {niveles.length}
          </p>

          <h2 className="mt-3 font-['Fredoka'] text-3xl text-[#66549B]">
            {actual.nombre}
          </h2>

          <p
            lang="en"
            className="mt-2 font-['Fredoka'] text-lg text-[#C87899]"
          >
            {actual.ingles}
          </p>

          <p className="mt-4 font-['Nunito'] text-[#635B70]">
            {actual.descripcion}
          </p>

          {/* INDICADORES */}
          <div className="mx-auto mt-7 flex max-w-lg flex-wrap justify-center gap-3">
            <div className="rounded-full bg-[#FFF0D9] px-5 py-3 font-['Fredoka'] text-[#66549B]">
              ⚡ {estado.energia ? "Energía lista" : "Sin energía"}
            </div>

            <div className="rounded-full bg-[#FCE8EF] px-5 py-3 font-['Fredoka'] text-[#66549B]">
              ⭐ {estado.estrellas.size} / 1
            </div>

            <div className="rounded-full bg-[#E8F2E5] px-5 py-3 font-['Fredoka'] text-[#66549B]">
              {estado.pasos} pasos
            </div>
          </div>

          {/* MAPA */}
          <div className="mx-auto mt-8 w-full max-w-[610px] rounded-[32px] bg-[#E8DFF3] p-3 shadow-sm sm:p-6">
            <div
              className="grid gap-[3px]"
              style={{
                gridTemplateColumns: `repeat(${mapa[0].length}, minmax(0, 1fr))`,
              }}
              role="img"
              aria-label="Laberinto neuronal de Chispa"
            >
              {mapa.flatMap((fila, y) =>
                fila.split("").map((tipo, x) => (
                  <Celda
                    key={`${x}-${y}`}
                    tipo={tipo}
                    chispa={
                      estado.posicion.x === x &&
                      estado.posicion.y === y
                    }
                    visitada={estado.visitados.has(`${x},${y}`)}
                    energia={estado.energia}
                    estrellaRecogida={estado.estrellas.has(`${x},${y}`)}
                  />
                ))
              )}
            </div>
          </div>

          {/* MENSAJE */}
          <p
            aria-live="polite"
            className="mx-auto mt-6 min-h-8 max-w-lg font-['Fredoka'] text-lg text-[#66549B]"
          >
            {mensaje}
          </p>

          {fase === "jugando" ? (
            <>
              {/* CONTROLES */}
              <div className="mx-auto mt-5 flex w-fit flex-col items-center gap-2">
                <button
                  type="button"
                  aria-label="Mover arriba"
                  onClick={() => mover("up")}
                  className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B8A0E6] text-2xl text-white shadow-sm active:scale-95"
                >
                  ↑
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    aria-label="Mover izquierda"
                    onClick={() => mover("left")}
                    className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B8A0E6] text-2xl text-white shadow-sm active:scale-95"
                  >
                    ←
                  </button>

                  <button
                    type="button"
                    aria-label="Mover abajo"
                    onClick={() => mover("down")}
                    className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B8A0E6] text-2xl text-white shadow-sm active:scale-95"
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    aria-label="Mover derecha"
                    onClick={() => mover("right")}
                    className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#B8A0E6] text-2xl text-white shadow-sm active:scale-95"
                  >
                    →
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={reiniciarNivel}
                className="mt-7 rounded-full bg-[#F1E8FF] px-7 py-3 font-['Fredoka'] text-[#66549B]"
              >
                Reiniciar nivel
              </button>
            </>
          ) : (
            /* NIVEL COMPLETADO */
            <div className="mx-auto mt-6 max-w-lg rounded-[30px] bg-[#E8F2E5] p-8">
              <div className="text-5xl">🌟</div>

              <h3 className="mt-4 font-['Fredoka'] text-3xl text-[#66549B]">
                ¡Conexión completada!
              </h3>

              <p
                lang="en"
                className="mt-2 font-['Nunito'] text-lg text-[#C87899]"
              >
                Connection complete!
              </p>

              <p className="mt-5 font-['Nunito'] text-[#635B70]">
                ¡Chispa encontró su destino!
                Las neuronas pueden comunicarse
                para transmitir información.
              </p>

              <button
                onClick={siguienteNivel}
                className="mt-7 rounded-full bg-[#B8A0E6] px-9 py-4 font-['Fredoka'] text-white"
              >
                {nivel === niveles.length - 1
                  ? "¡TERMINAR AVENTURA!"
                  : "¡SIGUIENTE NIVEL!"}
              </button>
            </div>
          )}
        </div>
      )}
    </GameLayout>
  );
}
