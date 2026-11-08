
"use client";

import { useEffect, useState } from "react";
import GameLayout from "@/components/game-layout";

const FILAS = 5;
const COLUMNAS = 8;
const TOTAL = FILAS * COLUMNAS;

type Direccion = 0 | 1 | 2 | 3;
type Tipo = "recta" | "curva" | "triple";

type Pieza = {
  id: number;
  tipo: Tipo;
  rotacion: number;
  solucion: number;
};

const DIRECCIONES = [
  [-1, 0], // Arriba
  [0, 1],  // Derecha
  [1, 0],  // Abajo
  [0, -1], // Izquierda
];

const PUERTOS: Record<Tipo, number[]> = {
  recta: [0, 2],
  curva: [0, 1],
  triple: [0, 1, 2],
};

function mezclar<T,>(array: T[]): T[] {
  const copia = [...array];

  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }

  return copia;
}

function puertos(pieza: Pieza): number[] {
  return PUERTOS[pieza.tipo].map(
    (direccion) => (direccion + pieza.rotacion) % 4
  );
}

function vecinos(id: number): number[] {
  const fila = Math.floor(id / COLUMNAS);
  const columna = id % COLUMNAS;

  return DIRECCIONES.flatMap(([df, dc]) => {
    const nuevaFila = fila + df;
    const nuevaColumna = columna + dc;

    if (
      nuevaFila < 0 ||
      nuevaFila >= FILAS ||
      nuevaColumna < 0 ||
      nuevaColumna >= COLUMNAS
    ) {
      return [];
    }

    return [nuevaFila * COLUMNAS + nuevaColumna];
  });
}

function direccionEntre(a: number, b: number): Direccion {
  if (b === a - COLUMNAS) return 0;
  if (b === a + 1) return 1;
  if (b === a + COLUMNAS) return 2;
  return 3;
}

function crearCamino(): number[] {
  const inicio = 0;
  const destino = TOTAL - 1;

  // Camino aleatorio sin repetir casillas.
  for (let intento = 0; intento < 100; intento++) {
    const camino = [inicio];
    const visitados = new Set([inicio]);

    function explorar(actual: number): boolean {
      if (actual === destino) {
        return camino.length >= 12;
      }

      const opciones = mezclar(vecinos(actual)).filter(
        (id) => !visitados.has(id)
      );

      for (const siguiente of opciones) {
        visitados.add(siguiente);
        camino.push(siguiente);

        if (explorar(siguiente)) return true;

        camino.pop();
        visitados.delete(siguiente);
      }

      return false;
    }

    if (explorar(inicio)) return camino;
  }

  // Camino de respaldo.
  return [
    0, 1, 2, 3, 4, 5, 6, 7,
    15, 23, 31, 39,
  ];
}

function crearPartida() {
  const camino = crearCamino();
  const conjunto = new Set(camino);

  const piezas: Pieza[] = Array.from(
    { length: TOTAL },
    (_, id) => {
      const posicion = camino.indexOf(id);

      if (!conjunto.has(id)) {
        const tipos: Tipo[] = ["recta", "curva", "triple"];
        const tipo = tipos[Math.floor(Math.random() * tipos.length)];

        return {
          id,
          tipo,
          rotacion: Math.floor(Math.random() * 4),
          solucion: 0,
        };
      }

      const anterior = camino[posicion - 1];
      const siguiente = camino[posicion + 1];

      const entrada =
        anterior === undefined
          ? 3
          : direccionEntre(id, anterior);

      const salida =
        siguiente === undefined
          ? 1
          : direccionEntre(id, siguiente);

      const necesarias = [entrada, salida];

      const tipo: Tipo =
        (entrada + 2) % 4 === salida
          ? "recta"
          : "curva";

      let solucion = 0;

      for (let r = 0; r < 4; r++) {
        const disponibles = PUERTOS[tipo].map(
          (p) => (p + r) % 4
        );

        if (
          necesarias.every((d) => disponibles.includes(d))
        ) {
          solucion = r;
          break;
        }
      }

      return {
        id,
        tipo,
        rotacion: (solucion + 1 + Math.floor(Math.random() * 3)) % 4,
        solucion,
      };
    }
  );

  return { piezas, camino };
}

