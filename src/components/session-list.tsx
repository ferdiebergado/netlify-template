import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRevokeSessionMutation } from '@/features/auth/queries';
import type { DeviceType } from '@/lib/device-detection';
import { getDeviceIcon } from '@/lib/device-icon-utils';
import { Loader, XIcon } from 'lucide-react';
import { createElement, useState } from 'react';

interface DeviceSession {
  id: string;
  deviceType: DeviceType;
  browser: string;
  location: string;
  lastActive: string;
  current: boolean;
}

interface SessionListProps {
  sessions: DeviceSession[];
  isLoading: boolean;
  isError: boolean;
}

export function SessionList({ sessions, isLoading, isError }: SessionListProps) {
  const [revokingSessions, setRevokingSessions] = useState<Set<string>>(new Set());
  const { mutate: revokeSession } = useRevokeSessionMutation();

  return (
    <Card className="mt-6 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Active Sessions</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader className="animate-spin" />
            <span className="ml-2">Loading sessions...</span>
          </div>
        ) : isError ? (
          <div className="text-destructive py-4 text-center">Failed to load sessions</div>
        ) : sessions.length === 0 ? (
          <div className="text-muted-foreground py-4 text-center">No active sessions found</div>
        ) : (
          <div className="flex max-h-64 flex-col">
            <div className="scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 flex-1 overflow-y-auto pr-2">
              {sessions.map(session => (
                <div
                  key={session.id}
                  className={`flex items-center gap-3 rounded-lg p-3 ${
                    session.current ? 'bg-muted' : ''
                  }`}
                >
                  <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-md">
                    {createElement(getDeviceIcon(session.deviceType), { className: 'h-4 w-4' })}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{session.browser}</p>
                    <p className="text-muted-foreground text-xs">
                      {session.location} • {session.lastActive}
                      {session.current && <span className="text-primary ml-1">(Current)</span>}
                    </p>
                  </div>
                  {!session.current && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => {
                        setRevokingSessions(prev => new Set(prev).add(session.id));
                        revokeSession(session.id, {
                          onSettled: () => {
                            setRevokingSessions(prev => {
                              const next = new Set(prev);
                              next.delete(session.id);
                              return next;
                            });
                          },
                        });
                      }}
                      disabled={revokingSessions.has(session.id)}
                    >
                      <span className="sr-only">Sign out from this device</span>
                      <span className="text-destructive text-xs">
                        {revokingSessions.has(session.id) ? (
                          <Loader className="animate-spin" />
                        ) : (
                          <XIcon />
                        )}
                      </span>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
