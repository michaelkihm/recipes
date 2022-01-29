import axios, { AxiosRequestHeaders, AxiosInstance } from 'axios';
import { NextPageContext } from 'next';


const buildAxiosClient = ({ req } : NextPageContext): AxiosInstance => {

    if(typeof window === 'undefined') {
        //On the server
        return axios.create({
            baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req?.headers as AxiosRequestHeaders,
        });
    } else {
        return axios.create({
            baseURL: '/'
        });
    }
};

export default buildAxiosClient;