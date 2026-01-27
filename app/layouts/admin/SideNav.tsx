import { useLocation } from 'react-router';
import logo from '@/assets/images/logo.png';
import { SideNavCustom } from '@/components';
import { useMenu } from '@/hooks/useMenuStore';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const menuItems = useMenu();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});
  const toggleMenu = (title: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };


  const content = (
    <nav className="w-[210px] h-full px-2 py-4  shadow-md overflow-y-auto ">
      <div className="flex flex-col items-center">
        <img src={logo} alt="Logo" className="w-24 mb-4" />
        <ul className="w-full space-y-2">
          {menuItems.map((item) => {
            // ITEM SIMPLE
            if (item.path) {
              return (
                <SideNavCustom
                  key={item.title}
                  title={item.title}
                  icon={item.icon}
                  path={item.path}
                  active={pathname === item.path}
                />
              );
            }

            // ITEM CON SUBMENÚ
            if (item.group) {
              const isExpanded = expandedMenus[item.title];
              const isActive = item.group.some(
                (sub) => sub.path === pathname
              );

              return (
                <div key={item.title} className="space-y-1">
                  <SideNavCustom
                    title={item.title}
                    icon={item.icon}
                    active={isActive}
                    onClick={() => toggleMenu(item.title)}
                    rightIcon={
                      <ChevronRight
                        className={cn(
                          'h-4 w-4 transition-transform',
                          isExpanded && 'rotate-90'
                        )}
                      />
                    }
                  />

                  {isExpanded && (
                    <div className="ml-6 space-y-1">
                      {item.group.map((sub) => (
                        <SideNavCustom
                          key={sub.title}
                          title={sub.title}
                          path={sub.path}
                          active={pathname === sub.path}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return null;
          })}
        </ul>
      </div>
    </nav>
  );

  // 👉 Sidebar permanente en pantallas grandes
  if (isLargeScreen) {
    return (
      <aside className="h-screen fixed top-0 left-0 bg-white z-40">
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
        className={`fixed top-0 left-0 h-full z-50 bg-white w-[210px] transform ${open ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300`}
      >
        {content}
      </aside>
    </>
  );
};