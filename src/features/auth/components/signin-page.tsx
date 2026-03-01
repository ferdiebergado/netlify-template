import { SignIn } from '@clerk/clerk-react';

import { paths } from '@/app/routes';

export default function SigninPage() {
  return <SignIn signUpUrl={paths.signup} />;
}
