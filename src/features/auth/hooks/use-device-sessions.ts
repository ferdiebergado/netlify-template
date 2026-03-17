import { useSessionsQuery } from '@/features/auth/queries';
import { formatLastActive } from '@/lib/date-utils';
import type { Session } from '@shared/schemas/user.schema';
import type { DeviceSession } from '../types';

export function useDeviceSessions() {
  const { data, isLoading, isError } = useSessionsQuery();

  const deviceSessions: DeviceSession[] =
    data?.sessions?.map((session: Session) => ({
      id: session.sessionId,
      device: session.device,
      deviceType: session.deviceType,
      deviceVendor: session.deviceVendor,
      browser: session.browser,
      os: session.os,
      location: `${session.city}, ${session.country}`,
      lastActive: formatLastActive(new Date(session.lastActiveAt)),
      current: session.sessionId === data.currentSessionId,
    })) || [];

  return {
    deviceSessions,
    isLoading,
    isError,
  };
}
