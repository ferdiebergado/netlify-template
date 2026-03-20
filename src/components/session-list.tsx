import { useDeviceSessions } from '@/features/auth/hooks/use-device-sessions';
import { useRevokeSessionMutation } from '@/features/auth/queries';
import type { DeviceSession } from '@/features/auth/types';
import { useState } from 'react';
import { toast } from 'sonner';
import Session from './session';
import { ItemGroup } from './ui/item';

export default function SessionList() {
  const [revokingSessions, setRevokingSessions] = useState<Set<string>>(new Set());
  const deviceSessions = useDeviceSessions();
  const { mutate: revokeSession } = useRevokeSessionMutation();

  const handleRevoke = (session: DeviceSession) => {
    setRevokingSessions(prev => new Set(prev).add(session.id));

    revokeSession(session.id, {
      onSuccess: data => toast.success(data?.message ?? 'Session revoked.'),
      onSettled: () => {
        setRevokingSessions(prev => {
          const next = new Set(prev);
          next.delete(session.id);
          return next;
        });
      },
    });
  };

  return (
    <ItemGroup className="gap-4">
      {deviceSessions.map(session => (
        <Session
          key={session.id}
          session={session}
          revokingSessions={revokingSessions}
          onRevoke={handleRevoke}
        />
      ))}
    </ItemGroup>
  );
}
