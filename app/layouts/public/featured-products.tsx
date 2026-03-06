import { useEffect, useMemo, useState } from "react";
import { Search, Tag, Building2, Package, ShoppingCart, Check } from "lucide-react";
import { useCatalogStore } from "@/hooks/useCatalogStore";
import type { PublicCartItem } from "@/hooks/usePublicCart";
import noImage from "@/assets/images/no-image.webp";

interface Props {
  cartItems: PublicCartItem[];
  onAddToCart: (item: Omit<PublicCartItem, 'quantity'>) => void;
  onOpenCart: () => void;
}

export default function CatalogSection({ cartItems, onAddToCart, onOpenCart }: Props) {
  const { products, branches, loading, getProducts, getBranches } = useCatalogStore();

  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    getBranches();
    getProducts({});
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 600);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    getProducts({ branchId: selectedBranch, categoryId: selectedCategory, brandId: selectedBrand, keys: search });
  }, [selectedBranch, selectedCategory, selectedBrand, search]);

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach(p => map.set(p.category.id, p.category.name));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [products]);

  const brands = useMemo(() => {
    const map = new Map<string, string>();
    products.forEach(p => map.set(p.brand.id, p.brand.name));
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [products]);

  const getPrice = (product: typeof products[0]) => {
    if (product.prices.length === 0) return null;
    if (selectedBranch) {
      return product.prices.find(pr => pr.branch.id === selectedBranch) ?? product.prices[0];
    }
    return product.prices[0];
  };

  const isInCart = (id: string) => cartItems.some(i => i.id === id);

  return (
    <section id="catalog" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Nuestro Catálogo</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Explora todos nuestros productos importados. Filtra por sucursal para ver precios específicos.
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar producto..."
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-gray-500 mb-1">
                <Building2 size={12} /> Sucursal
              </label>
              <select
                value={selectedBranch}
                onChange={e => setSelectedBranch(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Todas las sucursales</option>
                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-gray-500 mb-1">
                <Package size={12} /> Categoría
              </label>
              <select
                value={selectedCategory}
                onChange={e => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Todas las categorías</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-1 text-xs font-semibold text-gray-500 mb-1">
                <Tag size={12} /> Marca
              </label>
              <select
                value={selectedBrand}
                onChange={e => setSelectedBrand(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Todas las marcas</option>
                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-44 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-8 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Package size={48} className="mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">No se encontraron productos</p>
            <p className="text-sm">Intenta ajustar los filtros</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map(product => {
              const price = getPrice(product);
              const inCart = isInCart(product.id);

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col"
                >
                  {/* Imagen */}
                  <div className="relative h-44 bg-gray-50 overflow-hidden flex-shrink-0">
                    <img
                      src={product.image ?? noImage}
                      alt={product.name}
                      className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      onError={e => { (e.target as HTMLImageElement).src = noImage; }}
                    />
                  </div>

                  {/* Info */}
                  <div className="p-3 flex flex-col flex-1">
                    <div className="flex gap-1 mb-1 flex-wrap">
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        {product.category.name}
                      </span>
                      <span className="text-xs bg-red-50 text-red-500 px-2 py-0.5 rounded-full">
                        {product.brand.name}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug mb-2 flex-1">
                      {product.name}
                    </p>

                    {/* Precio */}
                    {price ? (
                      <div className="mb-3">
                        <span className="text-base font-bold text-gray-900">
                          Bs. {price.price.toFixed(2)}
                        </span>
                        <p className="text-xs text-gray-400">{price.typeUnit} · {price.branch.name}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic mb-3">Consultar precio</p>
                    )}

                    {/* Botón agregar */}
                    {price?.price !== null ? (
                      inCart ? (
                        <button
                          onClick={onOpenCart}
                          className="w-full flex items-center justify-center gap-1.5 bg-green-50 border border-green-300 text-green-700 text-sm font-semibold py-2 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          <Check size={14} />
                          En el carrito
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            onAddToCart({
                              id: product.id,
                              name: product.name,
                              price: price?.price??0,
                              unit: price?.typeUnit ?? 'und.',
                            })
                          }
                          className="w-full flex items-center justify-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
                        >
                          <ShoppingCart size={14} />
                          Agregar al carrito
                        </button>
                      )
                    ) : (
                      <a
                        href="#contact"
                        className="w-full text-center text-sm text-red-600 underline py-1"
                      >
                        Consultar precio
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
