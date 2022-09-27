export const currencyFormat = (value: number): string => {
    return Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
    }).format(value);
};
