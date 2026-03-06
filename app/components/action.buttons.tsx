import { useCartStore } from '@/hooks';
import { ChevronDown, ChevronUp, Download, Pencil, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Popover, PopoverTrigger } from '.';
interface ActionButtonsProps<T extends { id?: string; userId?: string }> {
  item: T;
  onEdit?: (item: T) => void;
  onDelete?: (id: string) => void;
  onSale?: (id: string) => void;
  onDownload?: (id: string) => void;
  onPayment?: (id: string) => void;
  onSelect?: (id: string) => void;
  isSelected?: boolean;
  children?: React.ReactNode;
  isPopoverOpen?: boolean;
  disabled?: boolean;
}

export const ActionButtons = <T extends { id?: string; userId?: string }>({
  item,
  onEdit,
  onDelete,
  onSale,
  onDownload,
  onPayment,
  onSelect,
  isSelected,
  children,
  isPopoverOpen,
  disabled,
}: ActionButtonsProps<T>) => {
  const identifier = item.userId ?? item.id ?? '';
  const { cart } = useCartStore();
  const isInCart = cart.some((e) => e.productModel.id === item.id);
  return (
    <div className="flex justify-center items-center gap-3">
      {onSelect && identifier && (
        <button
          onClick={() => onSelect(identifier)}
          title="Desplegar"
          className="cursor-pointer"
        >
          {isSelected ? (
            <ChevronUp color="var(--color-black)" className="w-5 h-5" />
          ) : (
            <ChevronDown color="var(--color-black)" className="w-5 h-5" />
          )}

        </button>
      )}
      {onPayment && identifier && (
        (item as any).remainingBalance === 0 ? (
          <span className="text-success text-secondary flex items-center gap-1 text-sm">
            Sin deudas
          </span>
        ) : (
          <Popover open={isPopoverOpen} >
            <PopoverTrigger asChild>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isInCart) {
                    onPayment?.(identifier);
                  }
                }}
                size="sm"
                variant="outline"
                className="flex items-center gap-1"
                title="Agregar al carrito de pagos"
                disabled={isInCart}
              >
                <ShoppingCart className="w-5 h-5" />
                {isInCart ? "Agregado" : "Agregar"}
              </Button>
            </PopoverTrigger>
            {children}
          </Popover>
        )
      )}

      {onDownload && identifier && (
        <button onClick={() => onDownload(identifier)} title="Descargar" className="cursor-pointer">
          <Download color="var(--color-info)" className="w-5 h-5" />
        </button>
      )}
      {onSale && identifier && (
        <Button
          onClick={(e) => {
            e.stopPropagation();
            if (!isInCart && !disabled) {
              onSale?.(identifier);
            }
          }}
          size="sm"
          variant="outline"
          className="flex items-center gap-1"
          title={disabled ? 'Sin stock' : 'Agregar al carrito'}
          disabled={isInCart || disabled}
        >
          <ShoppingCart className="w-5 h-5" />
          {isInCart ? "Agregado" : disabled ? "Sin stock" : "Agregar"}
        </Button>
      )}
      {onEdit && (
        <button onClick={() => onEdit(item)} title="Editar" className="cursor-pointer">
          <Pencil color="var(--color-info)" className="w-5 h-5" />
        </button>
      )}
      {onDelete && identifier && (
        <button onClick={() => onDelete(identifier)} title="Eliminar" className="cursor-pointer">
          <Trash2 color="var(--color-error)" className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
