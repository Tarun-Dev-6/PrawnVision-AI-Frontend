import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.prawnvision.ai',
  appName: 'PrawnVisionAI',
  webDir: 'dist',
  bundledWebRuntime: false,

  server: {
    cleartext: true,
    allowNavigation: [
      '192.168.0.109',
      'http://192.168.0.109:8000',
      '192.168.0.109:8000'
    ]
  }
};

export default config;
