import { LoaderIcon } from 'lucide-react';

export default function Loader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <LoaderIcon className="mx-3 animate-spin" />
      <span>Please wait...</span>
    </div>
  );
}
