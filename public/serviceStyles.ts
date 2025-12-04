// app/busqueda/config/serviceStyles.ts

export interface ServiceStyle {
  color: string; // color del borde del marcador y del texto del popup
  iconUrl: string; // imagen del ícono
}

// Estilos para cada servicio
export const serviceStyles: Record<string, ServiceStyle> = {
  plomería: { color: '#00C851', iconUrl: '/Plomeria.webp' },
  electricidad: { color: '#ffbb33', iconUrl: '/Electricistas.webp' },
  carpintería: { color: '#33b5e5', iconUrl: '/Carpinteria.webp' },
  pintura: { color: '#ff4444', iconUrl: '/Pintura.webp' },
  jardinería: { color: '#2BDDE0', iconUrl: '/Jardineria.png' },
  cerrajería: { color: '#aa66cc', iconUrl: '/Cerrajeria.png' },
  albañilería: { color: '#ff8800', iconUrl: '/Albañileria.png' },
  limpieza: { color: '#00bfa5', iconUrl: '/Limpieza.webp' },
  gasfitería: { color: '#0099cc', iconUrl: '/Gasfiteria.png' },
  otros: { color: '#2B31E0', iconUrl: '/avatar.png' },
};

// Función para obtener estilo de un servicio
export function getServiceStyle(service: string): ServiceStyle {
  return serviceStyles[service.toLowerCase()] || serviceStyles.otros;
}
