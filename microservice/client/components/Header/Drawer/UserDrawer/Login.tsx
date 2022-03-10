import Router from 'next/router';
import { FormEvent, useState, FunctionComponent } from 'react';
import useRequest from '../../../../hooks/use-request';
import Form from '../../../Form';
import Input from './Input';

const Login: FunctionComponent<{onLogin: () => void }> = ({ onLogin }) => {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { doRequest, errors } = useRequest({
                url: '/api/users/signin',
                method: 'post', body: { email, password, username: 'username' },
                onSuccess: () => {
                    onLogin();
                    Router.push('/user');
                } } );


    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();
        doRequest();
    };

    return (
        <Form title='Einloggen' onSubmit={onSubmit} errors={errors}
            className="p-4 m-2 border-2 rounded border-text-header overflow-y-auto">
            <Input title='E-Mail' type='text' onChange={setEmail} value={email}/>
            <Input title='Password' type='password' onChange={setPassword} value={password}/>
        </Form>
    );
};

export default Login;