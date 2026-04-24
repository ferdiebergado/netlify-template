import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Profile } from '@shared/schemas/user.schema';
import { UserCircle } from 'lucide-react';
import { buttonVariants } from './ui/button';

type UserInfoCardProps = {
  user: Profile;
};

export function UserInfoCard({ user }: UserInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <UserCircle className="size-5" />
          Account
        </CardTitle>
        <CardAction>
          <a
            href="https://myaccount.google.com"
            target="_blank"
            className={buttonVariants({ variant: 'link', size: 'sm' })}
          >
            Manage
          </a>
        </CardAction>
      </CardHeader>
      <CardContent>
        <img src={user.picture ?? ''} className="mx-auto block size-25 rounded-full" />

        <div className="space-y-5 text-sm">
          <div>
            <p className="text-muted-foreground">Name</p>
            <p className="font-medium">{user.name || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="font-medium wrap-break-word">{user.email || 'Not provided'}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
