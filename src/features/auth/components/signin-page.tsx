import { GalleryVerticalEnd } from 'lucide-react';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { toast } from 'sonner';

import { SigninForm } from './signin-form';

export default function SigninPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const search = 'error';
    const error = searchParams.get(search);

    if (error) {
      toast.error(error);
      searchParams.delete(search);
      setSearchParams(searchParams, { replace: true });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Digital Empire Inc.
        </a>
        <SigninForm />
      </div>
    </div>
  );
}
