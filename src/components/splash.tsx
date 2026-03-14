import { env } from '@/config';

export default function Splash() {
  return (
    <div className="flex h-dvh items-center justify-center">
      <p className="animate-pulse text-center text-4xl font-bold text-indigo-600 text-shadow-lg dark:text-indigo-400">
        {env.VITE_APP_TITLE}
      </p>
    </div>
  );
}
