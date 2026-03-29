import { LoaderIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

import { cn } from '@/lib/utils';

type LoaderProps = ComponentProps<'div'> & {
  text?: string;
};

export default function Loader({ className, text = 'Please wait...', ...props }: LoaderProps) {
  return (
    <p className={cn('space-x-3', className)} {...props}>
      <LoaderIcon className="animate-spin" data-icon="inline-start" />
      {text}
    </p>
  );
}
