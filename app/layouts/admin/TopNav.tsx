import { Menu, ShoppingCart } from 'lucide-react';
import { useCartStore, usePopover } from '@/hooks';
import noimage from '@/assets/images/profile.png';
import { AccountPopover } from './account.popover';

interface Props {
  onNavOpen: () => void;
  onTapCart: () => void;
}

export const TopNav = (props: Props) => {
  const {
    onNavOpen,
    onTapCart,
  } = props;
  const accountPopover = usePopover();

  const { cart } = useCartStore();

  return (
    <header className="sticky top-0 w-full bg-white z-30 shadow-sm">
      <div className="px-4 py-2 h-[56px] flex items-center justify-between">
        {/* Botón menú hamburguesa */}
        <div className="lg:hidden">
          <button
            onClick={onNavOpen}
            className="text-gray-700 focus:outline-none"
            aria-label="Abrir menú"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Este div ocupa el espacio izquierdo cuando el botón está oculto */}
        <div className="hidden lg:block w-6 h-6"></div>


        <div className="relative flex items-center gap-4">

          {/* Botón del carrito */}
          <div className="relative">
            <button
              type="button"
              onClick={onTapCart}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition relative text-gray-700"
              aria-label="Abrir carrito"
            >
              <ShoppingCart size={24} />
              {/* Badge de cantidad */}
              {
                cart.length != 0 &&
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              }
            </button>
          </div>

          {/* Avatar */}
          <div
            ref={accountPopover.anchorRef as React.RefObject<HTMLDivElement>}
            onClick={accountPopover.handleOpen}
            className="cursor-pointer w-11 h-11 rounded-full overflow-hidden border border-gray-300"
          >
            <img
              src={noimage}
              alt="User Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>


      {/* Popover */}
      <AccountPopover
        anchorEl={accountPopover.anchorRef.current}
        open={accountPopover.open}
        onClose={accountPopover.handleClose}
        onTapSettings={() => console.log('Abrir configuraciones')}
      />
    </header>
  );
};
