import { Link } from 'react-router';
import { cn } from '@/lib/utils';

interface Props {
  title: string;
  icon?: React.ReactNode;
  path?: string;
  active?: boolean;
  onClick?: () => void;
  rightIcon?: React.ReactNode;
}

export const SideNavCustom = ({
  title,
  icon,
  path,
  active = false,
  onClick,
  rightIcon,
}: Props) => {
  const classes = cn(
    'flex items-center gap-3 px-1 py-2 rounded-md text-sm transition-colors w-full',
    active && path
      ? 'bg-secondary text-white font-medium'
      : 'text-muted-foreground hover:bg-accent/50'
  );

const content = (
  <>
    {/* Left: icon + title */}
    <div className="flex items-center gap-3 min-w-0">
      {icon && <span className="h-4 w-4 shrink-0">{icon}</span>}
      <span className="truncate">{title}</span>
    </div>

    {/* Right: reserved space for chevron */}
    <span className="ml-auto h-4 w-4 shrink-0 flex items-center justify-center">
      {rightIcon}
    </span>
  </>
);


  if (path) {
    return (
      <Link to={path} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {content}
    </button>
  );
};
