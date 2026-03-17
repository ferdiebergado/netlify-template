export type DeviceType = 'desktop' | 'mobile' | 'tablet' | 'other';

export function getDeviceType(userAgent: string): DeviceType {
  // Check for mobile devices first
  if (/mobile|android|iphone|ipod|iemobile/i.test(userAgent)) {
    return 'mobile';
  }

  // Check for tablets
  if (/tablet|ipad/i.test(userAgent)) {
    return 'tablet';
  }

  // Check for desktop
  if (/windows|macintosh|linux/i.test(userAgent)) {
    return 'desktop';
  }

  // Default to other
  return 'other';
}

export function getBrowserInfo(userAgent: string): string {
  if (/chrome/i.test(userAgent)) {
    return 'Chrome';
  }
  if (/firefox/i.test(userAgent)) {
    return 'Firefox';
  }
  if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
    return 'Safari';
  }
  if (/edge/i.test(userAgent)) {
    return 'Edge';
  }
  if (/opera|opr/i.test(userAgent)) {
    return 'Opera';
  }

  return 'Unknown Browser';
}

export function getOSInfo(userAgent: string): string {
  if (/windows nt 10/i.test(userAgent)) {
    return 'Windows 10';
  }
  if (/windows nt 6.3/i.test(userAgent)) {
    return 'Windows 8.1';
  }
  if (/windows nt 6.2/i.test(userAgent)) {
    return 'Windows 8';
  }
  if (/windows nt 6.1/i.test(userAgent)) {
    return 'Windows 7';
  }
  if (/macintosh|mac os x/i.test(userAgent)) {
    return 'macOS';
  }
  if (/linux/i.test(userAgent)) {
    return 'Linux';
  }
  if (/iphone/i.test(userAgent)) {
    return 'iOS';
  }
  if (/android/i.test(userAgent)) {
    return 'Android';
  }

  return 'Unknown OS';
}

export function getDeviceInfo(userAgent: string): string {
  return `${getBrowserInfo(userAgent)} on ${getOSInfo(userAgent)}`;
}
