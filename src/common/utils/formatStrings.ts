export const capitalize = (word: string): string => {
    const lower = word.toLowerCase();

    return lower.charAt(0).toUpperCase() + lower.slice(1);
};
