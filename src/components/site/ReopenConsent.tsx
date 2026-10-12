'use client';

import { btnSecondary } from './ui';

export function ReopenConsent() {
  return (
    <button
      type="button"
      className={btnSecondary}
      onClick={() => {
        try {
          localStorage.removeItem('zyndrix-consent-v2');
        } catch {
          /* ignorar */
        }
        window.dispatchEvent(new Event('zyndrix:open-consent'));
      }}
    >
      Cambiar preferencias de cookies
    </button>
  );
}
