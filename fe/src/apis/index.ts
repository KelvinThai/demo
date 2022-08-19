import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import queryString from 'query-string';
import { getApiEndpoint } from '../utils';

const headers: Readonly<Record<string, string | boolean>> = {
  Accept: 'application/json',
  'Content-Type': 'application/json; charset=utf-8',
  'Access-Control-Allow-Credentials': true,
  'X-Requested-With': 'XMLHttpRequest'
};

const axiosInstance = axios.create({
  baseURL: getApiEndpoint(),
  headers,
  paramsSerializer: (params) => queryString.stringify(params)
});

axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export const depositService = async (address: string, amount: number, transaction_id: string) => {
  const rp = await axiosInstance.post('vauls/deposit', {address, amount, transaction_id});
  return rp.data;
}

export const withdrawService = async( address: string, amount: number) => {
  const rp = await axiosInstance.post('vauls/withdraw', {address, amount});
  return rp.data;
}