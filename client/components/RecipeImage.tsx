import { Category } from '@mickenhosrecipes/common';
import { FunctionComponent } from 'react';
import VeganIcon from './icons/VeganIcon';
import VegetarianIcon from './icons/VegetarianIcon';

interface RecipeImageProps {
    iconSizeRem?: number,
    imagePath: string,
    categories: Category[],
    className?: string,
    name: string
}

const RecipeImage: FunctionComponent<RecipeImageProps> = (
        { iconSizeRem = 2, imagePath, categories, className, name }) => {

    const displayVeganIcon = () => categories.includes('vegan');

    const displayVegetarianIcon = () => !displayVeganIcon() && categories.includes('vegetarian');

    return (
        <div className="relative">
            { displayVeganIcon() && <div className="absolute top-2 left-2">
                <VeganIcon sizeRem={iconSizeRem}/>
            </div>}
            { displayVegetarianIcon() && <div className="absolute top-2 left-2">
                <VegetarianIcon sizeRem={iconSizeRem}/>
            </div>}
            <img src={imagePath} alt={name} className={ className }/>
        </div>
    );
};

export default RecipeImage;