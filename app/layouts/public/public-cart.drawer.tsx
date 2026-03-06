import { useState, useEffect } from 'react';
import { X, Minus, Plus, Trash2, ShoppingCart, Send } from 'lucide-react';
import type { PublicCartItem } from '@/hooks/usePublicCart';

// ✏️ Actualiza este número al de WhatsApp de Importadora Jhomir (formato internacional sin +)
const WHATSAPP_NUMBER = '59173735766';

interface Props {
  open: boolean;
  items: PublicCartItem[];
  total: number;
  onClose: () => void;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onClear: () => void;
}

export const PublicCartDrawer = ({
  open,
  items,
  total,
  onClose,
  onRemove,
  onUpdateQuantity,
  onClear,
}: Props) => {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState(false);

  // Bloquear scroll del fondo cuando el drawer está abierto
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const handleSendWhatsApp = () => {
    if (!name.trim()) {
      setNameError(true);
      return;
    }
    setNameError(false);

    const lines = items.map(
      item =>
        `• ${item.name} (x${item.quantity}) - Bs. ${(item.price * item.quantity).toFixed(2)}`
    );

    const message = [
      `Hola! Mi nombre es *${name.trim()}*.`,
      '',
      '*Mi pedido:*',
      ...lines,
      '',
      `*Total: Bs. ${total.toFixed(2)}*`,
    ].join('\n');

    const encoded = encodeURIComponent(message);
    window.open(`https://api.whatsapp.com/send?phone=${WHATSAPP_NUMBER}&text=${encoded}`, '_blank');

    // Limpiar carrito tras enviar
    onClear();
    setName('');
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b bg-gray-50">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-red-600" />
            <span className="font-bold text-gray-800">Mi Pedido</span>
            {items.length > 0 && (
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center py-10">
              <ShoppingCart size={48} className="mb-3 opacity-30" />
              <p className="font-medium">El pedido está vacío</p>
              <p className="text-sm mt-1">Agrega productos desde el catálogo.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <p className="font-semibold text-gray-800 text-sm leading-snug flex-1">
                      {item.name}
                    </p>
                    <button
                      onClick={() => onRemove(item.id)}
                      className="p-1 hover:bg-red-100 rounded-full text-red-400 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Controles cantidad */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-40 transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <p className="text-sm font-bold text-gray-800">
                      Bs. {(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  <p className="text-xs text-gray-400 mt-1">
                    Bs. {item.price.toFixed(2)} / {item.unit}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer: total + nombre + enviar */}
        {items.length > 0 && (
          <div className="px-4 py-4 border-t bg-gray-50 space-y-3">
            {/* Total */}
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-700">Total estimado:</span>
              <span className="text-xl font-extrabold text-red-600">
                Bs. {total.toFixed(2)}
              </span>
            </div>

            {/* Nombre */}
            <div>
              <label className="text-xs font-semibold text-gray-600 mb-1 block">
                Tu nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Ej: Juan Pérez"
                value={name}
                onChange={e => { setName(e.target.value); setNameError(false); }}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                  nameError ? 'border-red-400 bg-red-50' : 'border-gray-200'
                }`}
              />
              {nameError && (
                <p className="text-xs text-red-500 mt-1">Ingresa tu nombre para continuar.</p>
              )}
            </div>

            {/* Botón WhatsApp */}
            <button
              onClick={handleSendWhatsApp}
              className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl transition-colors shadow-md"
            >
              <Send size={18} />
              Enviar pedido por WhatsApp
            </button>

            <p className="text-xs text-gray-400 text-center">
              Se abrirá WhatsApp con tu pedido listo para enviar.
            </p>
          </div>
        )}
      </div>
    </>
  );
};
