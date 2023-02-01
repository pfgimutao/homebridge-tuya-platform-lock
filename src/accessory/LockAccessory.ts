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

    if (this.device.getDeviceFunction('unlock_app')) {
    // TODO
      service.getCharacteristic(this.Characteristic.LockTargetState)
        .onGet(() => {
          const status = this.device.getDeviceStatus('unlock_app');
          return (status?.value as number !== 0) ?
            this.Characteristic.LockTargetState.UNSECURED :
            this.Characteristic.LockTargetState.SECURED;
        })
        .onSet(value => {
          const status = this.device.getDeviceStatus('unlock_app');
          this.deviceManager.sendCommands(this.device.id, [{
            code: status!.code,
            value: (value === this.Characteristic.LockTargetState.UNSECURED) ? 1 : 0, // confused value
          }]);
        });
    }
  }

}