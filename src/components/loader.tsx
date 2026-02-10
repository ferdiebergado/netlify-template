import { LoaderIcon } from 'lucide-react';

export default function Loader() {
  return (
    <div className="bg-muted flex h-screen w-full items-center justify-center">
      <LoaderIcon className="mx-3 animate-spin" />
      <span>Please wait...</span>
    </div>
  );
}
