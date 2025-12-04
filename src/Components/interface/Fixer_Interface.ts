export interface Fixer {
  id: number;
  nombre: string;
  servicio: string;
  lat: number;
  lng: number;
  available: boolean; // true = disponible, false = ocupado
}
