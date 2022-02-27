/* eslint-disable max-len */
import { FunctionComponent } from 'react';
import { useRouter } from 'next/router';

const userRoute = '/user';

const UserAccountButton: FunctionComponent<{ sizeRem: number, onClick: () => void}> = ({ sizeRem, onClick }) => {

    const router = useRouter();

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"
            width={`${sizeRem}rem`} onClick={onClick}
            className={ router.route === userRoute ? 'opacity-disabled' : '' }>
                <title>Open</title>
                <path d="M384 224v184a40 40 0 01-40 40H104a40 40 0 01-40-40V168a40 40 0 0140-40h167.48M336 64h112v112M224 288L440 72"
                    fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"/>
        </svg>);
};

export default UserAccountButton;