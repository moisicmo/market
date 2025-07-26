import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ShoppingCart } from "lucide-react";

const products = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    price: "$1,299",
    image: "https://images.unsplash.com/photo-1592286618771-82a8ae5d6c8c?w=400",
    rating: 4.8
  },
  {
    id: 2,
    name: "MacBook Air M3",
    price: "$1,099",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    rating: 4.9
  },
  {
    id: 3,
    name: "AirPods Pro 2",
    price: "$249",
    image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400",
    rating: 4.7
  }
];

export default function FeaturedProducts() {
  return (
    <section id="products" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Productos Destacados</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Los productos más solicitados directo desde USA y Europa
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map(product => (
            <Card key={product.id} className="overflow-hidden">
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span>{product.name}</span>
                  <span className="text-blue-600">{product.price}</span>
                </CardTitle>
                <CardDescription className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  {product.rating} (120+ reviews)
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button className="w-full">
                  <ShoppingCart className="mr-2" size={16} />
                  Agregar al carrito
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}