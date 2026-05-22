export interface Size {
  name: string;
  quantity: number;
}

export interface Category {
  id: number;
  name: string;
  level: number;
  parentCategory?: Category | null;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountedPrice: number;
  discountPersent: number;
  quantity: number;
  brand: string;
  color: string;
  sizes: Size[];
  imageUrl: string;
  numRatings?: number;
  category?: Category;
  createdAt?: string;
}

export interface ProductPage {
  content: Product[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
  first: boolean;
  last: boolean;
}

export interface CreateProductRequest {
  title: string;
  description: string;
  price: number;
  discountedPrice: number;
  discountPersent: number;
  quantity: number;
  brand: string;
  color: string;
  size: Size[];
  imageUrl: string;
  topLevelCategory: string;
  secondLevelCategory: string;
  thirdLevelCategory: string;
}

export interface ProductFilters {
  category?: string;
  colors?: string[];
  sizes?: string[];
  minPrice?: number;
  maxPrice?: number;
  minDiscount?: number;
  sort?: "price_low" | "price_high";
  stock?: "in_stock" | "out_of_stock";
  pageNumber?: number;
  pageSize?: number;
}