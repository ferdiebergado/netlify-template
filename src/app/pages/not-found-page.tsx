import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';

export default function NotFoundPage() {
  return (
    <Empty className="flex h-screen items-center">
      <EmptyHeader>
        <EmptyTitle className="text-4xl">Page Not Found</EmptyTitle>
        <EmptyDescription>The page you&apos;re looking for doesn&apos;t exist.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
