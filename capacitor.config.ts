import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ktourguide.app',
  appName: 'K-Tour Guide',
  webDir: 'public',
  server: {
    url: 'https://k-tour-guide.vercel.app',
    cleartext: true,
  },
};

export default config;