'use client';

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { track, type AnalyticsEvent } from '@/lib/analytics';

type Props = ComponentProps<typeof Link> & {
  event?: AnalyticsEvent;
  eventParams?: Record<string, string>;
};

export function TrackedLink({ event = 'cta_click', eventParams, onClick, ...rest }: Props) {
  return (
    <Link
      {...rest}
      onClick={(e) => {
        track(event, eventParams);
        onClick?.(e);
      }}
    />
  );
}
