import { ArrowRight } from "lucide-react";
import logo from "@/assets/images/logo.png";

export default function Hero() {
  return (
    <section id="home" className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 pt-24 pb-16 overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-64 h-64 bg-red-500 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-yellow-500 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center gap-10">
          {/* Texto */}
          <div className="flex-1 text-center md:text-left">
            <p className="text-red-400 font-semibold text-lg mb-2 tracking-wide uppercase">
              Bienvenido a
            </p>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 leading-tight">
              Importadora<br />
              <span className="text-red-500">Jhomir</span>
            </h1>
            <p className="text-xl text-gray-300 mb-2 font-light italic">
              "Un Mundo de Ideas"
            </p>
            <p className="text-gray-400 mb-8 max-w-lg text-base">
              Electrodomésticos, tecnología y artículos del hogar importados directamente para ti.
              Encuentra los mejores precios en Bolivia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a
                href="#catalog"
                className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold text-base transition-colors"
              >
                Ver catálogo
                <ArrowRight size={18} />
              </a>
              <a
                href="#contact"
                className="flex items-center justify-center gap-2 border border-gray-400 hover:border-white text-gray-300 hover:text-white px-6 py-3 rounded-lg font-semibold text-base transition-colors"
              >
                Contactarnos
              </a>
            </div>
          </div>

          {/* Logo grande */}
          <div className="flex-shrink-0">
            <img
              src={logo}
              alt="Importadora Jhomir"
              className="w-64 md:w-80 drop-shadow-2xl brightness-0 invert"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
