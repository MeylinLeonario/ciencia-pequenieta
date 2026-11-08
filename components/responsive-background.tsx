export default function ResponsiveBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Fondo para celulares */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
        style={{
          backgroundImage: "url('/backgrounds/phone-background.png')",
        }}
      />

      {/* Fondo para tablets y computadores */}
      <div
        className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat md:block"
        style={{
          backgroundImage: "url('/backgrounds/computer-background.png')",
        }}
      />
    </div>
  );
}
