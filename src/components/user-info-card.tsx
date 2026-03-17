import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Profile } from '@shared/schemas/user.schema';
import { UserCircle } from 'lucide-react';

interface UserInfoCardProps {
  user: Profile;
}

export function UserInfoCard({ user }: UserInfoCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <UserCircle className="h-5 w-5" />
          User Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <img src={user.picture || ''} className="h-25 w-25 rounded-full" />
        </div>

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
