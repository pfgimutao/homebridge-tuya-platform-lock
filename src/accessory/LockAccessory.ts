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
          const check = this.device.getDeviceStatus('lock_motor_control');
          if (check?.value === false && status?.value === false) {
            return this.Characteristic.LockCurrentState.SECURED;
          } else if (check?.value === false && status?.value === true) {
            return this.Characteristic.LockCurrentState.UNSECURED;
          } else {
          }
        });
    }

    if (this.device.getDeviceStatus('special_control')) {
      // TODO
      service.getCharacteristic(this.Characteristic.LockTargetState)
        .onGet(() => {
          const status = this.device.getDeviceStatus('special_control');
          const check = this.device.getDeviceStatus('lock_motor_control');
          if (check?.value === false && status?.value === false) {
            return this.Characteristic.LockCurrentState.SECURED;
          } else (check?.value === false && status?.value === true) {
            return this.Characteristic.LockCurrentState.UNSECURED;
          }
        })
        .onSet(value => {
          const status = this.device.getDeviceStatus('special_control');
          this.deviceManager.sendCommands(this.device.id, [{
            code: status!.code,
            value: (value === this.Characteristic.LockTargetState.UNSECURED) ? true : false, // confused value
          }]);
        });
    }

  }

}
