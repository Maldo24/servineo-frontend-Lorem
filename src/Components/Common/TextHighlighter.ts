/**
 * Normaliza una palabra individual para crear un patrón flexible
 * que coincida con variantes de tildes y diéresis
 */
function normalizeWord(word: string): string {
  let normalized = word.toLowerCase();

  // Escapar caracteres especiales de RegExp
  normalized = normalized.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Quitar tildes del texto de búsqueda
  normalized = normalized.replace(/[ÁáÀàÂâÄäÃãÅåĀāĂăǍǎȦȧ]/g, 'a');
  normalized = normalized.replace(/[ÉéÈèÊêËëĒēĔĕĚěĖė]/g, 'e');
  normalized = normalized.replace(/[ÍíÌìÎîÏïĨĩĪīĬĭǏǐ]/g, 'i');
  normalized = normalized.replace(/[ÓóÒòÔôÖöÕõŌōŎŏǑǒȮȯ]/g, 'o');
  normalized = normalized.replace(/[ÚúÙùÛûÜüŨũŮůŪūŬŭǓǔU̇u̇]/g, 'u');

  // Crear patrón flexible que coincida con tildes
  let pattern = normalized.replace(/a/g, '[aáäàâ]');
  pattern = pattern.replace(/e/g, '[eéëèê]');
  pattern = pattern.replace(/i/g, '[iíïìî]');
  pattern = pattern.replace(/o/g, '[oóöòô]');
  pattern = pattern.replace(/u/g, '[uúüùû]');

  return pattern;
}

/**
 * Extrae palabras individuales del texto de búsqueda
 * separando por espacios, guiones, guiones bajos, puntos y comas
 */
function extractSearchWords(searchText: string): string[] {
  if (!searchText || !searchText.trim()) {
    return [];
  }

  // Dividir por separadores: espacios, guiones, guiones bajos, puntos, comas
  const words = searchText
    .trim()
    .split(/[\s\-_.,]+/)
    .filter((word) => word.length > 0);

  return words;
}

/**
 * Crea un patrón de búsqueda que coincida con cualquiera de las palabras
 */
export function createSearchPattern(searchText: string): RegExp | null {
  const words = extractSearchWords(searchText);

  if (words.length === 0) {
    return null;
  }

  // Crear patrón para cada palabra y unirlos con OR (|)
  const patterns = words.map((word) => normalizeWord(word));
  const combinedPattern = patterns.join('|');

  return new RegExp(`(${combinedPattern})`, 'gi');
}

/**
 * Resalta las coincidencias devolviendo un array de partes
 * Útil para React donde necesitas componentes en lugar de HTML string
 */
export function highlightTextParts(
  text: string,
  searchText: string,
): Array<{ text: string; highlight: boolean }> {
  if (!text || !searchText) {
    return [{ text, highlight: false }];
  }

  const pattern = createSearchPattern(searchText);
  if (!pattern) {
    return [{ text, highlight: false }];
  }

  const parts: Array<{ text: string; highlight: boolean }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Reset del regex para asegurar que empiece desde el inicio
  pattern.lastIndex = 0;

  while ((match = pattern.exec(text)) !== null) {
    // Agregar texto antes de la coincidencia
    if (match.index > lastIndex) {
      parts.push({
        text: text.slice(lastIndex, match.index),
        highlight: false,
      });
    }

    // Agregar la coincidencia resaltada
    parts.push({
      text: match[0],
      highlight: true,
    });

    lastIndex = match.index + match[0].length;
  }

  // Agregar texto restante
  if (lastIndex < text.length) {
    parts.push({
      text: text.slice(lastIndex),
      highlight: false,
    });
  }

  return parts.length > 0 ? parts : [{ text, highlight: false }];
}
