import { RefreshCcwIcon, TriangleAlertIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';

const handleClick = () => globalThis.location.reload();

export default function FatalErrorPage() {
  return (
    <Empty className="bg-muted/30 h-dvh">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <TriangleAlertIcon />
        </EmptyMedia>
        <EmptyTitle className="text-destructive text-2xl">A critical error occurred.</EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        <p>Click Reload or try again later.</p>
        <Button variant="outline" onClick={handleClick}>
          <RefreshCcwIcon data-icon="inline-start" />
          Reload
        </Button>
      </EmptyContent>
    </Empty>
  );
}
