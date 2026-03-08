import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  className?: string;
  message?: string;
}

export default function Loading({ className, message = 'Please wait...' }: LoadingProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 flex flex-col items-center justify-center',
        'bg-background/60 backdrop-blur-sm transition-all duration-300',
        className
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="text-primary h-10 w-10 animate-spin" />
        <p className="text-muted-foreground animate-pulse text-sm font-medium">{message}</p>
      </div>
    </div>
  );
}
