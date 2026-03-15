import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense, type ComponentType, type ReactNode } from 'react';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

import { Button } from './ui/button';

type SuspenseQueryErrorBoundaryProps = {
  children: ReactNode;
  suspenseFallback: ReactNode;
  ErrorFallbackComponent?: ComponentType<FallbackProps>;
};

/**
 * A reusable wrapper that synchronizes TanStack Query reset logic
 * with React Error Boundaries and Suspense.
 */
export default function QueryErrorBoundary({
  children,
  suspenseFallback,
  ErrorFallbackComponent = DefaultErrorFallback,
}: SuspenseQueryErrorBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary FallbackComponent={ErrorFallbackComponent} onReset={reset}>
          <Suspense fallback={suspenseFallback}>{children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

/**
 * Internal default error UI to keep the component functional out-of-the-box.
 */
function DefaultErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  const handleClick = () => resetErrorBoundary();

  return (
    <div role="alert" className="border-destructive rounded border p-4">
      <h2 className="text-destructive text-lg font-semibold">Something went wrong</h2>
      <pre className="overflow-auto py-2 text-sm whitespace-pre-wrap">
        {error instanceof Error ? error.message : String(error)}
      </pre>
      <Button className="bg-primary mt-2 rounded px-4 py-2 text-white" onClick={handleClick}>
        Try again
      </Button>
    </div>
  );
}
