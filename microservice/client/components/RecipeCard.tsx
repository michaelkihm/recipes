import { FunctionComponent } from 'react';
import { Recipe } from '@mickenhosrecipes/common';
import Image from 'next/image';
import imageLoader from '../api/image-loader';
import Router from 'next/router';

const RecipeCard: FunctionComponent<{recipe: Recipe}> = ({ recipe }) => {

    const { name, image } = recipe;

    return (
        <div>
            <h3 onClick={() => Router.push(`recipe/${recipe.id}`)}>{name}</h3>
            <p>{recipe.id}</p>
            {image && <Image src={image} alt={name} width={200} height={200} loader={imageLoader} unoptimized/>}
        </div>
    );
};

export default RecipeCard;