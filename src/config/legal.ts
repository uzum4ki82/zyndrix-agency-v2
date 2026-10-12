/**
 * Datos del titular de la web (LSSI art. 10 y RGPD art. 13).
 * PENDIENTE: completar con los datos reales antes de publicar en producción.
 * Mientras haya campos vacíos, las páginas legales muestran un aviso visible.
 */
export const LEGAL = {
  titular: '',
  nif: '',
  domicilio: '',
  email: '',
  registro: '',
};

export const legalPending = Object.entries(LEGAL)
  .filter(([k, v]) => k !== 'registro' && !v)
  .map(([k]) => k);
