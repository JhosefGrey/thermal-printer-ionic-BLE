import { Component, ViewChild } from '@angular/core';
import { BleClient, BluetoothLe, ScanResult } from '@capacitor-community/bluetooth-le';
import { BluetoothService } from './services/bluetooth.service';
import { IonModal, ToastController } from '@ionic/angular';
import { OverlayEventDetail } from '@ionic/core/components';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild(IonModal) modal!: IonModal;
  constructor(private _bl: BluetoothService, private toastrService: ToastController) {}

  device: string = '';
  data: any = {};
  serviceUuid: string = '';
  characteristicUuid: string = '';

  devices: ScanResult[] = [];
  openModal: boolean = false;

  close() {
    this.openModal = false;
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
    this.close();
  }

  async setDevice(dv: string) {
    this.device = dv;
    await this._bl.Connect(dv);

    let services =  await BleClient.getServices(dv);

    services.forEach((x) =>{
      x.characteristics.forEach((y)=>{
        if(y.properties.write){
          this.serviceUuid = x.uuid;
          this.characteristicUuid = y.uuid;
          return;
        }
      })
    });

   await this.imprimir();

  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      this.device = ev.detail.data!;
    }
  }

  verificarDispositivo() {
    this._bl.scan().then((res) => {
      this.devices = res;
      this.openModal = true;
    })
  }


  async imprimir() {
    try {
      await this._bl.Connect(this.device);
  
      await this._bl.TurnOnBold(this.device, this.serviceUuid, this.characteristicUuid);
      await this._bl.FeedCenter(this.device, this.serviceUuid, this.characteristicUuid);
  
      await this._bl.WriteData(this.device, this.serviceUuid, this.characteristicUuid, "Kelpie");
      await this._bl.UnderLine(this.device, this.serviceUuid, this.characteristicUuid);
      await this._bl.TurnOffBold(this.device, this.serviceUuid, this.characteristicUuid);
  
      const currentDate = formatDate(new Date(), "dd/MM/yyyy hh:mm a", "en-US");
      await this._bl.WriteData(this.device, this.serviceUuid, this.characteristicUuid, currentDate);
  
      await this._bl.FeedLeft(this.device, this.serviceUuid, this.characteristicUuid);
  
      await this._bl.WriteData(this.device, this.serviceUuid, this.characteristicUuid, `Cliente: Jhosef`);
      await this._bl.WriteData(this.device, this.serviceUuid, this.characteristicUuid, `Articulo: Teléfono`);
      await this._bl.WriteData(this.device, this.serviceUuid, this.characteristicUuid, `CANT: 1`);
      await this.writePriceData(); // Call a separate function to handle price
  
      await this._bl.NewEmptyLine(this.device, this.serviceUuid, this.characteristicUuid);
  
      await this._bl.FeedCenter(this.device, this.serviceUuid, this.characteristicUuid);
      await this._bl.NewEmptyLine(this.device, this.serviceUuid, this.characteristicUuid);
      await this._bl.WriteData(this.device, this.serviceUuid, this.characteristicUuid, "---Muchas Gracias---");
      await this._bl.FeedLeft(this.device, this.serviceUuid, this.characteristicUuid);
  
      await this._bl.NewEmptyLine(this.device, this.serviceUuid, this.characteristicUuid);
  
      await this._bl.Disconnect(this.device);
    } catch (error) {
      console.error("Error printing receipt:", error);
    }
  }

  async writePriceData() {
    await this._bl.WriteData(this.device, this.serviceUuid, this.characteristicUuid, `Precio: Q.2499.99   Total: Q.2499.99`);
  }

}
