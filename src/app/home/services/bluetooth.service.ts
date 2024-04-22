import { Injectable } from '@angular/core';
import { BleClient, ScanMode, ScanResult, textToDataView } from '@capacitor-community/bluetooth-le';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class BluetoothService {
  constructor(
    private toastrService: ToastController) { }

  async Initialize() {
    BleClient.initialize({ androidNeverForLocation: true });
  }

  async Connect(deviceId: string) {
    await BleClient.connect(deviceId);
  }

  async Disconnect(deviceId: string) {
    await BleClient.disconnect(deviceId);
    this.device = null;
  }

  async VerifyAndEnabled() {
    if (!await BleClient.isEnabled()) {
      await BleClient.enable();
    }
  }

  async getServicesIDS(device: string) {
    return await BleClient.getServices(device)
  }

  get device(): string | null {
    return localStorage.getItem('dv')
  }

  set device(deviceId: string | null) {
    deviceId !== null ? localStorage.setItem('dv', deviceId) : localStorage.removeItem('dv')
  }

  async scan() {
    this.VerifyAndEnabled();
    this.Initialize();

    const devices: ScanResult[] = [];
    await BleClient.requestLEScan({ allowDuplicates: false }, (result) => {
      if (result.localName) {
        devices.push(result);
      }
    });

    setTimeout(async () => {
      await BleClient.stopLEScan()
    }, 10000);

    return devices;
  }

  async LineFeed(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, new DataView((new Uint8Array([10])).buffer));
  }

  async TurnOnBold(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    const boldOn = new Uint8Array([27, 69, 1]);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, new DataView(boldOn.buffer));
  }

  async TurnOffBold(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    const boldOff = new Uint8Array([27, 69, 0]);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, new DataView(boldOff.buffer));
  }

  async FeedLeft(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    const left = new Uint8Array([27, 97, 0]);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, new DataView(left.buffer));
  }

  async FeedCenter(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    const center = new Uint8Array([27, 97, 1]);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, new DataView(center.buffer));
  }

  async FeedRight(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    const right = new Uint8Array([27, 97, 2]);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, new DataView(right.buffer));
  }

  async WriteData(deviceId: string, serviceUuid: string, characteristicUuid: string, text: string) {
    await this.LineFeed(deviceId, serviceUuid, characteristicUuid);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, textToDataView(text));
  }

  async UnderLine(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    await this.LineFeed(deviceId, serviceUuid, characteristicUuid);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, textToDataView('-'.repeat(30)));
  }

  async NewEmptyLine(deviceId: string, serviceUuid: string, characteristicUuid: string) {
    await this.LineFeed(deviceId, serviceUuid, characteristicUuid);
    await BleClient.write(deviceId, serviceUuid, characteristicUuid, textToDataView(`${' '.repeat(18)}\n`));
  }
}
