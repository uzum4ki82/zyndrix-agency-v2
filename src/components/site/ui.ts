/** Clases compartidas para mantener botones y contenedores coherentes en toda la web. */
export const container = 'mx-auto w-full max-w-6xl px-4 sm:px-6';

const btnBase =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 text-[15px] font-semibold transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary';

export const btnPrimary = `${btnBase} bg-primary text-white hover:bg-[#0052cc]`;
export const btnSecondary = `${btnBase} border border-secondary/15 bg-white text-secondary hover:border-secondary/30 hover:bg-surface-low`;
export const btnGhost = `${btnBase} text-primary hover:bg-primary/5`;

export const eyebrow = 'text-sm font-semibold text-primary';
export const h2 = 'font-heading text-3xl font-bold tracking-tight text-secondary sm:text-4xl';
export const lead = 'text-lg leading-relaxed text-secondary/70';
