import { ModeToggle } from '@/components/dark-mode/mode-toggle';
import Breadcrumbs from './breadcrumbs';
import { Separator } from './ui/separator';
import { SidebarTrigger } from './ui/sidebar';
import UserMenu from './user-menu';

export default function Header() {
  return (
    <header className="flex h-16 w-full items-center gap-2 p-0 sm:p-6">
      <div className="flex h-4 items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumbs />
      </div>
      <div className="ml-auto flex items-center gap-6 px-4">
        <ModeToggle />
        <UserMenu />
      </div>
    </header>
  );
}
