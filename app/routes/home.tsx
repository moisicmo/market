import Benefits from "../layouts/public/benefits";
import FeaturedProducts from "../layouts/public/featured-products";
import Footer from "../layouts/public/footer";
import Hero from "../layouts/public/hero";
import Navbar from "../layouts/public/navbar";

export const metadata = () => {
  return [
    {
      title: 'ImportMarket - Productos Importados de Calidad',
      description: 'Los mejores productos internacionales con envío rápido a toda Bolivia',
      keywords: 'importados, tecnología, envío nacional, productos premium',
    },
    {
      property: 'og:title',
      content: 'ImportMarket - Productos Importados de Calidad',
    }
  ]
}

const home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <FeaturedProducts />
      <Benefits />
      <Footer />
    </div>
  );
}
export default home;