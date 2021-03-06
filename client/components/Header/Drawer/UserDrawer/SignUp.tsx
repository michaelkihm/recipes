import Router from 'next/router';
import { FormEvent, FunctionComponent, useState } from 'react';
import useRequest from '../../../../hooks/use-request';
import Form from '../../../Form';
import ImageInput from '../../../ImageInput';
import Input from './Input';

const defaultImage = '/api/users/images/profile-dummy.jpg';

const SignUp: FunctionComponent<{ onSignup: () => void }> = ({ onSignup }) => {

    const [email, setEmail] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [password1, setPassword1] = useState<string>('');
    const [password2, setPassword2] = useState<string>('');
    const [passwordsEqual, setPasswordsEqual] = useState<boolean>(true);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    
    const { doRequest, errors } = useRequest({
                url: '/api/users/signup',
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                method: 'post', body: createFormData(email, username, password1, selectedImage),
                onSuccess: () => {
                    onSignup();
                    Router.push('/');
                } } );


    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if(password1 !== password2) {
            setPasswordsEqual(false);
            return;
        } setPasswordsEqual(true);

        doRequest();
    };

    return (
        <Form onSubmit={ onSubmit } title="SignUp" errors={ errors }
            className="p-4 m-2 border-2 rounded border-text-header overflow-y-auto">
            <Input title="E-Mail" onChange={ setEmail } value={ email } type="text" />
            <Input title="Benutzer" onChange={ setUsername } value={ username } type="text" />
            <Input title="Passwort" onChange={ setPassword1 } value={ password1 } type="password" />
            <Input title="Passwort" onChange={ setPassword2 } value={ password2 } type="password" />
            {!passwordsEqual && <p className="p-1 mt-2 bg-danger">Passw??rter stimmen nicht ??berein</p>}
            <ImageInput
                selectedImage={ selectedImage }
                onChange={ setSelectedImage } defaultImage={ defaultImage } className="w-6/12" />
            <hr className="mt-2" />
        </Form>
    );
};

const createFormData = (email: string, username: string, password: string, image: File | null) => {

    const userFormData = new FormData();

    userFormData.append('email', email);
    userFormData.append('username', username);
    userFormData.append('password', password);
    userFormData.append('image', image || '');

    return userFormData;
};

export default SignUp;