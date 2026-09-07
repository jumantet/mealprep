export const formatEuro = (amount: number) => {
  const rounded = Math.round(amount * 100) / 100;
  const digits = Number.isInteger(rounded) ? 0 : 2;
  return `€${rounded.toFixed(digits)}`;
};
