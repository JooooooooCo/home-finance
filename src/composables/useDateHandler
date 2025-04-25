import { useDate } from 'vuetify';
import dayjs from 'dayjs';

const USER_DATE_FORMAT = 'keyboardDate';

export function useDateHandler() {
  const dateAdapter = useDate();

  const userDateFormatter = (date) => {
    return date ? dateAdapter.format(date, USER_DATE_FORMAT) : '';
  };

  const apiDateFormatter = (date) => {
    return date ? dayjs(date).format('YYYY-MM-DD') : '';
  };

  const convertStringToDate = (stringDate) => {
    const parsed = dayjs(stringDate);
    return parsed.toDate();
  };

  const getMonthInitialEndDate = (baseDate) => {
    const year = baseDate.getFullYear();
    const month = baseDate.getMonth();
    const startDate = new Date(year, month, 1);
    const endDate = new Date(year, month + 1, 0);
    return [startDate, endDate];
  }  

  return { userDateFormatter, apiDateFormatter, convertStringToDate, getMonthInitialEndDate };
}