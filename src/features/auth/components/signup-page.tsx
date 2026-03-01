import { SignUp } from '@clerk/clerk-react';

import { paths } from '@/app/routes';

export default function SignupPage() {
  return <SignUp signInUrl={paths.signin} />;
}
