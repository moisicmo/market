import { useLocation } from 'react-router';
import { menu } from '@/utils/menu';
import logo from '@/assets/images/logo.png';
import { SideNavCustom } from '@/components';

interface Props {
  open: boolean;
  onClose: () => void;
  isLargeScreen: boolean;
}

export const SideNav = (props: Props) => {
  const {
    open,
    onClose,
    isLargeScreen,
  } = props;
  const { pathname } = useLocation();

  const content = (
    <nav className="w-[180px] h-full px-2 py-4  shadow-md overflow-y-auto ">
      <div className="flex flex-col items-center">
        <img src={logo} alt="Logo" className="w-24 mb-4" />
        <ul className="w-full space-y-2">
          {menu().map((item) => (
            <li key={item.title}>
              {item.path ? (
                <SideNavCustom
                  active={pathname === item.path}
                  icon={item.icon}
                  path={item.path}
                  title={item.title}
                />
              ) : (
                <>
                  <p className="text-sm font-semibold uppercase mb-1">{item.title}</p>
                  {item.group?.map((element: any) => (
                    <SideNavCustom
                      key={element.title}
                      active={pathname === element.path}
                      icon={element.icon}
                      path={element.path}
                      title={element.title}
                    />
                  ))}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );

  // 👉 Sidebar permanente en pantallas grandes
  if (isLargeScreen) {
    return (
      <aside className="h-screen fixed top-0 left-0 bg-white w-[180px]  z-40">
        {content}
      </aside>

    );
  }

  // 👉 Sidebar móvil deslizante con overlay
  return (
    <>
      {!isLargeScreen && open && (
        <div className="fixed inset-0 z-40 bg-black/60" onClick={onClose}></div>
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-50 bg-white w-[190px] transform ${open ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300`}
      >
        {content}
      </aside>
    </>
  );
};
