import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.volunteeractivitycoordinatingsystem.app',
  appName: 'Volunteer activity coordinating system',
  webDir: 'build',
  server: {
    androidScheme: 'https',
    "url": "http://192.168.43.244:8100",
  }
};

export default config;
