import SuspenseQueryErrorBoundary from '@/components/suspense-query-error-boundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import { Skeleton } from '@/components/ui/skeleton';
import { Cpu, MemoryStick, Server, SquareTerminal, Timer } from 'lucide-react';
import { useEnvQuery } from '../queries';

function Env() {
  const { data } = useEnvQuery();

  return (
    <div className="space-y-5">
      <Item variant="outline" className="max-w-xs">
        <ItemMedia variant="icon">
          <Server />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Node Version</ItemTitle>
          <ItemDescription>{data.node}</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline" className="max-w-xs">
        <ItemMedia variant="icon">
          <SquareTerminal />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>OS Version</ItemTitle>
          <ItemDescription>{data.release}</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline" className="max-w-xs">
        <ItemMedia variant="icon">
          <Cpu />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Memory Available</ItemTitle>
          <ItemDescription>{data.memAvail}</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline" className="max-w-xs">
        <ItemMedia variant="icon">
          <MemoryStick />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Memory Usage</ItemTitle>
          <ItemDescription>{data.memUsage}</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline" className="max-w-xs">
        <ItemMedia variant="icon">
          <Timer />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Uptime</ItemTitle>
          <ItemDescription>{data.uptime}</ItemDescription>
        </ItemContent>
      </Item>
    </div>
  );
}

function Fallback() {
  return (
    <div className="space-y-5">
      <Skeleton className="h-[74.25px] max-w-xs" />
      <Skeleton className="h-[74.25px] max-w-xs" />
      <Skeleton className="h-[74.25px] max-w-xs" />
      <Skeleton className="h-[74.25px] max-w-xs" />
      <Skeleton className="h-[74.25px] max-w-xs" />
    </div>
  );
}

export default function Settings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h1 className="text-2xl font-semibold">Settings</h1>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="mb-6 text-lg font-semibold">Application Environment</h2>
        <SuspenseQueryErrorBoundary suspenseFallback={<Fallback />}>
          <Env />
        </SuspenseQueryErrorBoundary>
      </CardContent>
    </Card>
  );
}
