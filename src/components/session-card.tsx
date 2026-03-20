import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { FallbackProps } from 'react-error-boundary';
import QueryErrorBoundary from './query-error-boundary';
import SessionList from './session-list';
import { Button } from './ui/button';
import { Item, ItemMedia } from './ui/item';
import { Skeleton } from './ui/skeleton';

function SessionListErrorFallback({ resetErrorBoundary }: FallbackProps) {
  return (
    <div className="flex h-64 flex-col items-center justify-center gap-4">
      <p className="text-muted-foreground">Failed to load sessions.</p>
      <Button variant="outline" onClick={() => resetErrorBoundary()}>
        Retry
      </Button>
    </div>
  );
}

function SessionSkeleton() {
  return (
    <Item variant="outline" role="listitem" className="items-start">
      <ItemMedia variant="icon">
        <Skeleton className="h-6 w-5 animate-pulse rounded-full" />
      </ItemMedia>
      <div className="flex-1 space-y-1">
        <Skeleton className="h-5 w-3/4 animate-pulse rounded-md" />
        <Skeleton className="h-4 w-3/4 animate-pulse rounded-md" />
        <Skeleton className="h-3 w-1/2 animate-pulse rounded-md" />
      </div>
    </Item>
  );
}

export default function SessionCard() {
  return (
    <Card className="mt-6 flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Active Sessions</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <QueryErrorBoundary
          ErrorFallbackComponent={SessionListErrorFallback}
          suspenseFallback={<SessionSkeleton />}
        >
          <div className="flex max-h-64 flex-col">
            <div className="scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 flex-1 overflow-y-auto pr-2">
              <SessionList />
            </div>
          </div>
        </QueryErrorBoundary>
      </CardContent>
    </Card>
  );
}
