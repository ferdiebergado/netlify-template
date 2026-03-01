import { SignIn } from '@clerk/clerk-react';

export default function LoginPage() {
  return (
    <div className="bg-muted min-h-svh p-6 md:p-10">
      <SignIn />
    </div>
  );
}
