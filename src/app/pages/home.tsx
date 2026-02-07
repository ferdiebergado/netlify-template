import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Home() {
  return (
    <Card className="w-full md:w-8/10">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Home</CardTitle>
      </CardHeader>
      <CardContent>
        <h1 className="text-lg font-bold">Welcome!</h1>
      </CardContent>
    </Card>
  );
}
