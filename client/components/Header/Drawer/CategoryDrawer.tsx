import { ALL_CATEGORIES, Category } from '@mickenhosrecipes/common/build/types/category.type';
import { FunctionComponent, useState } from 'react';
import { categoryBoolean } from '../../../types/category-boolean';
import { TransitionStyles } from '../../../types/transition-styles';
import CheckBox from '../../CheckBox';
import BaseDrawer from './BaseDrawer';

const transitionStyles: TransitionStyles = {
    entering: { transform: 'translateX(0)' },
    entered:  { transform: 'translateX(0)' },
    exiting:  { transform: 'translateX(-100%)' },
    exited:  { transform: 'translateX(-100%)' },
};

const CategoryDrawer: FunctionComponent<{ show: boolean }> = ({ show }) => {

    const [categories, setCategories] = useState<{[key in Category]: boolean}>(categoryBoolean());
 
    const clickHandler = (category: Category) => setCategories({ ...categories, [category]: !categories[category] });

    return (
        <BaseDrawer show={ show } transitionStyles={ transitionStyles } className="h-3/5">
            {ALL_CATEGORIES.map(category => (
                <div key={ category } className="block flex items-center gap-x-1">
                    <CheckBox
                        sizeRem={ 1.25 }
                        onClick={ () => clickHandler(category) }
                        checked={ categories[category] } />
                    <p className="text-xl">{category}</p>
                </div>
            ))}
        </BaseDrawer>);
};


export default CategoryDrawer;

