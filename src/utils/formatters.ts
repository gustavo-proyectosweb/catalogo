export const formatPrice = (amount: number, symbol: string = '$'): string => {
  // Format as $12.500 or $2.500
  const formatted = new Intl.NumberFormat('es-AR', {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${symbol}${formatted}`;
};

export const sanitizeWhatsappNumber = (phone: string): string => {
  return phone.replace(/[^0-9]/g, '');
};