function encontrarRuta(piezas: Pieza[]): number[] {
  const inicio = 0;
  const destino = TOTAL - 1;

  const visitados = new Set<number>();
  const cola: number[][] = [[inicio]];

  while (cola.length > 0) {
    const ruta = cola.shift()!;
    const actual = ruta[ruta.length - 1];

    if (visitados.has(actual)) continue;
    visitados.add(actual);

    const pieza = piezas[actual];
    const conexiones = puertos(pieza);

    if (actual === inicio && !conexiones.includes(3)) {
      continue;
    }

    if (actual === destino && conexiones.includes(1)) {
      return ruta;
    }

    for (const direccion of conexiones) {
      const [df, dc] = DIRECCIONES[direccion];

      const fila = Math.floor(actual / COLUMNAS) + df;
      const columna = (actual % COLUMNAS) + dc;

      if (
        fila < 0 ||
        fila >= FILAS ||
        columna < 0 ||
        columna >= COLUMNAS
      ) {
        continue;
      }

      const vecino = fila * COLUMNAS + columna;
      const opuesta = (direccion + 2) % 4;

      if (
        !visitados.has(vecino) &&
        puertos(piezas[vecino]).includes(opuesta)
      ) {
        cola.push([...ruta, vecino]);
      }
    }
  }

  return [];
}

function Dendrita({
  pieza,
  activa,
}: {
  pieza: Pieza;
  activa: boolean;
}) {
  const conexiones = puertos(pieza);

  return (
    <svg
      viewBox="0 0 100 100"
      className="h-full w-full"
      aria-hidden="true"
    >
      {conexiones.map((direccion) => {
        const puntos = [
          [50, 0],
          [100, 50],
          [50, 100],
          [0, 50],
        ];

        const [x, y] = puntos[direccion];

        return (
          <g key={direccion}>
            <path
              d={`M 50 50 Q ${(50 + x) / 2 + (direccion % 2 ? 0 : 5)} ${(50 + y) / 2 + (direccion % 2 ? 5 : 0)} ${x} ${y}`}
              fill="none"
              stroke={activa ? "#E6B64E" : "#9D86CA"}
              strokeWidth="19"
              strokeLinecap="round"
            />

            <path
              d={`M 50 50 L ${x} ${y}`}
              fill="none"
              stroke={activa ? "#FFF0A6" : "#DCCCF2"}
              strokeWidth="10"
              strokeLinecap="round"
            />
          </g>
        );
      })}

      <circle
        cx="50"
        cy="50"
        r="21"
        fill={activa ? "#FFE49A" : "#F7C9D9"}
        stroke="#9D86CA"
        strokeWidth="3"
      />

      <circle
        cx="50"
        cy="50"
        r="9"
        fill={activa ? "#E6B64E" : "#C87899"}
      />
    </svg>
  );
}

