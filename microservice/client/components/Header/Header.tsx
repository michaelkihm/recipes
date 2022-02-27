import { FunctionComponent, useContext, Fragment, useState } from 'react';
import UserContext from '../../context/user-context';
import Link from 'next/link';
import UserIcon from '../icons/UserIcon';
import CheckBoxIcon from '../icons/CheckBoxIcon';
import SearchIcon from '../icons/SearchIcon';
import SearchDrawer from './Drawer/SearchDrawer';
import CategoryDrawer from './Drawer/CategoryDrawer';
import UserDrawer from './Drawer/UserDrawer/UserDrawer';

const ICON_SIZE_REM = 2;

const Header: FunctionComponent = () => {

    const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
    const [showCategories, setShowCategories] = useState<boolean>(false);
    const [showUser, setShowUser] = useState<boolean>(false);


    const { currentUser } = useContext(UserContext);


    const iconDisabled = (name: 'search' | 'category' | 'user') => {
        
        if(!showSearchBar && !showCategories && !showUser) return false;
        if(name === 'search') return !showSearchBar;
        else if(name === 'user' ) return !showUser;
        else return !showCategories;
    };
    
    
    return (
        <Fragment>
            <div className='w-full h-header p-2 flex flex-col justify-between items-center bg-header text-header-text'>
                <Link href="/" passHref>
                    <h1 className='text-3xl text-bold font-mono'>Recipes</h1>
                </Link>
                <div className="w-full flex justify-between items-center">
                    <div className="flex">
                        <SearchIcon
                            sizeRem={ICON_SIZE_REM}
                            onClick={() => setShowSearchBar(!showSearchBar)}
                            disabled={iconDisabled('search')}
                        />
                        <CheckBoxIcon
                            sizeRem={ICON_SIZE_REM}
                            onClick={() => setShowCategories(!showCategories)}
                            disabled={iconDisabled('category')}
                        />
                    </div>
                    <div className='flex items-center gap-x-2 '>
                     {currentUser && <p>{currentUser.username}</p>}
                     <UserIcon
                        sizeRem={ICON_SIZE_REM}
                        onClick={() => setShowUser(!showUser)}
                        disabled={iconDisabled('user')}
                    />
                    </div>
                </div>
            </div>
            <SearchDrawer show={ showSearchBar } />
            <CategoryDrawer show={ showCategories } />
            <UserDrawer show={ showUser } />
        </Fragment>
    );
};

export default Header;