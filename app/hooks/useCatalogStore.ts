import { useState } from 'react';
import { coffeApi } from '@/services';

export interface CatalogPrice {
  id: string;
  price: number;
  typeUnit: string;
  branch: { id: string; name: string };
}

export interface CatalogProduct {
  id: string;
  name: string;
  description: string | null;
  image: string | null;
  promoPrice: number | null;
  category: { id: string; name: string };
  brand: { id: string; name: string };
  prices: CatalogPrice[];
}

export interface CatalogBranch {
  id: string;
  name: string;
  type: string;
  phone: string[];
  address?: { city?: string; zone?: string; detail?: string };
}

interface CatalogParams {
  branchId?: string;
  categoryId?: string;
  brandId?: string;
  keys?: string;
  page?: number;
  limit?: number;
}

export const useCatalogStore = () => {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [branches, setBranches] = useState<CatalogBranch[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const getProducts = async (params: CatalogParams = {}) => {
    setLoading(true);
    try {
      const { branchId = '', categoryId = '', brandId = '', keys = '', page = 1, limit = 50 } = params;
      const res = await coffeApi.get(
        `/product/catalog?branchId=${branchId}&categoryId=${categoryId}&brandId=${brandId}&keys=${keys}&page=${page}&limit=${limit}`
      );
      setProducts(res.data.data);
      setTotal(res.data.meta.total);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getBranches = async () => {
    try {
      const res = await coffeApi.get('/branch/public');
      setBranches(res.data.data);
    } catch {
      setBranches([]);
    }
  };

  return { products, branches, total, loading, getProducts, getBranches };
};
