import { PlatformAccessory, Service, Characteristic } from 'homebridge';
import { TuyaDevice } from 'tuyapi';

export class TuyaSmartLockJTMSPro {
  private locked: boolean;
  private accessory: PlatformAccessory;
  private lockService: Service;
  private tuyaDevice: TuyaDevice;

  constructor(accessory: PlatformAccessory, deviceId: string, localKey: string) {
    this.locked = false;
    this.accessory = accessory;
    this.lockService = this.accessory.getService(Service.LockMechanism);
    this.tuyaDevice = new TuyaDevice({
      id: deviceId,
      key: localKey,
    });
    this.tuyaDevice.on('connected', () => {
      this.tuyaDevice.get({schema: true}).then((data: any) => {
        log.debug('Tuya Device Connected', data);
      });
    });
    this.tuyaDevice.connect();
    this.lockService.getCharacteristic(Characteristic.LockCurrentState)
      .on('get', this.getLockState.bind(this));
    this.lockService.getCharacteristic(Characteristic.LockTargetState)
      .on('get', this.getLockState.bind(this))
      .on('set', this.setLockState.bind(this));
  }

  getLockState(callback: (error: any, state: number) => void) {
    this.tuyaDevice.get({dps: '1'}).then((state: any) => {
      callback(null, state['1'] ? Characteristic.LockCurrentState.SECURED : Characteristic.LockCurrentState.UNSECURED);
    });
  }

  setLockState(state: number, callback: (error: any) => void) {
    if (state === Characteristic.LockTargetState.SECURED) {
      this.lock();
    } else if (state === Characteristic.LockTargetState.UNSECURED) {
      this.unlock();
    }
    callback(null);
  }

  async lock() {
    try {
      await this.tuyaDevice.set({set: true, dps: 1});
      this.locked = true;
      this.lockService.updateCharacteristic(Characteristic.LockCurrentState, Characteristic.LockCurrentState.SECURED);
      log.debug('JTMSPro Lock engaged');
    } catch (err) {
      log.debug('Error setting JTMSPro lock state: ', err);
    }
  }  
}