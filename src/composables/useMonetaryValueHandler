const USER_CURRENCY_PREFIX = 'R$';

export function useMonetaryValueHandler() {

  const userMonetaryValueFormatter = (value) => {
    const formatted = Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${USER_CURRENCY_PREFIX} ${formatted}`;
  };

  return { userMonetaryValueFormatter };
}