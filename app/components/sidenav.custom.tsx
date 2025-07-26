import { Link } from 'react-router';
import clsx from 'clsx';

interface Props {
  active: boolean;
  icon?: React.ReactNode;
  path?: string | null;
  title?: string;
  isTitle?: boolean;
}

export const SideNavCustom = (props: Props) => {

  const {
    active = false,
    icon = null,
    path = null,
    title = '',
    isTitle = false,
  } = props;
  
  const baseClasses = clsx(
    'flex items-center w-full px-4 py-2 rounded-md text-sm transition-colors duration-200',
    {
      'bg-secondary text-white font-semibold': active,
      'hover:bg-gray-100 text-slate-600': !active,
      'pl-4': !isTitle,
    }
  );

  if (path) {
    return (
      <>
        <ul>
          <Link to={path} className={baseClasses}>
            {icon && <span className="mr-2 text-[18px]">{icon}</span>}
            {title}
          </Link>
        </ul>
      </>
    );
  }

  return (
    <li className="px-4 py-2 text-slate-500 uppercase text-xs font-bold tracking-wide">
      {title}
    </li>
  );
};
