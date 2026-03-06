import Benefits from "../layouts/public/benefits";
import CatalogSection from "../layouts/public/featured-products";
import Footer from "../layouts/public/footer";
import Hero from "../layouts/public/hero";
import Navbar from "../layouts/public/navbar";
import { PublicCartDrawer } from "../layouts/public/public-cart.drawer";
import { usePublicCart } from "@/hooks/usePublicCart";
import { useState } from "react";

export const metadata = () => {
  return [
    {
      title: 'Importadora Jhomir - Un Mundo de Ideas',
      description: 'Electrodomésticos y artículos del hogar importados. Las mejores marcas al mejor precio en Bolivia.',
      keywords: 'importadora, electrodomésticos, artículos del hogar, Bolivia, Jhomir',
    },
    {
      property: 'og:title',
      content: 'Importadora Jhomir - Un Mundo de Ideas',
    },
  ];
};

const home = () => {
  const { items, total, count, addItem, removeItem, updateQuantity, clearCart } = usePublicCart();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div>
      <Navbar cartCount={count} onOpenCart={() => setCartOpen(true)} />
      <Hero />
      <CatalogSection
        cartItems={items}
        onAddToCart={addItem}
        onOpenCart={() => setCartOpen(true)}
      />
      <Benefits />
      <Footer />
      <PublicCartDrawer
        open={cartOpen}
        items={items}
        total={total}
        onClose={() => setCartOpen(false)}
        onRemove={removeItem}
        onUpdateQuantity={updateQuantity}
        onClear={clearCart}
      />
    </div>
  );
};

export default home;
