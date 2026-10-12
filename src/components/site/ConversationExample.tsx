import { MessageCircle, PhoneCall } from 'lucide-react';

export interface Turn {
  from: 'cliente' | 'agente';
  text: string;
}

/**
 * Conversación ilustrativa. Se etiqueta siempre como ejemplo: no es una captura
 * de un cliente real ni de un producto en funcionamiento.
 */
export function ConversationExample({
  kind,
  title,
  turns,
  footnote,
}: {
  kind: 'whatsapp' | 'voz';
  title: string;
  turns: Turn[];
  footnote?: string;
}) {
  const Icon = kind === 'whatsapp' ? MessageCircle : PhoneCall;
  return (
    <figure className="rounded-2xl border border-secondary/10 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-6">
      <figcaption className="flex items-center justify-between gap-3 border-b border-secondary/10 pb-4">
        <span className="flex items-center gap-2 font-semibold text-secondary">
          <Icon size={18} className="text-primary" aria-hidden="true" />
          {title}
        </span>
        <span className="rounded-full bg-surface-mid px-2.5 py-1 text-xs font-medium text-secondary/70">
          Ejemplo
        </span>
      </figcaption>
      <ol className="mt-4 space-y-3" aria-label="Conversación de ejemplo">
        {turns.map((t, i) => (
          <li key={i} className={`flex ${t.from === 'cliente' ? 'justify-start' : 'justify-end'}`}>
            <p
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[15px] leading-relaxed ${
                t.from === 'cliente'
                  ? 'rounded-bl-sm bg-surface-mid text-secondary'
                  : 'rounded-br-sm bg-primary text-white'
              }`}
            >
              <span className="sr-only">{t.from === 'cliente' ? 'Cliente: ' : 'Agente: '}</span>
              {t.text}
            </p>
          </li>
        ))}
      </ol>
      {footnote && <p className="mt-4 text-sm text-secondary/60">{footnote}</p>}
    </figure>
  );
}
