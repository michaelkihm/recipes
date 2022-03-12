import { FunctionComponent, useRef } from 'react';
import { Transition } from 'react-transition-group';
import { TransitionStyles } from '../../../types/transition-styles';

const ANIMATE_DURATION_MS = 300;

interface BaseDrawerProps {
    show: boolean;
    transitionStyles: TransitionStyles;
    className?: string
}

const BaseDrawer: FunctionComponent<BaseDrawerProps> = ({ show, transitionStyles, children, className }) => {

    const nodeRef = useRef(null);

    return (
        <Transition in={show} timeout={ANIMATE_DURATION_MS} nodeRef={nodeRef}>
            {(state: keyof TransitionStyles) => (
                <div
                    ref={nodeRef}
                    // eslint-disable-next-line max-len
                    className={`fixed w-full top-header z-drawer p-2 overflow-y-auto bg-header transition-transform duration-300 ease-in-out text-header-text border-t border-header-text scroll-container ${className}`}
                     style={{ ...transitionStyles[state] }}
                >
                    {children}
                </div>
            )}
        </Transition >
    );
};

export default BaseDrawer;