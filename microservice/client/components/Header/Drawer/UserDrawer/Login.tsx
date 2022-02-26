import { FormEvent, useState, FunctionComponent } from 'react';
import Router from 'next/router';
import useRequest from '../../../../hooks/use-request';
import Form from './Form';
import Input from './Input';

const Login: FunctionComponent = () => {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { doRequest, errors } = useRequest({
                url: '/api/users/signin',
                method: 'post', body: { email, password, username: 'username' },
                onSuccess: () => Router.push('/') } );


    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();
        doRequest();
    };

    return (
        <Form title='Einloggen' onSubmit={onSubmit}>
            <Input title='E-Mail' type='text' onChange={setEmail} value={email}/>
            <Input title='Password' type='password' onChange={setPassword} value={password}/>
            
            {errors.length > 0 && <div className='p-2 mt-2 bg-red-400 rounded shadow'>
            <h4 className='underline'>something went wrong</h4>
                {errors.map(err => <p key={err.message}>{err.message}</p>)}
            </div>}
        </Form>
    );
};

export default Login;