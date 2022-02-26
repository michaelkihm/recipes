import { FunctionComponent, useRef } from 'react';
import { Transition } from 'react-transition-group';
import { TransitionStyles } from '../../types/transition-styles';

const ANIMATE_DURATION_MS = 300;

const transitionStyles: TransitionStyles = {
    entering: { transform: 'translateX(0)' },
    entered:  { transform: 'translateX(0)' },
    exiting:  { transform: 'translateX(-100%)' },
    exited:  { transform: 'translateX(-100%)' },
};

const SearchDrawer: FunctionComponent<{show: boolean}> = ({ show }) => {

    const nodeRef = useRef(null);

    return (
        <Transition in={show} timeout={ANIMATE_DURATION_MS} nodeRef={nodeRef}>
            {(state: keyof TransitionStyles) => (
                <div
                    ref={nodeRef}
                    // eslint-disable-next-line max-len
                    className="fixed w-full top-header p-2 bg-header transition-transform duration-300 ease-in-out text-header-text border-t border-header-text"
                     style={{ ...transitionStyles[state] }}
                >
                    <input
                        type="text"
                        placeholder="Suche..."
                        // eslint-disable-next-line max-len
                        className="w-full p-1 bg-transparent focus:shadow focus:outline-none border-b border-header-text border-dashed"/>
                </div>
            )}
        </Transition >);
};

export default SearchDrawer;