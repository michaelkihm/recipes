import { Category } from '@mickenhosrecipes/common';
import { ALL_CATEGORIES } from '@mickenhosrecipes/common/build/types/category.type';
import { FunctionComponent, useEffect, useState } from 'react';
import { categoryBoolean } from '../../types/category-boolean';
import CheckBox from '../CheckBox';

interface CategoryInputProps {
    categories: Category[];
    setCategories: (category: Category[]) => void
}

const CategoryInput: FunctionComponent<CategoryInputProps> = ({ categories, setCategories }) => {

    const [selectedCategories, setSelectedCategories] = useState<{[key in Category]: boolean}>(categoryBoolean());

    useEffect(() => {
        const tempCat = { ...selectedCategories };
        categories.forEach(category => tempCat[category] = true);
        setSelectedCategories(tempCat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);

    useEffect(() => {

        const categories: Category[] = [];
        Object.entries(selectedCategories).forEach(([key, value]) => {
            if(value) categories.push(key as Category);
        });
        setCategories(categories);
    },[selectedCategories, setCategories]);

    const categorySelectHandler = (category: Category) => {
        setSelectedCategories({ ...selectedCategories, [category]: !selectedCategories[category] });

    };

    return (
        <div className="flex flex-wrap gap-x-2 gap-y-1">
            { ALL_CATEGORIES.map(category =>(
                <div
                    className={ `min-w-[25%] p-0.5 flex items-center gap-x-1 rounded-lg 
                        ${selectedCategories[category] ? 'bg-chenin' : 'bg-gray-300' } ` }
                    key={ category }
                    onClick={ () => categorySelectHandler(category) }>
                    <CheckBox sizeRem={ 1.25 } checked={ selectedCategories[category] } />
                    <p className="text-black">{category}</p>
                </div>)) }
        </div>
    );
};

export default CategoryInput;