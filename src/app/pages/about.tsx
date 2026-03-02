import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function About() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">About</CardTitle>
      </CardHeader>
      <CardContent>
        <p>This is the about page.</p>
      </CardContent>
    </Card>
  );
}
