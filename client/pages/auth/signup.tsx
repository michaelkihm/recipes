import Router from 'next/router';
import { FormEvent, useState } from 'react';
import useRequest from '../../hooks/use-request';

const SignUp = (): JSX.Element => {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { doRequest, errors } = useRequest({
                url: '/api/users/signup',
                method: 'post', body: { email, password, username: 'username' },
                onSuccess: () => Router.push('/') } );


    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();
        doRequest();
    };

    return (
        <form className="p-4 m-4 border-2 rounded border-black shadow-lg" onSubmit={ onSubmit }>
            <h1 className="text-xl text-bold underline">Sign Up</h1>
            <div className="underline py-2">
                <label>Email Adress</label>
                <input type="text" value={ email } onChange={ (e) => setEmail(e.target.value) } />
            </div>
            <div>
                <label>Password</label>
                <input type="password" value={ password } onChange={ e => setPassword(e.target.value) } />
            </div>
            <button className="p-1 bg-blue-400 text-white  hover:bg-blue-200 rounded shadow m-1">
                Sign Up
            </button>
            {errors.length > 0 && <div className="bg-danger rounded shadow p-2">
                    <h4 className="underline">something went wrong</h4>
                    {errors.map(err => <p key={ err.message }>{err.message}</p>)}
                </div>}
        </form>
    );
};

export default SignUp;