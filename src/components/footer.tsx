import { Link } from 'react-router';

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <p className="text-muted-foreground p-4 text-center text-sm">
      &copy; {year} by <Link to="mailto:ferdiebergado@gmail.com">ferdie bergado</Link>.
    </p>
  );
}
