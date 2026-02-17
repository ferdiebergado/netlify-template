import type { User } from 'shared/schemas/user.schema';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

type UserAvatarProps = {
  user: User;
};

export default function UserAvatar({ user }: UserAvatarProps) {
  return (
    <Avatar>
      <AvatarImage src={user.picture} alt={user.name} />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  );
}
