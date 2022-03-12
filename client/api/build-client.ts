import axios, { AxiosRequestHeaders, AxiosInstance } from 'axios';
import { NextPageContext } from 'next';
import { backendUrlOnServer } from './constants';


const buildAxiosClient = ({ req } : NextPageContext): AxiosInstance => {

    if(typeof window === 'undefined') {
        //On the server
        return axios.create({
            baseURL: backendUrlOnServer,
            headers: req?.headers as AxiosRequestHeaders,
        });
    } else {
        return axios.create({
            baseURL: '/'
        });
    }
};

export default buildAxiosClient;