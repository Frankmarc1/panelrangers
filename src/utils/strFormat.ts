export const currencyFormat = (amount: number) => {
  return new Intl.NumberFormat('es-PE', {
    currency: 'PEN',
    style: 'currency',
  }).format(amount);
};

export const formatPercent = (num: number) => {
  return Number(num / 100).toLocaleString('es-PE', {
    style: 'percent',
    minimumFractionDigits: 2,
  });
};
