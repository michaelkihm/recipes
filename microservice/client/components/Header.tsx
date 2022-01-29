import { FunctionComponent, useContext } from 'react';
import UserContext from '../context/user-context';
import Link from 'next/link';

const Header: FunctionComponent = () => {

    const { currentUser } = useContext(UserContext);
    
    return (
        <div className='w-screen h-[4rem] bg-blue-300 flex justify-between items-center px-2'>
            <Link href="/" passHref>
                <p className='text-lg text-bold'>Recipes</p>
            </Link>
            <div className='flex items-center gap-x-2 '>
             {!currentUser && <Link href="/auth/signup" passHref><p className='hover:underline'>Sign Up</p></Link>}
             {!currentUser && <Link href="/auth/signin" passHref><p className='hover:underline'>Sign In</p></Link>}
             {currentUser && <p>{currentUser.username}</p>}
             {currentUser && <Link href="/auth/signout" passHref><p>Logout</p></Link>}
            </div>
        </div>
    );
};

export default Header;