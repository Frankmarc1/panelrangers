
export const isValidName = (name: string): boolean => {
  let tmpName = name.trim();

  if (tmpName.length < 3) return false;
  if (tmpName.match(/[0-9]/)) return false;

  return true;
};
