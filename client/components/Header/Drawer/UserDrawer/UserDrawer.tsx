import { Dispatch, FunctionComponent, SetStateAction, useContext, useState } from 'react';
import UserContext from '../../../../context/user-context';
import SignUp from './SignUp';
import { TransitionStyles } from '../../../../types/transition-styles';
import HeaderButton from '../../HeaderButton';
import BaseDrawer from '../BaseDrawer';
import Login from './Login';
import LogOutButton from './LogOutButton';
import Router, { useRouter } from 'next/router';
import AddIcon from '../../../icons/AddIcon';
import UserAccountIcon from '../../../icons/UserAccountIcon';

const ICON_SIZE_REM = 2;

const transitionStyles: TransitionStyles = {
    entering: { transform: 'translateX(0)' },
    entered:  { transform: 'translateX(0)' },
    exiting:  { transform: 'translateX(100%)' },
    exited:  { transform: 'translateX(100%)' },
};

type OpenModal = {
    login: Dispatch<SetStateAction<boolean>>;
    signUp: Dispatch<SetStateAction<boolean>>;
};

const UserDrawer: FunctionComponent<{ show: boolean, onClose: () => void }> = ({ show, onClose }) => {

    const [showLogin, setShowLogin] = useState<boolean>(false);
    const [showSignUp, setShowSignUp] = useState<boolean>(false);

    const { currentUser } = useContext(UserContext);
    const router = useRouter();

    const setterFuncs: OpenModal = { login: setShowLogin, signUp: setShowSignUp };


    const modalOpenHandler = (value: keyof OpenModal) => {

        Object.keys(setterFuncs).forEach(key => setterFuncs[key as keyof OpenModal](false));
        setterFuncs[value](true);
    };

    const userAccountHandler = () => {

        onClose();
        Router.push('/user');
    };

    const addRecipeHandler = () => {

        onClose();
        Router.push('/recipe/add');
    };


    return (
        <BaseDrawer show={ show } transitionStyles={ transitionStyles } className="max-h-[45vh]">
            { !currentUser && <div className='p-2 flex gap-x-1 justify-between items-center'>
                <HeaderButton onClick={() => modalOpenHandler('signUp')}>Sign Up</HeaderButton>
                <HeaderButton onClick={() => modalOpenHandler('login')} >Einloggen</HeaderButton>
            </div>}
            { currentUser && <div className='p-2 flex gap-x-1 justify-between items-center'>
                    <div className="flex gap-x-4">
                        <UserAccountIcon sizeRem={ICON_SIZE_REM} onClick={userAccountHandler}
                            disabled={router.route === '/user'}
                        />
                        <AddIcon sizeRem={ICON_SIZE_REM}
                            onClick={ addRecipeHandler } disabled={ router.route === '/recipe/add'}
                        />
                    </div>
                    <LogOutButton sizeRem={ICON_SIZE_REM} />
                </div>}
            {showLogin && <Login onLogin={() => setShowLogin(false)}/>}
            {showSignUp && <SignUp onSignup={() => setShowSignUp(false)}/>}
        </BaseDrawer>
    );
};

export default UserDrawer;