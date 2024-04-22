import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.kp.termal',
  appName: 'tp-pos',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }, plugins: {
    BluetoothLe: {
      displayStrings: {
        scanning: "Buscando...",
        cancel: "Cancelar",
        availableDevices: "Dispositivos Disponibles",
        noDeviceFound: "No se encontraron dispositivos"
      }
    }
  }
};

export default config;
