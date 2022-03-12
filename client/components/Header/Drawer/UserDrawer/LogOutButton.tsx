/* eslint-disable max-len */
import Link from 'next/link';
import { FunctionComponent } from 'react';

const LogOutButton: FunctionComponent<{ sizeRem: number }> = ({ sizeRem }) => {

    return (
        <Link href="/auth/signout" passHref>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={ `${sizeRem}rem` }>
                <title>Power</title>
                <path d="M378 108a191.41 191.41 0 0170 148c0 106-86 192-192 192S64 362 64 256a192 192 0 0169-148M256 64v192"
                    fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" />
            </svg>
        </Link>
    );
};

export default LogOutButton;