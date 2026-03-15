import { RefreshCcwIcon, TriangleAlertIcon } from 'lucide-react';
import type { FallbackProps } from 'react-error-boundary';

import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';

export default function ErrorPage({ resetErrorBoundary }: FallbackProps) {
  const handleClick = () => resetErrorBoundary();

  return (
    <Empty className="bg-muted/30 h-dvh">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <TriangleAlertIcon />
        </EmptyMedia>
        <EmptyTitle className="text-destructive text-2xl">Something went wrong.</EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        <p>Click Retry or reload the page.</p>
        <Button variant="outline" onClick={handleClick}>
          <RefreshCcwIcon data-icon="inline-start" />
          Retry
        </Button>
      </EmptyContent>
    </Empty>
  );
}
