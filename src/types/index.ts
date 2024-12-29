export interface Brand {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  createdBy: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  imageUrl: string;
  brandId: string;
  stock: number;
  createdBy: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}
