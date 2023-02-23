
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

export enum TuyaDeviceID {
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

export type TuyaIRRemoteKeyListItem = {
  key: string;
  key_id: number;
  key_name: string;
  standard_key: boolean;
};

export type TuyaIRRemoteTempListItem = {
  temp: number;
  temp_name: string;
  fan_list: TuyaIRRemoteFanListItem[];
};

export type TuyaIRRemoteKeyRangeItem = {
  mode: number;
  mode_name: string;
  temp_list: TuyaIRRemoteTempListItem[];
};

export type TuyaIRRemoteFanListItem = {
  fan: number;
  fan_name: string;
};

export type TuyaIRRemoteKeys = {
  category_id: number;
  brand_id: number;
  remote_index: number;
  single_air: boolean;
  duplicate_power: boolean;
  key_list: TuyaIRRemoteKeyListItem[];
  key_range: TuyaIRRemoteKeyRangeItem[];
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
  key!: TuyaLockSchema[];

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
  parent_id!: string;
  sub!: boolean;
  remote_keys!: TuyaIRRemoteKeys;

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

  getDeviceKey(ticket_id: string) {
    return this.key.find(key => key.ticket_id === ticket_id);
  }

  getDeviceKeyID(ticket_id: string) {
    const deviceKey = this.getDeviceKey(ticket_id);
    if (!deviceKey) {
      return;
    }
    return JSON.parse(deviceKey.ticket_id) as TuyaDeviceID;
  }

  getDeviceStatus(code: string) {
    return this.status.find(status => status.code === code);
  }

  setDeviceStatus(code: string, value: string | number | boolean) {
    const deviceStatus = this.getDeviceStatus(code);
    if (!deviceStatus) {
      return;
    }
    deviceStatus.value = value;
  }

  isIRControlHub() {
    return this.category === 'wnykq' || this.category === 'hwktwkq';
  }

  isIRRemoteControl() {
    return this.remote_keys !== undefined;
  }

}

