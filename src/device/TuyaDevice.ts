
export enum TuyaDeviceSchemaMode {
  UNKNOWN = '',
  READ_WRITE = 'rw',
  READ_ONLY = 'ro',
  WRITE_ONLY = 'wo',
}

export enum TuyaDeviceSchemaType {
  Boolean = 'Boolean',
  Integer = 'Integer',
  Enum = 'Enum',
  String = 'String',
  Json = 'Json',
  Raw = 'Raw',
}

export enum TuyaDeviceFunctionType {
  Boolean = 'Boolean',
  Integer = 'Integer',
  Enum = 'Enum',
  String = 'String',
  Json = 'Json',
  Raw = 'Raw',
}

export type TuyaDeviceFunctionIntegerProperty = {
  min: number;
  max: number;
  scale: number;
  step: number;
  unit: string;
};

export type TuyaDeviceFunctionEnumProperty = {
  range: string[];
};

export type TuyaDeviceFunctionJSONProperty = object;

export type TuyaDeviceFunctionProperty = TuyaDeviceFunctionIntegerProperty
  | TuyaDeviceFunctionEnumProperty
  | TuyaDeviceFunctionJSONProperty;

export type TuyaDeviceFunction = {
  code: string;
  name: string;
  desc: string;
  type: TuyaDeviceFunctionType;
  values: string;
};

export type TuyaDeviceSchemaIntegerProperty = {
  min: number;
  max: number;
  scale: number;
  step: number;
  unit: string;
};

export type TuyaDeviceSchemaEnumProperty = {
  range: string[];
};

export type TuyaDeviceSchemaStringProperty = string;

export type TuyaDeviceSchemaJSONProperty = object;

export type TuyaDeviceSchemaProperty = TuyaDeviceSchemaIntegerProperty
  | TuyaDeviceSchemaEnumProperty
  | TuyaDeviceSchemaStringProperty
  | TuyaDeviceSchemaJSONProperty;

export type TuyaDeviceSchema = {
  code: string;
  // name: string;
  mode: TuyaDeviceSchemaMode;
  type: TuyaDeviceSchemaType;
  property: TuyaDeviceSchemaProperty;
};

export type TuyaDeviceStatus = {
  code: string;
  value: string | number | boolean;
};

export type TuyaDeviceKey = {
  expire_time: number;
  ticket_id: string;
  ticket_key: string;
};

export type TuyaLockSchema = {
  ticket_id: string;
  open: boolean;
};

export default class TuyaDevice {

  // device
  id!: string;
  uuid!: string;
  name!: string;
  online!: boolean;
  owner_id!: string; // homeID or assetID

  // product
  product_id!: string;
  product_name!: string;
  icon!: string;
  category!: string;
  schema!: TuyaDeviceSchema[];
  functions!: TuyaDeviceFunction[];
  key!: TuyaDeviceKey[];

  // status
  status!: TuyaDeviceStatus[];

  // location
  ip!: string;
  lat!: string;
  lon!: string;
  time_zone!: string;

  // time
  create_time!: number;
  active_time!: number;
  update_time!: number;

  // ...

  constructor(obj: Partial<TuyaDevice>) {
    Object.assign(this, obj);
    this.status.sort((a, b) => a.code > b.code ? 1 : -1);
  }

  isVirtualDevice() {
    return this.id.startsWith('vdevo');
  }

  getDeviceFunction(code: string) {
    return this.functions.find(_function => _function.code === code);
  }

  getDeviceFunctionProperty(code: string) {
    const deviceFunction = this.getDeviceFunction(code);
    if (!deviceFunction) {
      return;
    }
    return JSON.parse(deviceFunction.values) as TuyaDeviceFunctionProperty;
  }

  getDeviceStatus(code: string) {
    return this.status.find(status => status.code === code);
  }

  getDeviceKey(ticket_id: string) {
    return this.key.find(key => key.ticket_id === ticket_id) as TuyaDeviceKey;
  }

  setDeviceStatus(code: string, value: string | number | boolean) {
    const deviceStatus = this.getDeviceStatus(code);
    if (!deviceStatus) {
      return;
    }
    deviceStatus.value = value;
  }
}
