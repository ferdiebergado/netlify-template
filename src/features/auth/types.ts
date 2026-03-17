export type DeviceSession = {
  id: string;
  device?: string;
  deviceType?: string;
  deviceVendor?: string;
  browser?: string;
  os?: string;
  location: string;
  lastActive: string;
  current: boolean;
};
