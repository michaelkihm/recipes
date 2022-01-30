import { FunctionComponent } from 'react';
import { Recipe } from '@mickenhosrecipes/common';
import Image from 'next/image';
import imageLoader from '../api/image-loader';

const RecipeCard: FunctionComponent<{recipe: Recipe}> = ({ recipe }) => {

    const { name, image } = recipe;

    return (
        <div>
            <h3>{name}</h3>
            {image && <Image src={image} alt={name} width={200} height={200} loader={imageLoader} unoptimized/>}
        </div>
    );
};

export default RecipeCard;