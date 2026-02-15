import { ModeToggle } from '@/features/dark-mode/components/mode-toggle';
import Breadcrumbs from './breadcrumbs';
import { Separator } from './ui/separator';
import { SidebarTrigger } from './ui/sidebar';

export default function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumbs />
      </div>
      <div className="ml-auto flex items-center gap-2 px-4">
        <ModeToggle />
      </div>
    </header>
  );
}
