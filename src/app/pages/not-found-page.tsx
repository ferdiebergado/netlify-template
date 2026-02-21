import { buttonVariants } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty';
import { Link, useLocation } from 'react-router';

export default function NotFoundPage() {
  const location = useLocation();
  const from = globalThis.history.length > 2 ? -1 : (location.state?.from ?? '/');

  return (
    <Empty className="flex h-screen items-center">
      <EmptyHeader>
        <EmptyTitle className="text-4xl">Page Not Found</EmptyTitle>
        <EmptyDescription>The page you&apos;re looking for doesn&apos;t exist.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center gap-2">
        <Link to={from} className={buttonVariants({ variant: 'outline' })}>
          Go back
        </Link>
        <Link to="/" className={buttonVariants({ variant: 'default' })}>
          Home
        </Link>
      </EmptyContent>
    </Empty>
  );
}
