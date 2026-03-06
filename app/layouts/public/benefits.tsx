import { Package, ThumbsUp, MapPin, Headphones } from "lucide-react";

const benefits = [
  {
    icon: Package,
    title: "Productos Importados",
    description: "Electrodomésticos y artículos del hogar traídos directamente del exterior con control de calidad.",
  },
  {
    icon: ThumbsUp,
    title: "Garantía de Calidad",
    description: "Todos nuestros productos pasan por verificación antes de llegar a tus manos.",
  },
  {
    icon: MapPin,
    title: "Varias Sucursales",
    description: "Encuéntranos en diferentes puntos de la ciudad para tu mayor comodidad.",
  },
  {
    icon: Headphones,
    title: "Atención Personalizada",
    description: "Nuestro equipo está disponible para asesorarte y encontrar el producto ideal.",
  },
];

export default function Benefits() {
  return (
    <section id="benefits" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">¿Por qué elegir Importadora Jhomir?</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Años de experiencia trayendo lo mejor del mundo para los hogares bolivianos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map(benefit => (
            <div key={benefit.title} className="text-center group">
              <div className="w-16 h-16 bg-red-50 group-hover:bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                <benefit.icon className="w-8 h-8 text-red-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">{benefit.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
