import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore, useLogoutStore } from '@/hooks';

export const AccountPopover = ({
  anchorEl,
  onClose,
  open,
  onTapSettings
}: {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  open: boolean;
  onTapSettings: () => void;
}) => {
  const navigate = useNavigate();
  const { startLogout } = useLogoutStore();
  const { user } = useAuthStore();
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        anchorEl &&
        !anchorEl.contains(target)
      ) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, anchorEl, onClose]);

  if (!open || !anchorEl) return null;

  const rect = anchorEl.getBoundingClientRect();
  const top = rect.bottom + window.scrollY;
  const left = rect.left + window.scrollX;

  return (
    <div
      ref={popoverRef}
      className="absolute z-50 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
      style={{
        top: `${top}px`,
        left: `${left}px`,
        transform: 'translateX(-80%)',
        position: 'absolute'
      }}
    >
      <div className="py-3 px-4">
        <p className="text-xs font-semibold text-gray-500 uppercase">Cuenta</p>
        {user && (
          <p className="text-sm text-gray-700">{user.name} {user.lastName}</p>
        )}
      </div>
      <div className="border-t border-gray-200" />
      <div className="py-1 px-2 space-y-1">
        <button
          onClick={() => {
            onTapSettings();
            onClose();
          }}
          className="w-full text-left px-3 py-2 rounded-md text-sm hover:bg-gray-100"
        >
          Configuraciones
        </button>
        <button
          onClick={() => {
            startLogout();
            navigate('/');
            onClose();
          }}
          className="w-full text-left px-3 py-2 rounded-md text-sm text-red-600 hover:bg-gray-100"
        >
          Salir Sesión
        </button>
      </div>
    </div>
  );
};
