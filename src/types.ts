import { DocumentData } from "firebase/firestore";

export interface Product extends DocumentData {
  id?: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
  brandId: string;
  createdBy?: string;
  createdAt?: string;
}

export interface Brand extends DocumentData {
  id?: string;
  name: string;
  description: string;
  logoUrl: string;
  createdBy?: string;
  createdAt?: string;
}
