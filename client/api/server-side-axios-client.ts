import axios, { AxiosRequestHeaders, AxiosInstance } from 'axios';
import { IncomingHttpHeaders } from 'http2';
import { backendUrlOnServer } from './constants';


export const buildAxiosBackendClient = (headers: IncomingHttpHeaders): AxiosInstance => {

    return axios.create({
        baseURL: backendUrlOnServer,
        headers: headers as AxiosRequestHeaders,
    });
  
};