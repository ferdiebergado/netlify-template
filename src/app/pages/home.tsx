import QueryErrorBoundary from '@/components/query-error-boundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { toast } from 'sonner';
import { useWelcomeQuery } from '../queries';

function Message() {
  const { data } = useWelcomeQuery();

  return <p>{data?.message}</p>;
}

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const search = 'success';
    const success = searchParams.get(search);

    if (success) {
      toast.success(success);
      searchParams.delete(search);
      setSearchParams(searchParams, { replace: true });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
