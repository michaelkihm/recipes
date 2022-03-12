import { FunctionComponent } from 'react';
import { TransitionStyles } from '../../../types/transition-styles';
import BaseDrawer from './BaseDrawer';


const transitionStyles: TransitionStyles = {
    entering: { transform: 'translateX(0)' },
    entered:  { transform: 'translateX(0)' },
    exiting:  { transform: 'translateX(-100%)' },
    exited:  { transform: 'translateX(-100%)' },
};

const SearchDrawer: FunctionComponent<{show: boolean}> = ({ show }) => {

    return (
        <BaseDrawer show={ show } transitionStyles={ transitionStyles }>
            <input
                type="text"
                placeholder="Suche..."
                // eslint-disable-next-line max-len
                className="w-full p-1 bg-transparent focus:shadow focus:outline-none border-b border-header-text border-dashed"
            />
        </BaseDrawer>
    );
};

export default SearchDrawer;

