import { useState } from "react";
import { Menu, X, Phone, ShoppingCart } from "lucide-react";
import logo from "@/assets/images/logo.png";

interface Props {
  cartCount: number;
  onOpenCart: () => void;
}

export default function Navbar({ cartCount, onOpenCart }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#home" className="flex items-center">
            <img src={logo} alt="Importadora Jhomir" className="h-12 w-auto" />
          </a>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="text-gray-700 hover:text-red-600 font-medium transition-colors">Inicio</a>
            <a href="#catalog" className="text-gray-700 hover:text-red-600 font-medium transition-colors">Catálogo</a>
            <a href="#benefits" className="text-gray-700 hover:text-red-600 font-medium transition-colors">Nosotros</a>
            <a href="#contact" className="text-gray-700 hover:text-red-600 font-medium transition-colors">Contacto</a>
          </div>

          {/* Right side: cart + CTA */}
          <div className="flex items-center gap-3">
            {/* Cart button */}
            <button
              onClick={onOpenCart}
              className="relative p-2 text-gray-700 hover:text-red-600 transition-colors"
              aria-label="Ver pedido"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </button>

            {/* CTA */}
            <a
              href="#contact"
              className="hidden md:flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors"
            >
              <Phone size={16} />
              Consultar precio
            </a>

            {/* Mobile toggle */}
            <button className="md:hidden p-2 text-gray-700" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t space-y-3">
            <a href="#home" onClick={() => setIsOpen(false)} className="block px-2 py-1 text-gray-700 font-medium">Inicio</a>
            <a href="#catalog" onClick={() => setIsOpen(false)} className="block px-2 py-1 text-gray-700 font-medium">Catálogo</a>
            <a href="#benefits" onClick={() => setIsOpen(false)} className="block px-2 py-1 text-gray-700 font-medium">Nosotros</a>
            <a href="#contact" onClick={() => setIsOpen(false)} className="block px-2 py-1 text-gray-700 font-medium">Contacto</a>
          </div>
        )}
      </div>
    </nav>
  );
}
