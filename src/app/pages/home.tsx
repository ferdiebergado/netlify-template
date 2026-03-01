import Loader from '@/components/loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWelcome } from '../home';

export default function Home() {
  const { isPending, isError, error, data } = useWelcome();

  if (isPending) return <Loader />;

  if (isError) return <p className="text-destructive">{error.message}</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Home</CardTitle>
      </CardHeader>
      <CardContent>
        <h1 className="text-lg font-bold">
          <span>{data.message}</span>
        </h1>
      </CardContent>
    </Card>
  );
}
