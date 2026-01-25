import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.prawnsight.ai',
  appName: 'PrawnSight AI',
  webDir: 'dist',

  server: {
    androidScheme: 'https',
    allowNavigation: [
      'https://superelementary-inorganic-ninfa.ngrok-free.dev',
      'https://*.ngrok-free.dev',
    ],
  },
};

export default config;
