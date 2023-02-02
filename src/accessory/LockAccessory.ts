import { PlatformAccessory } from 'homebridge';
import { TuyaPlatform } from '../platform';
import BaseAccessory from './BaseAccessory';

export default class LockAccessory extends BaseAccessory {

  constructor(platform: TuyaPlatform, accessory: PlatformAccessory) {
    super(platform, accessory);

    const service = this.accessory.getService(this.Service.LockMechanism)
      || this.accessory.addService(this.Service.LockMechanism);

    if (this.device.getDeviceStatus('special_control')) {
      service.getCharacteristic(this.Characteristic.LockCurrentState)
        .onGet(() => {
          const status = this.device.getDeviceStatus('special_control');
          return (status?.value as boolean) ?
            this.Characteristic.LockCurrentState.SECURED :
            this.Characteristic.LockCurrentState.UNSECURED;
        });
    }

    if (this.device.getDeviceStatus('special_control')) {
      // TODO
      service.getCharacteristic(this.Characteristic.LockTargetState)
        .onGet(() => {
          const status = this.device.getDeviceStatus('special_control');
          return (status?.value as boolean) ?
            this.Characteristic.LockTargetState.SECURED :
            this.Characteristic.LockTargetState.UNSECURED;
        })
        .onSet(value => {
          const status = this.device.getDeviceStatus('special_control');
          this.deviceManager.sendCommands(this.device.id, [{
            code: status!.code,
            value: (value === this.Characteristic.LockTargetState.SECURED) ? true : false, // confused value
          }]);
        });
    }

  }

}
