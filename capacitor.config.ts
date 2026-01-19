import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.prawnsight.ai',
  appName: 'PrawnSight AI',
  webDir: 'dist',
  bundledWebRuntime: false,

  server: {
    cleartext: true,
    allowNavigation: [
      'superelementary-inorganic-ninfa.ngrok-free.dev',
      '*.ngrok-free.dev',
    ],
  },
};

export default config;
