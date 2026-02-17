import Loader from './loader';

type FullPageLoaderProps = {
  text?: string;
};

export default function FullPageLoader({ text }: FullPageLoaderProps) {
  return (
    <Loader className="bg-muted flex h-screen w-full items-center justify-center" text={text} />
  );
}
