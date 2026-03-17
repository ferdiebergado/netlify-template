import { useSessionsQuery } from '@/features/auth/queries';
import { formatLastActive } from '@/lib/date-utils';
import { getDeviceInfo, getDeviceType } from '@/lib/device-detection';
import type { Session } from '@shared/schemas/user.schema';
import { useState } from 'react';

interface DeviceSession {
  id: string;
  deviceType: 'desktop' | 'mobile' | 'tablet' | 'other';
  browser: string;
  location: string;
  lastActive: string;
  current: boolean;
}

function getLocationFromIP(ip: string): string {
  // In a real app, you would use a service like ip-api.com or similar
  // For now, we'll use a placeholder
  if (ip.startsWith('192.168.') || ip === '::1' || ip.startsWith('127.')) {
    return 'Local Network';
  }
  // This is just a simple example - in production you'd use a proper geolocation service
  return 'Unknown Location';
}

export function useDeviceSessions() {
  const { data, isLoading, isError } = useSessionsQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const sessionsPerPage = 5;

  // Transform sessions data for display
  const deviceSessions: DeviceSession[] =
    data?.sessions?.map((session: Session) => ({
      id: session.sessionId,
      deviceType: getDeviceType(session.userAgent),
      browser: getDeviceInfo(session.userAgent),
      location: getLocationFromIP(session.ip),
      lastActive: formatLastActive(new Date(session.lastActiveAt)),
      current: session.sessionId === data.currentSessionId,
    })) || [];

  // Pagination logic
  const totalPages = Math.ceil(deviceSessions.length / sessionsPerPage);
  const startIndex = (currentPage - 1) * sessionsPerPage;
  const endIndex = startIndex + sessionsPerPage;
  const currentSessions = deviceSessions.slice(startIndex, endIndex);

  return {
    deviceSessions,
    currentSessions,
    isLoading,
    isError,
    currentPage,
    totalPages,
    setCurrentPage,
  };
}
