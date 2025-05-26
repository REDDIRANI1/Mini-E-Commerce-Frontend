import { Product, ProductsResponse, Category, PromoCode } from '@/types';

const API_URL = 'https://dummyjson.com';

// Simulate network delay for development purposes
const simulateNetworkDelay = async () => {
  if (import.meta.env.DEV) {
    await new Promise(resolve => setTimeout(resolve, 300));
  }
};

export async function fetchProducts(params?: {
  limit?: number;
  skip?: number;
  category?: string;
  q?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}): Promise<ProductsResponse> {
  await simulateNetworkDelay();
  
  let url = `${API_URL}/products`;
  
  const queryParams = new URLSearchParams();
  
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.skip) queryParams.append('skip', params.skip.toString());
  
  if (params?.q) {
    url = `${API_URL}/products/search`;
    queryParams.append('q', params.q);
  }
  
  if (params?.category) {
    url = `${API_URL}/products/category/${params.category}`;
  }
  
  const fullUrl = queryParams.toString() ? `${url}?${queryParams.toString()}` : url;
  
  const response = await fetch(fullUrl);
  
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  
  const data = await response.json();
  
  // Apply client-side sorting if needed
  let products = [...data.products];
  
  if (params?.sortBy) {
    products.sort((a, b) => {
      const sortBy = params.sortBy as keyof Product;
      const order = params.order === 'desc' ? -1 : 1;
      
      if (typeof a[sortBy] === 'string') {
        return order * (a[sortBy] as string).localeCompare(b[sortBy] as string);
      }
      
      return order * ((a[sortBy] as number) - (b[sortBy] as number));
    });
  }
  
  return {
    ...data,
    products,
  };
}

export async function fetchProduct(id: number): Promise<Product> {
  await simulateNetworkDelay();
  
  const response = await fetch(`${API_URL}/products/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch product');
  }
  
  return response.json();
}

export async function fetchCategories(): Promise<string[]> {
  await simulateNetworkDelay();
  
  const response = await fetch(`${API_URL}/products/categories`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  
  return response.json();
}

export async function fetchProductsByCategory(category: string): Promise<ProductsResponse> {
  return fetchProducts({ category });
}

export async function fetchRelatedProducts(category: string, currentProductId: number): Promise<Product[]> {
  const result = await fetchProductsByCategory(category);
  return result.products.filter(product => product.id !== currentProductId).slice(0, 4);
}

// Mock data for featured categories with images
export function getFeaturedCategories(): Category[] {
  return [
    {
      id: 'smartphones',
      name: 'Smartphones',
      image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: 'laptops',
      name: 'Laptops',
      image: 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: 'fragrances',
      name: 'Fragrances',
      image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: 'skincare',
      name: 'Skincare',
      image: 'https://images.pexels.com/photos/3321416/pexels-photo-3321416.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: 'home-decoration',
      name: 'Home Decoration',
      image: 'https://images.pexels.com/photos/4846097/pexels-photo-4846097.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
    {
      id: 'furniture',
      name: 'Furniture',
      image: 'https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    },
  ];
}

// Mock promo codes
export function getPromoCodes(): PromoCode[] {
  return [
    {
      code: 'WELCOME10',
      discount: 10,
      description: '10% off your first order',
    },
    {
      code: 'SUMMER25',
      discount: 25,
      description: '25% off summer collection',
    },
    {
      code: 'FREESHIP',
      discount: 15,
      description: 'Free shipping on orders over $50',
    },
  ];
}

export function validatePromoCode(code: string): PromoCode | null {
  const promoCodes = getPromoCodes();
  return promoCodes.find((promo) => promo.code === code) || null;
}