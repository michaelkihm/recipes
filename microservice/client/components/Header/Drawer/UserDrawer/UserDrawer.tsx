import { FunctionComponent, useContext } from 'react';
import UserContext from '../../../../context/user-context';
import { TransitionStyles } from '../../../../types/transition-styles';
import HeaderButton from '../../HeaderButton';
import BaseDrawer from '../BaseDrawer';
import LogOutButton from './LogOutButton';
import UserAccountButton from './UserAccountButton';

const ICON_SIZE_REM = 2;

const transitionStyles: TransitionStyles = {
    entering: { transform: 'translateX(0)' },
    entered:  { transform: 'translateX(0)' },
    exiting:  { transform: 'translateX(100%)' },
    exited:  { transform: 'translateX(100%)' },
};

const UserDrawer: FunctionComponent<{ show: boolean }> = ({ show }) => {

    const { currentUser } = useContext(UserContext);

    return (
        <BaseDrawer show={ show } transitionStyles={ transitionStyles }>
            { !currentUser && <div className='p-2 flex gap-x-1 justify-between items-center'>
                <HeaderButton onClick={() => console.log('log')}>Sign Up</HeaderButton>
                <HeaderButton onClick={() => console.log('log')} >Einloggen</HeaderButton>
            </div>}
            { currentUser && <div className='p-2 flex gap-x-1 justify-between items-center'>
                    <UserAccountButton sizeRem={ICON_SIZE_REM} />
                    <LogOutButton sizeRem={ICON_SIZE_REM} />
                </div>}
        </BaseDrawer>
    );
};

export default UserDrawer;