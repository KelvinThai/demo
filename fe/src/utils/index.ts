import { UseToastOptions } from '@chakra-ui/react';
import moment from 'moment';
const DATE_TIME_FORMAT = 'DD/MM/YYYY HH:mm:ss';

export * from './getEnv';

export const showSortAddress = (address: string): string => {
  return `${address?.substr(0, 4)}...${address?.substr(
      address.length - 4,
      address.length - 1
  )}`
}

export const numberFormat = (number: number | string) => new Intl.NumberFormat().format(Number(number));

export const getToast = (description: string, status: UseToastOptions["status"] = 'error', title = 'Error'): UseToastOptions => {
  return { title, status, position: 'top-right', description, duration: 1000 }
}

export const showTransactionHash = (tranHash: string) => {
  return  `${tranHash?.substring(0, 10)}${"".padStart(5, '*')}${tranHash?.substring(tranHash.length -10, tranHash.length)}`    
}

export function formatDate(date: Date) {
  return moment(date).format(DATE_TIME_FORMAT);
}


export const endDate = (date: Date, days: number) => {
 return moment(date).add(days, 'days').format(DATE_TIME_FORMAT);
}