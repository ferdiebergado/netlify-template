import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { RefreshCcwIcon, TriangleAlert } from 'lucide-react';

type ErrorFallbackProps = {
  error: unknown;
  resetErrorBoundary: (...args: unknown[]) => void;
};

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const handleClick = () => resetErrorBoundary();

  return (
    <Empty className="bg-muted/30 h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <TriangleAlert />
        </EmptyMedia>
        <EmptyTitle>SYSTEM ERROR</EmptyTitle>
        <EmptyDescription className="max-w-xs text-pretty">
          {error instanceof Error ? error.message : 'An unknown error occurred.'}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline" onClick={handleClick}>
          <RefreshCcwIcon data-icon="inline-start" />
          Retry
        </Button>
      </EmptyContent>
    </Empty>
  );
}
