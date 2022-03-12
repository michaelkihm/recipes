import { NextPage } from 'next';
import Router from 'next/router';
import { useEffect } from 'react';
import useRequest from '../../hooks/use-request';

const SignOut: NextPage = () => {

    const { doRequest } = useRequest({
        url: '/api/users/signout',
        method: 'post',
        body: {},
        onSuccess: () => Router.push('/')
    });
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { doRequest(); }, []);

    return <p>Signing you out...</p>;
};


export default SignOut;