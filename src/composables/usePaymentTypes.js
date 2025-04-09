export function usePaymentTypes() {
  const paymentTypes = [
    { id: 1, name: 'dinheiro' },
    { id: 2, name: 'cartão' },
  ];

  return { paymentTypes };
}