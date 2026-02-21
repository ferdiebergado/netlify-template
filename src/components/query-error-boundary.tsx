import { QueryErrorResetBoundary } from '@tanstack/react-query';
import { Suspense, type ReactNode } from 'react';
import { ErrorBoundary, type ErrorBoundaryProps } from 'react-error-boundary';

type QueryErrorBoundaryProps = ErrorBoundaryProps & {
  suspenseFallback: ReactNode;
  children: ReactNode;
};

export default function QueryErrorBoundary(props: QueryErrorBoundaryProps) {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <ErrorBoundary onReset={reset} {...props}>
          <Suspense fallback={props.suspenseFallback}>{props.children}</Suspense>
        </ErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}
