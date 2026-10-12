import { container, eyebrow, h2 } from './ui';

const SECTORS = [
  {
    name: 'Peluquerías, barberías y estética',
    whatsapp: '«¿Cuánto cuesta un tinte?», «¿Abrís el sábado?». Responde y toma el nombre de quien quiere cita.',
    voz: 'Si estás con las manos ocupadas, coge la llamada y te deja anotado quién quiere cita y para qué.',
  },
  {
    name: 'Clínicas y consultas',
    whatsapp: 'Informa de tratamientos, precios orientativos, horarios y cómo llegar.',
    voz: 'Atiende fuera de horario y recoge el motivo de la llamada para que recepción devuelva la llamada.',
  },
  {
    name: 'Talleres',
    whatsapp: 'Explica qué servicios hacéis y recoge matrícula, modelo y problema antes de dar cita.',
    voz: 'Toma los datos del coche y la avería cuando nadie puede dejar la herramienta.',
  },
  {
    name: 'Restaurantes',
    whatsapp: 'Horarios, carta, cómo llegar y peticiones de reserva para que las confirmes tú.',
    voz: 'Atiende las llamadas del servicio de comidas y apunta las peticiones de reserva.',
  },
];

export function Sectors() {
  return (
    <section aria-labelledby="sectores-titulo" className="bg-surface-low py-16 sm:py-24">
      <div className={container}>
        <p className={eyebrow}>Ejemplos de uso</p>
        <h2 id="sectores-titulo" className={`${h2} mt-2 max-w-2xl`}>
          Pensado para negocios que no pueden estar pegados al móvil
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {SECTORS.map((s) => (
            <article key={s.name} className="rounded-2xl border border-secondary/10 bg-white p-6">
              <h3 className="font-heading text-lg font-bold text-secondary">{s.name}</h3>
              <dl className="mt-4 space-y-3 text-[15px] leading-relaxed">
                <div>
                  <dt className="font-semibold text-secondary">Por WhatsApp</dt>
                  <dd className="text-secondary/75">{s.whatsapp}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-secondary">Por teléfono</dt>
                  <dd className="text-secondary/75">{s.voz}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
