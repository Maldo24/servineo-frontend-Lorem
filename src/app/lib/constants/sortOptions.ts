export const SORT_OPTIONS = {
  DESTACADOS: 'rating',
  RECIENTES: 'recent',
  ANTIGUOS: 'oldest',
  NOMBRE_ASC: 'name_asc',
  NOMBRE_DESC: 'name_desc',
  CONTACTO_ASC: 'contact_asc',
  CONTACTO_DESC: 'contact_desc',
} as const;

export const SORT_TRANSLATION_KEYS = {
  rating: 'sortBy.featured',
  recent: 'sortBy.mostRecent',
  oldest: 'sortBy.oldest',
  name_asc: 'sortBy.nameAZ',
  name_desc: 'sortBy.nameZA',
  contact_asc: 'sortBy.contactAsc',
  contact_desc: 'sortBy.contactDesc',
} as const;

export const sortMap: Record<string, string> = {
  Destacados: SORT_OPTIONS.DESTACADOS,
  'Los más recientes': SORT_OPTIONS.RECIENTES,
  'Los más antiguos': SORT_OPTIONS.ANTIGUOS,
  'Nombre A-Z': SORT_OPTIONS.NOMBRE_ASC,
  'Nombre Z-A': SORT_OPTIONS.NOMBRE_DESC,
  'Num de contacto asc': SORT_OPTIONS.CONTACTO_ASC,
  'Num de contacto desc': SORT_OPTIONS.CONTACTO_DESC,
};

export const sortMapInverse: Record<string, string> = Object.fromEntries(
  Object.entries(sortMap).map(([key, value]) => [value, key]),
);

export const getSortValue = (backendValue: string): string => {
  return backendValue || SORT_OPTIONS.RECIENTES;
};
// funcion helper
export const getSortDisplayName = (backendValue: string): string => {
  return sortMapInverse[backendValue] || 'Los más recientes';
};
