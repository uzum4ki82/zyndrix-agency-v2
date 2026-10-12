import { container, eyebrow, h2 } from './ui';

const ROWS: { label: string; whatsapp: string; voz: string }[] = [
  { label: 'Canal', whatsapp: 'Mensajes de WhatsApp', voz: 'Llamadas de teléfono' },
  {
    label: 'Cómo atiende',
    whatsapp: 'Por escrito. El cliente lee la respuesta cuando quiere.',
    voz: 'Hablando, en tiempo real, con voz natural.',
  },
  {
    label: 'Encaja si…',
    whatsapp: 'Te escriben mucho para preguntar precios, horarios o disponibilidad.',
    voz: 'Pierdes llamadas porque estás con un cliente o fuera de horario.',
  },
  {
    label: 'Qué necesitas',
    whatsapp: 'Un número de WhatsApp para el negocio.',
    voz: 'Un número de teléfono o poder desviar el tuyo.',
  },
  {
    label: 'Costes variables',
    whatsapp: 'Según volumen de conversaciones. Te indicamos el incluido antes de empezar.',
    voz: 'Telefonía y minutos de voz. Te indicamos los minutos incluidos antes de empezar.',
  },
  { label: 'Precio', whatsapp: '50 €/mes', voz: '75 €/mes' },
  {
    label: 'Límites',
    whatsapp: 'Responde con lo que le has contado. No cierra ventas ni cobra.',
    voz: 'No transfiere llamadas en la versión base. No hace llamadas salientes.',
  },
];

export function Comparison() {
  return (
    <section aria-labelledby="comparativa-titulo" className="bg-surface-low py-16 sm:py-24">
      <div className={container}>
        <p className={eyebrow}>Comparativa</p>
        <h2 id="comparativa-titulo" className={`${h2} mt-2 max-w-2xl`}>
          ¿WhatsApp o voz? Depende de cómo te contactan
        </h2>

        {/* Tabla en escritorio */}
        <div className="mt-10 hidden overflow-hidden rounded-2xl border border-secondary/10 bg-white md:block">
          <table className="w-full text-left text-[15px]">
            <caption className="sr-only">Comparativa entre el agente de WhatsApp y el agente de voz</caption>
            <thead className="bg-white">
              <tr className="border-b border-secondary/10">
                <th scope="col" className="w-48 p-5 font-semibold text-secondary/60">
                  <span className="sr-only">Característica</span>
                </th>
                <th scope="col" className="p-5 font-heading text-lg font-bold text-secondary">Agente de WhatsApp</th>
                <th scope="col" className="p-5 font-heading text-lg font-bold text-secondary">Agente de voz</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.label} className="border-b border-secondary/5 last:border-0">
                  <th scope="row" className="p-5 align-top font-semibold text-secondary">{r.label}</th>
                  <td className="p-5 align-top text-secondary/75">{r.whatsapp}</td>
                  <td className="p-5 align-top text-secondary/75">{r.voz}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bloques apilados en móvil */}
        <div className="mt-8 space-y-4 md:hidden">
          {(['whatsapp', 'voz'] as const).map((k) => (
            <div key={k} className="rounded-2xl border border-secondary/10 bg-white p-5">
              <h3 className="font-heading text-lg font-bold text-secondary">
                {k === 'whatsapp' ? 'Agente de WhatsApp' : 'Agente de voz'}
              </h3>
              <dl className="mt-3 space-y-3 text-[15px]">
                {ROWS.map((r) => (
                  <div key={r.label}>
                    <dt className="font-semibold text-secondary">{r.label}</dt>
                    <dd className="text-secondary/75">{r[k]}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
