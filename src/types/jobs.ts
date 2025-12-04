export type Job = {
  _id: string;
  title: string;
  description?: string;
  status?: string;
  requesterId?: string;
  fixerId?: string;
  price?: number | string;
  createdAt?: string;
  rating?: number | string;
  comment?: string;
  Ubicacion?: string;
  UbicacionOriginal?: string;
};
