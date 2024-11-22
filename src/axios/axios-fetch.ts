import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const fetchData = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  body?: any,
  config?: AxiosRequestConfig,
): Promise<AxiosResponse<T>> => {
  try {
    const response = await axios<T>({
      method,
      url,
      data: body,
      ...config,
    });

    return response;
  } catch (err) {
    throw err;
  }
};

const postData = <T>(url: string, body: any, config?: AxiosRequestConfig) =>
  fetchData<T>('POST', url, body, config);

const putData = <T>(url: string, body: any, config?: AxiosRequestConfig) =>
  fetchData<T>('PUT', url, body, config);

const deleteData = <T>(url: string, config?: AxiosRequestConfig) =>
  fetchData<T>('DELETE', url, undefined, config);

const getData = <T>(url: string, config?: AxiosRequestConfig) =>
  fetchData<T>('GET', url, undefined, config);

const ApiClient = {
  fetchData,
  getData,
  postData,
  putData,
  deleteData,
};

export default ApiClient;
