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

type FallbackPageProps = {
  error: unknown;
  resetErrorBoundary: (...args: unknown[]) => void;
};

export default function FallbackPage({ error, resetErrorBoundary }: FallbackPageProps) {
  const handleClick = () => resetErrorBoundary();

  return (
    <Empty className="h-screen">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <TriangleAlert />
        </EmptyMedia>
        <EmptyTitle className="text-destructive text-2xl">Something went wrong.</EmptyTitle>
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
