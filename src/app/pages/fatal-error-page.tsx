import { RefreshCcwIcon, TriangleAlert } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

const handleClick = () => globalThis.location.reload();

export default function FatalErrorPage() {
  return (
    <Empty className="h-dvh">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <TriangleAlert />
        </EmptyMedia>
        <EmptyTitle className="text-destructive text-2xl">Fatal Error</EmptyTitle>
        <EmptyDescription className="max-w-xs text-pretty">
          A critical error occurred.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" onClick={handleClick}>
          <RefreshCcwIcon data-icon="inline-start" />
          Reload
        </Button>
      </EmptyContent>
    </Empty>
  );
}
