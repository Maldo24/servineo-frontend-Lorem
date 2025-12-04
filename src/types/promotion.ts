export interface Promotion {
  _id: string;
  title: string;
  description: string;
  price: number;
  offerId: string;
  fixerId: string;
  createdAt: string;
}
export interface CreatePromotion {
  title: string;
  description: string;
  offerId: string;
  price: string;
  fixerId: string;
}
