import { FunctionComponent, useRef, useState } from 'react';
import { Transition } from 'react-transition-group';
import { TransitionStyles } from '../../types/transition-styles';
import { ALL_CATEGORIES, Category } from '@mickenhosrecipes/common/build/types/category.type';
import CheckBox from '../CheckBox';

const ANIMATE_DURATION_MS = 300;

const transitionStyles: TransitionStyles = {
    entering: { transform: 'translateX(0)' },
    entered:  { transform: 'translateX(0)' },
    exiting:  { transform: 'translateX(-100%)' },
    exited:  { transform: 'translateX(-100%)' },
};

const CategoryDrawer: FunctionComponent<{ show: boolean }> = ({ show }) => {

    const [categories, setCategories] = useState<{[key in Category]: boolean}>(initCategories());
    const nodeRef = useRef(null);

    const clickHandler = (category: Category) => setCategories({ ...categories, [category]: !categories[category] });

    return (
        <Transition in={show} timeout={ANIMATE_DURATION_MS} nodeRef={nodeRef}>
            {(state: keyof TransitionStyles) => (
                <div
                    ref={nodeRef}
                    // eslint-disable-next-line max-len
                    className="fixed w-full h-3/5 top-header z-drawer p-2 overflow-y-auto bg-header transition-transform duration-300 ease-in-out text-header-text border-t border-header-text scroll-container"
                     style={{ ...transitionStyles[state] }}>
                    {ALL_CATEGORIES.map(category => (
                        <div key={category} className="block flex items-center gap-x-1">
                            <CheckBox
                                sizeRem={1.25}
                                onClick={() => clickHandler(category)}
                                checked={categories[category]}/>
                            <p className="text-xl">{category}</p>
                        </div>
                    ))}
                </div>
            )}
        </Transition >
    );
};

export default CategoryDrawer;

const initCategories = (): {[key in Category]: boolean} => {

    return {
        arabic: false, babyFriendly: false, bbq: false,
        bowl: false, chicken: false, dessert: false, fish: false,
        forTheWeekend: false, germanMiddleEuropean: false, healthy: false,
        indian: false, italian: false, pasta: false, quick: false, salat: false,
        spanish: false, thaiViet: false, vegan: false, vegetarian: false
    };
};