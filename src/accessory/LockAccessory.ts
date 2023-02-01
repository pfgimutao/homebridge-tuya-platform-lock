import { PlatformAccessory } from 'homebridge';
import { TuyaPlatform } from '../platform';
import BaseAccessory from './BaseAccessory';

export default class LockAccessory extends BaseAccessory {

  constructor(platform: TuyaPlatform, accessory: PlatformAccessory) {
    super(platform, accessory);

    const service = this.accessory.getService(this.Service.LockMechanism)
      || this.accessory.addService(this.Service.LockMechanism);

    if (this.device.getDeviceStatus('lock_motor_state')) {
      service.getCharacteristic(this.Characteristic.LockCurrentState)
        .onGet(() => {
          const status = this.device.getDeviceStatus('lock_motor_state');
          return (status?.value as boolean) ?
            this.Characteristic.LockCurrentState.UNSECURED :
            this.Characteristic.LockCurrentState.SECURED;
        });
    }

  }

}