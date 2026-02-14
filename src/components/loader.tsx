import { cn } from '@/lib/utils';
import { LoaderIcon } from 'lucide-react';
import type { ComponentProps } from 'react';

type LoaderProps = ComponentProps<'div'> & {
  text?: string;
};

export default function Loader({ className, text = 'Please wait', ...props }: LoaderProps) {
  return (
    <div className={cn('flex gap-3', className)} {...props}>
      <LoaderIcon className="mx-3 animate-spin" />
      <span>{text}</span>
    </div>
  );
}
