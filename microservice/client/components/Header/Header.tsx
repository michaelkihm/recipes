import { FunctionComponent, useContext, Fragment, useState } from 'react';
import UserContext from '../../context/user-context';
import Link from 'next/link';
import UserIcon from '../icons/UserIcon';
import CheckBoxIcon from '../icons/CheckBoxIcon';
import SearchIcon from '../icons/SearchIcon';
import SearchDrawer from './SearchDrawer';


const ICON_SIZE_REM = 2;

const Header: FunctionComponent = () => {

    const { currentUser } = useContext(UserContext);
    const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
    
    return (
        <Fragment>
            <div className='w-full h-header p-2 flex flex-col justify-between items-center bg-header text-header-text'>
                <Link href="/" passHref>
                    <h1 className='text-3xl text-bold font-mono'>Recipes</h1>
                </Link>
                <div className="w-full flex justify-between items-center">
                    <div className="flex">
                        <SearchIcon sizeRem={ICON_SIZE_REM} onClick={() => setShowSearchBar(!showSearchBar)}/>
                        <CheckBoxIcon sizeRem={ICON_SIZE_REM}/>
                    </div>
                    <div className='flex items-center gap-x-2 '>
                     {!currentUser && <Link href="/auth/signup" passHref><p className='hover:underline'>Sign Up</p></Link>}
                     {!currentUser && <Link href="/auth/signin" passHref><p className='hover:underline'>Sign In</p></Link>}
                     {currentUser && <p>{currentUser.username}</p>}
                     {currentUser && <Link href="/auth/signout" passHref><p>Logout</p></Link>}
                     <UserIcon sizeRem={ICON_SIZE_REM}/>
                    </div>
                </div>
            </div>
            <SearchDrawer show={ showSearchBar } />
            {/* <div className='fixed top-1/5 bg-blue-200'>
                <h1>aldfl</h1>
                <p>asdf</p>
            </div> */}
        </Fragment>
    );
};

export default Header;