import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router';
import { ProtectedRoute } from './protected.layout';
import { SideNav } from './SideNav';
import { TopNav } from './TopNav';
import { CartDrawer } from '../cart/cart.nav';
import { CartView } from '../cart';

const AdminLayout = () => {
  const { pathname } = useLocation();
  const [openNav, setOpenNav] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const SIDENAV_WIDTH = 190;
  const [isLargeScreen, setIsLargeScreen] = useState(false);


  useEffect(() => {
    const updateSize = () => setIsLargeScreen(window.innerWidth >= 1024);
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    if (openNav) setOpenNav(false);
    if (cartOpen) setCartOpen(false);
  }, [pathname]);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <SideNav
          open={openNav}
          onClose={() => setOpenNav(false)}
          isLargeScreen={isLargeScreen}
        />

        {/* Main content */}
        <div className="flex flex-col flex-1 min-w-0">

          {/* Top Navbar */}
          <TopNav
            onNavOpen={() => setOpenNav(true)}
            onTapCart={() => setCartOpen(true)}
          />

          {/* Contenido principal */}
          <main
            className="flex-1 p-3 overflow-y-auto"
            style={{ paddingLeft: isLargeScreen ? `${SIDENAV_WIDTH}px` : undefined }}
          >
            <Outlet />
          </main>


          {/* Drawer del carrito */}
          <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)}>
            <CartView onClose={() => setCartOpen(false)} />
          </CartDrawer>


        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AdminLayout;
