import { Facebook, Instagram, Mail, Phone, MapPin } from "lucide-react";
import logo from "@/assets/images/logo.png";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Marca */}
          <div>
            <img src={logo} alt="Importadora Jhomir" className="h-20 w-auto mb-4 brightness-0 invert" />
            <p className="text-gray-400 text-sm leading-relaxed">
              Importadora Jhomir — Un Mundo de Ideas.<br />
              Electrodomésticos y artículos del hogar importados para toda Bolivia.
            </p>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <div className="space-y-3 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>+591 — consultar</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>contacto@importadorajhomir.com</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                <span>Bolivia — varias sucursales</span>
              </div>
            </div>
          </div>

          {/* Links y redes */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Síguenos</h4>
            <div className="flex gap-4 mb-6">
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
            <div className="space-y-2 text-gray-400 text-sm">
              <a href="#home" className="block hover:text-white transition-colors">Inicio</a>
              <a href="#catalog" className="block hover:text-white transition-colors">Catálogo</a>
              <a href="#benefits" className="block hover:text-white transition-colors">Nosotros</a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {year} Importadora Jhomir. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
