import QueryErrorBoundary from '@/components/query-error-boundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { useWelcomeQuery } from '../queries';

function Message() {
  const { data } = useWelcomeQuery();

  return <p>{data.message}</p>;
}

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('signin') === 'success') {
      toast.success('Welcome back! You have successfully signed in.');

      searchParams.delete('signin');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Home</CardTitle>
      </CardHeader>
      <CardContent>
        <QueryErrorBoundary suspenseFallback={<Skeleton className="h-6 w-20" />}>
          <Message />
        </QueryErrorBoundary>
      </CardContent>
    </Card>
  );
}
