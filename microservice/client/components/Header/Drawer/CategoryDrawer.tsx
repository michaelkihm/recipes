import { FunctionComponent, useState } from 'react';
import { TransitionStyles } from '../../../types/transition-styles';
import { ALL_CATEGORIES, Category } from '@mickenhosrecipes/common/build/types/category.type';
import CheckBox from '../../CheckBox';
import BaseDrawer from './BaseDrawer';

const transitionStyles: TransitionStyles = {
    entering: { transform: 'translateX(0)' },
    entered:  { transform: 'translateX(0)' },
    exiting:  { transform: 'translateX(-100%)' },
    exited:  { transform: 'translateX(-100%)' },
};

const CategoryDrawer: FunctionComponent<{ show: boolean }> = ({ show }) => {

    const [categories, setCategories] = useState<{[key in Category]: boolean}>(initCategories());
 
    const clickHandler = (category: Category) => setCategories({ ...categories, [category]: !categories[category] });

    return (
        <BaseDrawer show={ show } transitionStyles={ transitionStyles } className="h-3/5">
            {ALL_CATEGORIES.map(category => (
                <div key={category} className="block flex items-center gap-x-1">
                    <CheckBox
                        sizeRem={1.25}
                        onClick={() => clickHandler(category)}
                        checked={categories[category]}/>
                    <p className="text-xl">{category}</p>
                </div>
            ))}
        </BaseDrawer>);
};


const initCategories = (): {[key in Category]: boolean} => {

    return {
        arabic: false, babyFriendly: false, bbq: false,
        bowl: false, chicken: false, dessert: false, fish: false,
        forTheWeekend: false, germanMiddleEuropean: false, healthy: false,
        indian: false, italian: false, pasta: false, quick: false, salat: false,
        spanish: false, thaiViet: false, vegan: false, vegetarian: false
    };
};

export default CategoryDrawer;

