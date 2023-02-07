import BaseAccessory from './BaseAccessory';

const SCHEMA_CODE = {
  LOCK_CURRENT_STATE: ['lock_motor_state'],
  LOCK_TARGET_STATE: ['unlock_app'], // TODO: need physical device test
};

export default class LockAccessory extends BaseAccessory {

  requiredSchema() {
    return [SCHEMA_CODE.LOCK_TARGET_STATE];
  }

  configureServices() {
    this.configureLockCurrentState();
    this.configureLockTargetState();
  }

  mainService() {
    return this.accessory.getService(this.Service.LockMechanism)
      || this.accessory.addService(this.Service.LockMechanism);
  }

  configureLockCurrentState() {
    const schema = this.getSchema(...SCHEMA_CODE.LOCK_CURRENT_STATE);
    if (!schema) {
      return;
    }

    const { UNSECURED, SECURED } = this.Characteristic.LockCurrentState;
    this.mainService().getCharacteristic(this.Characteristic.LockCurrentState)
      .onGet(() => {
        const status = this.getStatus(schema.code)!;
        return (status.value as boolean) ? UNSECURED : SECURED;
      });
  }

  configureLockTargetState() {
    const schema = this.getSchema(...SCHEMA_CODE.LOCK_TARGET_STATE);
    if (!schema) {
      return;
    }

    const { UNSECURED, SECURED } = this.Characteristic.LockTargetState;
    this.mainService().getCharacteristic(this.Characteristic.LockTargetState)
      .onGet(() => {
        const status = this.getStatus(schema.code)!;
        return (status.value !== 0) ? UNSECURED : SECURED;
      })
      .onSet(value => {
        this.deviceManager.sendCommands(this.device.id, [{
          code: schema.code,
          value: (value === UNSECURED) ? 1 : 0, // confused value
        }]);
      });
  }

}
