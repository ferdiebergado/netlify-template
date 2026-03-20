import { XIcon } from 'lucide-react';
import { createElement } from 'react';

import type { DeviceSession } from '@/features/auth/types';
import { getDeviceIcon } from '@/lib/device-icon-utils';
import Loader from './loader';
import { Button } from './ui/button';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from './ui/item';

type SessionProps = {
  session: DeviceSession;
  revokingSessions: Set<string>;
  onRevoke: (session: DeviceSession) => void;
};

export default function Session({ session, revokingSessions: sessions, onRevoke }: SessionProps) {
  return (
    <Item key={session.id} variant={session.current ? 'outline' : 'muted'} role="listitem">
      <ItemMedia variant="icon">{createElement(getDeviceIcon(session.deviceType))}</ItemMedia>
      <ItemContent>
        <ItemTitle>
          {session.browser} on {session.os}
        </ItemTitle>
        <ItemDescription className="text-xs">
          <span className="block">{session.location}</span>
          <span className="block">
            {session.lastActive}{' '}
            {session.current && <span className="text-primary">(Current)</span>}
          </span>
        </ItemDescription>
      </ItemContent>
      {!session.current && (
        <ItemActions>
          <Button
            variant="outline"
            size="icon-sm"
            className="rounded-full"
            onClick={() => onRevoke(session)}
            disabled={sessions.has(session.id)}
            title="Signout from this device"
          >
            <span className="sr-only">Sign out from this device</span>
            <span>
              {sessions.has(session.id) ? <Loader className="animate-spin" /> : <XIcon size="sm" />}
            </span>
          </Button>
        </ItemActions>
      )}
    </Item>
  );
}
