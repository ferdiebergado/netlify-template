import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';

export default function Home() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Home</CardTitle>
      </CardHeader>
      <CardContent>
        <h1 className="text-lg font-bold">Welcome!</h1>
      </CardContent>
    </Card>
  );
}
