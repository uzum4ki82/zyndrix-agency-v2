import { container, eyebrow, h2 } from './ui';

const STEPS = [
  {
    title: 'Nos cuentas tu negocio',
    text: 'Una llamada corta para saber qué te preguntan, qué servicios ofreces, tus precios y horarios.',
  },
  {
    title: 'Configuramos tu agente',
    text: 'Preparamos las respuestas con tu información y lo conectamos a tu WhatsApp o a tu teléfono.',
  },
  {
    title: 'Lo pruebas antes de activarlo',
    text: 'Le haces preguntas como si fueras un cliente y ajustamos lo que no te convenza.',
  },
  {
    title: 'Empieza a atender',
    text: 'Responde lo habitual y te avisa de las solicitudes y de lo que necesita tu respuesta.',
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" aria-labelledby="como-funciona-titulo" className="scroll-mt-20 py-16 sm:py-24">
      <div className={container}>
        <p className={eyebrow}>Cómo funciona</p>
        <h2 id="como-funciona-titulo" className={`${h2} mt-2 max-w-2xl`}>
          De la primera llamada a tu agente atendiendo, en cuatro pasos
        </h2>
        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="rounded-2xl border border-secondary/10 bg-white p-6">
              <span
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold text-white"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <h3 className="mt-4 font-heading text-lg font-bold text-secondary">{s.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-secondary/70">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
