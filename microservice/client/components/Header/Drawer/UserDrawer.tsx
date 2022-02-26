import { FunctionComponent } from 'react';
import { TransitionStyles } from '../../../types/transition-styles';
import BaseDrawer from './BaseDrawer';


const transitionStyles: TransitionStyles = {
    entering: { transform: 'translateX(0)' },
    entered:  { transform: 'translateX(0)' },
    exiting:  { transform: 'translateX(100%)' },
    exited:  { transform: 'translateX(100%)' },
};

const UserDrawer: FunctionComponent<{ show: boolean }> = ({ show }) => {

    return (
        <BaseDrawer show={ show } transitionStyles={ transitionStyles }>
            <p>I am the user</p>
        </BaseDrawer>
    );
};

export default UserDrawer;