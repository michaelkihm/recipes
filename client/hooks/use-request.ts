import { APIErrorResponse, ErrorResponse } from '@mickenhosrecipes/common';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';

type ReqeuestProps = {
    url: string,
    method: 'post' | 'get' | 'patch' | 'delete' | 'put',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body: {[key: string]: any}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSuccess?: (data?: any) => void
};

const useRequest = ({ url, method, body, onSuccess }: ReqeuestProps) => {

    const [errors, setErrors] = useState<ErrorResponse>([]);

    const doRequest = async () => {
        try {
            const response = await axios[method](url, body);
            setErrors([]);
            onSuccess && onSuccess(response.data);
            return response.data;
        } catch (err) {
            const error = err as AxiosError<APIErrorResponse>;
            error.response && setErrors(error.response.data.errors);
        }
    };

    return { doRequest, errors };
};

export default useRequest;