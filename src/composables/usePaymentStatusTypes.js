export function usePaymentStatusTypes() {
  const paymentStatusTypes = [
    { id: 1, name: 'pendente' },
    { id: 2, name: 'pago' },
    { id: 3, name: 'transferido' },
  ];

  return { paymentStatusTypes };
}