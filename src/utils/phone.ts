export const normalizePhoneDigits = (
  value?: string | number | null
): string => {
  if (value === undefined || value === null) return '';

  return String(value).replace(/\D/g, '');
};

export const normalizePeruPhoneForSearch = (
  value?: string | number | null
): string => {
  const digits = normalizePhoneDigits(value);

  if (!digits) return '';

  if (digits.length >= 9) {
    return digits.slice(-9);
  }

  return digits;
};

export const normalizeTextForSearch = (
  value?: string | number | null
): string => {
  if (value === undefined || value === null) return '';

  return String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ');
};

export const buildSearchTerms = (
  value?: string | number | null
): string[] => {
  const normalized = normalizeTextForSearch(value);

  if (!normalized) return [];

  const words = normalized
    .split(' ')
    .map((word) => word.trim())
    .filter(Boolean);

  const terms = new Set<string>();

  words.forEach((word) => {
    if (word.length < 2) return;

    for (let i = 2; i <= word.length; i += 1) {
      terms.add(word.slice(0, i));
    }

    terms.add(word);
  });

  terms.add(normalized);

  return Array.from(terms);
};