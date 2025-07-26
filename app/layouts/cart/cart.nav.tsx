import { useEffect } from "react";

interface Props {
  open: boolean;
  children: React.ReactNode;
  onClose: (state: boolean) => void;
}

export const CartDrawer = (props: Props) => {
  const {
    open,
    children,
    onClose,
  } = props;
  // Evita scroll en el fondo cuando el drawer está abierto
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <>
      {/* Overlay oscuro */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-40"
          onClick={() => onClose(false)}
        ></div>
      )}

      {/* Drawer lateral */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white backdrop-blur-md shadow-lg transform transition-transform duration-300 z-50 ${open ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="p-4 h-full overflow-y-auto">{children}</div>
      </div>
    </>
  );
};
