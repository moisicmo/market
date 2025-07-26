import { Button } from "@/components/ui/button";
import { ShoppingCart, Menu } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">ImportMarket</span>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-blue-600">Inicio</a>
            <a href="#products" className="text-gray-700 hover:text-blue-600">Productos</a>
            <a href="#benefits" className="text-gray-700 hover:text-blue-600">Beneficios</a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600">Contacto</a>
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <Button className="flex items-center gap-2">
              <ShoppingCart size={18} />
              Comprar ahora
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2">
            <a href="#home" className="block text-gray-700">Inicio</a>
            <a href="#products" className="block text-gray-700">Productos</a>
            <a href="#benefits" className="block text-gray-700">Beneficios</a>
            <a href="#contact" className="block text-gray-700">Contacto</a>
            <Button className="w-full">
              <ShoppingCart size={18} />
              Comprar ahora
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}