export default function SpeedyMessages() {
  const [partida, setPartida] = useState<ReturnType<
    typeof crearPartida
  > | null>(null);

  const [rutaActiva, setRutaActiva] = useState<number[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [completado, setCompletado] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [pista, setPista] = useState<number | null>(null);
  const [mostrarAyuda, setMostrarAyuda] = useState(false);

  function comenzar() {
    setPartida(crearPartida());
    setRutaActiva([]);
    setEnviando(false);
    setCompletado(false);
    setMensaje("");
    setPista(null);
    setMostrarAyuda(false);
  }

  function girar(id: number) {
    if (!partida || enviando || completado) return;

    setPartida((actual) => {
      if (!actual) return actual;

      return {
        ...actual,
        piezas: actual.piezas.map((pieza) =>
          pieza.id === id
            ? {
                ...pieza,
                rotacion: (pieza.rotacion + 1) % 4,
              }
            : pieza
        ),
      };
    });

    setRutaActiva([]);
    setPista(null);
    setMensaje("");
  }

  function enviar() {
    if (!partida || enviando) return;

    const ruta = encontrarRuta(partida.piezas);

    if (ruta.length === 0) {
      setMensaje(
        "¡El mensaje todavía no puede pasar! Gira algunas dendritas."
      );
      setRutaActiva([]);
      return;
    }

    setMensaje("¡El impulso está viajando!");
    setEnviando(true);
    setRutaActiva([]);

    // La ruta se anima progresivamente.
    let indice = 0;

    const intervalo = window.setInterval(() => {
      indice++;

      setRutaActiva(ruta.slice(0, indice));

      if (indice >= ruta.length) {
        window.clearInterval(intervalo);
        setEnviando(false);
        setCompletado(true);
        setMensaje("¡Mensaje recibido! ¡Lo lograste!");
      }
    }, 180);
  }

  function mostrarPista() {
    if (!partida) return;

    const incorrecta = partida.camino.find((id) => {
      const pieza = partida.piezas[id];

      return (
        pieza.rotacion !== pieza.solucion &&
        !(
          pieza.tipo === "recta" &&
          (pieza.rotacion + 2) % 4 === pieza.solucion
        )
      );
    });

    if (incorrecta !== undefined) {
      setPista(incorrecta);
      setMensaje("¡Prueba girando la pieza iluminada!");
    } else {
      setPista(null);
      setMensaje("¡El camino principal está listo! Intenta enviar.");
    }
  }

  useEffect(() => {
    return () => {
      // No hay recursos externos que limpiar aquí.
    };
  }, []);

  return (
    <GameLayout
      titulo="Mensajes veloces"
      tituloIngles="Speedy Messages"
      descripcion="¡Conecta las neuronas y ayuda al impulso nervioso a llegar!"
    >
      {!partida ? (
        /* INICIO */
        <div className="py-10 text-center">
          <h2 className="font-['Fredoka'] text-3xl text-[#66549B]">
            ¡Un mensaje necesita viajar!
          </h2>

          <p className="mx-auto mt-5 max-w-xl font-['Nunito'] text-lg leading-relaxed text-[#635B70]">
            Las neuronas se comunican mediante señales.
            ¡Ayúdalas a conectar un camino!
          </p>

          <div className="mx-auto mt-8 grid max-w-sm grid-cols-3 gap-3">
            {(["recta", "curva", "triple"] as Tipo[]).map(
              (tipo) => (
                <div
                  key={tipo}
                  className="aspect-square rounded-[22px] bg-[#F1E8FF] p-3"
                >
                  <Dendrita
                    pieza={{
                      id: 0,
                      tipo,
                      rotacion: 0,
                      solucion: 0,
                    }}
                    activa={false}
                  />
                </div>
              )
            )}
          </div>

          <p className="mx-auto mt-7 max-w-lg font-['Nunito'] text-[#635B70]">
            Toca las piezas para girarlas. Cuando hayas
            conectado el camino, ¡envía tu mensaje!
          </p>

          <button
            type="button"
            onClick={comenzar}
            className="mt-9 rounded-full bg-[#B8A0E6] px-10 py-4 font-['Fredoka'] text-xl text-white shadow-md transition-transform hover:scale-105"
          >
            ¡COMENZAR!
          </button>
        </div>
      ) : (
        <div className="text-center">

          {/* CONTROLES */}
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={mostrarPista}
              disabled={enviando || completado}
              className="rounded-full bg-[#FCE8EF] px-6 py-3 font-['Fredoka'] text-[#66549B] disabled:opacity-50"
            >
              ¡Una pista!
            </button>

            <button
              type="button"
              onClick={() => setMostrarAyuda(true)}
              className="rounded-full bg-[#F1E8FF] px-6 py-3 font-['Fredoka'] text-[#66549B]"
            >
              ¿Cómo jugar?
            </button>

            <button
              type="button"
              onClick={comenzar}
              className="rounded-full bg-[#E8F2E5] px-6 py-3 font-['Fredoka'] text-[#66549B]"
            >
              Reiniciar
            </button>
          </div>

          {/* TABLERO */}
          <div className="mx-auto mt-9 max-w-5xl rounded-[30px] bg-[#F8F3FF] p-3 sm:p-6">
            <div className="mb-4 flex items-center justify-between font-['Fredoka'] text-[#66549B]">
              <span>Inicio</span>
              <span>Destino</span>
            </div>

            <div
              className="grid grid-cols-8 gap-1 sm:gap-2"
              role="group"
              aria-label="Tablero de 40 conexiones neuronales"
            >
              {partida.piezas.map((pieza) => {
                const activa = rutaActiva.includes(pieza.id);
                const iluminada = pista === pieza.id;

                return (
                  <button
                    key={pieza.id}
                    type="button"
                    onClick={() => girar(pieza.id)}
                    disabled={enviando || completado}
                    aria-label={`Girar conexión ${pieza.id + 1}`}
                    className={`relative aspect-square min-w-0 rounded-lg border-2 p-0.5 transition-all sm:rounded-xl sm:p-1 ${
                      iluminada
                        ? "border-[#E6B64E] bg-[#FFF0C9] shadow-lg"
                        : activa
                        ? "border-[#E6B64E] bg-[#FFF4D8]"
                        : "border-white bg-[#F1E8FF] hover:bg-[#E9DDF9]"
                    }`}
                  >
                    <Dendrita pieza={pieza} activa={activa} />

                    {pieza.id === 0 && (
                      <span className="absolute -left-1 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[#F7D66B] ring-2 ring-white" />
                    )}

                    {pieza.id === TOTAL - 1 && (
                      <span className="absolute -right-1 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-[#C87899] ring-2 ring-white" />
                    )}
                  </button>
                );
              })}
            </div>

            <p className="mt-5 font-['Nunito'] text-sm text-[#635B70]">
              Toca cada conexión para girarla 90°.
              Une el inicio con el destino.
            </p>
          </div>

          {/* ENVIAR */}
          <p
            aria-live="polite"
            className="mt-7 min-h-8 font-['Fredoka'] text-xl text-[#66549B]"
          >
            {mensaje}
          </p>

          {!completado ? (
            <button
              type="button"
              onClick={enviar}
              disabled={enviando}
              className="mt-5 rounded-full bg-[#B8A0E6] px-10 py-4 font-['Fredoka'] text-xl text-white shadow-md transition-transform hover:scale-105 disabled:opacity-60"
            >
              {enviando
                ? "¡ENVIANDO!"
                : "¡ENVIAR MENSAJE!"}
            </button>
          ) : (
            <div className="mx-auto mt-7 max-w-xl rounded-[30px] bg-[#E8F2E5] p-8">
              <h2 className="font-['Fredoka'] text-3xl text-[#66549B]">
                ¡Mensaje recibido!
              </h2>

              <p
                lang="en"
                className="mt-2 font-['Fredoka'] text-xl text-[#C87899]"
              >
                Message received!
              </p>

              <p className="mt-5 font-['Nunito'] text-lg text-[#635B70]">
                ¡Conectaste el camino y ayudaste
                a las neuronas a comunicarse!
              </p>

              <button
                type="button"
                onClick={comenzar}
                className="mt-7 rounded-full bg-[#B8A0E6] px-8 py-4 font-['Fredoka'] text-white"
              >
                ¡JUGAR OTRA VEZ!
              </button>
            </div>
          )}
        </div>
      )}

      {/* AYUDA */}
      {mostrarAyuda && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Cómo jugar"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-5"
        >
          <div className="w-full max-w-lg rounded-[32px] bg-white p-8 text-center shadow-xl">
            <h3 className="font-['Fredoka'] text-3xl text-[#66549B]">
              ¿Cómo jugar?
            </h3>

            <p className="mt-5 font-['Nunito'] text-lg leading-relaxed text-[#635B70]">
              Toca una dendrita para girarla.
              Cada pieza gira un cuarto de vuelta.
            </p>

            <p className="mt-4 font-['Nunito'] text-lg leading-relaxed text-[#635B70]">
              Une las conexiones desde la esquina
              superior izquierda hasta la esquina
              inferior derecha.
            </p>

            <p
              lang="en"
              className="mt-5 font-['Nunito'] text-base text-[#C87899]"
            >
              Rotate the pieces and connect the neural pathway!
            </p>

            <button
              type="button"
              onClick={() => setMostrarAyuda(false)}
              className="mt-7 rounded-full bg-[#B8A0E6] px-8 py-3 font-['Fredoka'] text-white"
            >
              ¡ENTENDIDO!
            </button>
          </div>
        </div>
      )}
    </GameLayout>
  );
}
