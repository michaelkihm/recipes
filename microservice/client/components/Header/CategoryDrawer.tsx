import { FunctionComponent, useRef } from 'react';
import { Transition } from 'react-transition-group';
import { TransitionStyles } from '../../types/transition-styles';
import { ALL_CATEGORIES } from '@mickenhosrecipes/common/build/types/category.type';

const ANIMATE_DURATION_MS = 300;

const transitionStyles: TransitionStyles = {
    entering: { transform: 'translateX(0)' },
    entered:  { transform: 'translateX(0)' },
    exiting:  { transform: 'translateX(-100%)' },
    exited:  { transform: 'translateX(-100%)' },
};

const CategoryDrawer: FunctionComponent<{ show: boolean }> = ({ show }) => {

    const nodeRef = useRef(null);

    return (
        <Transition in={show} timeout={ANIMATE_DURATION_MS} nodeRef={nodeRef}>
            {(state: keyof TransitionStyles) => (
                <div
                    ref={nodeRef}
                    // eslint-disable-next-line max-len
                    className="fixed w-full top-header p-2 overflow-y-auto bg-header transition-transform duration-300 ease-in-out text-header-text border-t border-header-text"
                     style={{ ...transitionStyles[state] }}
                >
                    {ALL_CATEGORIES.map(category => <p key={category}>{category}</p>)}
                </div>
            )}
        </Transition >
    );
};

export default CategoryDrawer;