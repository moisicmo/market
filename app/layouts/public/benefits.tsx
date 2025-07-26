import { Truck, Shield, DollarSign, Clock } from "lucide-react";

const benefits = [
  {
    icon: Truck,
    title: "Envío Rápido",
    description: "Entrega en 5-7 días hábiles a toda Latinoamérica"
  },
  {
    icon: Shield,
    title: "Garantía Total",
    description: "30 días de devolución sin costo adicional"
  },
  {
    icon: DollarSign,
    title: "Mejores Precios",
    description: "Hasta 40% más barato que en tiendas locales"
  },
  {
    icon: Clock,
    title: "Atención 24/7",
    description: "Soporte en español todo el día"
  }
];

export default function Benefits() {
  return (
    <section id="benefits" className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Por qué elegirnos?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map(benefit => (
            <div key={benefit.title} className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}