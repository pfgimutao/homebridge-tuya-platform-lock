import BaseAccessory from './BaseAccessory';

const SCHEMA_CODE = {
  CURRENT_LOCK_STATE: ['lock_motor_state'],
  TARGET_LOCK_STATE: ['special_control'],
};

export default class LockAccessory extends BaseAccessory {

  requiredSchema() {
    return [SCHEMA_CODE.TARGET_LOCK_STATE];
  }

  configureServices() {

    this.configureCurrentLockState();
    this.configureTargetLockState();
  }

  mainService() {
    return this.accessory.getService(this.Service.LockMechanism)
      || this.accessory.addService(this.Service.LockMechanism);
  }

  configureCurrentLockState() {
    const { LOCKED, UNLOCKED, LOCKING, UNLOCKING, STOPPED } = this.Characteristic.CurrentLockState;
    this.mainService().getCharacteristic(this.Characteristic.CurrentLockState)
      .onGET(() => {
        const currentSchema = this.getSchema(...SCHEMA_CODE.CURRENT_LOCK_STATE);
        const targetSchema = this.getSchema(...SCHEMA_COD.TARGET_LOCK_STATE);
        if (!currentSchema || !targetSchema) {
          return STOPPED;
        }

        const currentStatus = this.getStatus(currentSchema.code)!;
        const targetStatus = this.getStatus(targetSchema.code)!;
        if (currentStatus.value === false && targetStatus.value === false) {
          return LOCKED;
        } else if (currentStatus.value === true && targetStatus.value === false) {
          return LOCKING;
        } else if (currentStatus.value === false && targetStatus.value === true) {
          return UNLOCKED;
        } else if (currentStatus.value === true && targetStatus.value === true) {
          return UNLOCKING;
        }

      return STOPPED;
    });
  }
  
  configureTargetLockState() {
    const schema = this.getSchema(...SCHEMA_CODE.TARGET_LOCK_STATE);
    if (!schema) {
      return;
    }

    const { LOCKED, UNLOCKED } = this.Characteristic.TargetLockState;
    this.mainService(),getCharacteristic(this.Characteristic.TargetLockState)
      .onGet(() => {
        const status = this.getStatus(schema.code)!;
        return status.value as boolean ? LOCKED ; UNLOCKED;
      })
      .onSet(value => {
        this.sendCommands([{
          code: schema.code,
          value: (value === LOCKED) ? false : true,
        }]);
    });
  }
}
