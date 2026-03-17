import type { DeviceType } from '@/lib/device-detection';
import type { LucideIcon } from 'lucide-react';
import { Globe, Monitor, Smartphone, Tablet } from 'lucide-react';

export function getDeviceIcon(deviceType: DeviceType): LucideIcon {
  switch (deviceType) {
    case 'desktop': {
      return Monitor;
    }
    case 'mobile': {
      return Smartphone;
    }
    case 'tablet': {
      return Tablet;
    }
    default: {
      return Globe;
    }
  }
}
