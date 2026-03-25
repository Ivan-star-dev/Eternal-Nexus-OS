import { useEffect } from 'react';

/**
 * Sets document.title for a page.
 * Appends " — Eternal Nexus OS" if not already present.
 */
export function usePageTitle(title: string): void {
  useEffect(() => {
    const suffix = ' — Eternal Nexus OS';
    document.title = title.endsWith(suffix) ? title : `${title}${suffix}`;
    return () => {
      document.title = 'Eternal Nexus OS';
    };
  }, [title]);
}
