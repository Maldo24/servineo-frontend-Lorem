export interface ServiceStyle {
  color: string;
  iconUrl: string;
}

export const serviceStyles: Record<string, ServiceStyle> = {
  plomería: { color: '#00C851', iconUrl: '/herrami.jpg' },
  electricidad: { color: '#ffbb33', iconUrl: '/herrami.jpg' },
  carpintería: { color: '#33b5e5', iconUrl: '/herrami.jpg' },
  pintura: { color: '#ff4444', iconUrl: '/herrami.jpg' },
  jardinería: { color: '#2BDDE0', iconUrl: '/herrami.jpg' },
  cerrajería: { color: '#aa66cc', iconUrl: '/herrami.jpg' },
  albañilería: { color: '#ff8800', iconUrl: '/herrami.jpg' },
  limpieza: { color: '#00bfa5', iconUrl: '/herrami.jpg' },
  gasfitería: { color: '#0099cc', iconUrl: '/herrami.jpg' },
  otros: { color: '#2B31E0', iconUrl: '/herrami.jpg' },
};

export function getServiceStyle(service: string): ServiceStyle {
  return serviceStyles[service.toLowerCase()] || serviceStyles.otros;
}

/*export interface ServiceStyle {
  color: string;
  iconUrl: string;
}
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

export function getServiceStyle(service: string): ServiceStyle {
  return serviceStyles[service.toLowerCase()] || serviceStyles.otros;
}
*/
