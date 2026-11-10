'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';

export default function BackButtonHandler() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const listenerPromise = App.addListener('backButton', () => {
      const segments = pathname.split('/').filter(Boolean);
      const isHome = segments.length <= 1; // locale 세그먼트만 있으면 홈

      if (isHome) {
        App.exitApp();
      } else {
        router.back();
      }
    });

    return () => {
      listenerPromise.then((listener) => listener.remove());
    };
  }, [pathname, router]);

  return null;
}