import type { Profile } from '@shared/schemas/user.schema';
import { User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

type UserAvatarProps = {
  user: Profile;
};

export default function UserAvatar({ user }: UserAvatarProps) {
  return (
    <Avatar className="h-8 w-8 rounded-lg">
      <AvatarImage src={user.picture} alt={user.name} />
      <AvatarFallback className="rounded-lg">
        <User />
      </AvatarFallback>
    </Avatar>
  );
}
