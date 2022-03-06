import { FunctionComponent } from 'react';
import { Recipe } from '@mickenhosrecipes/common';
import Router from 'next/router';

const RecipeCard: FunctionComponent<{recipe: Recipe}> = ({ recipe }) => {

    const { name, image, duration } = recipe;

    return (
        <div className="w-card_width h-card_height shrink-0 flex flex-col justify-between bg-white shadow-lg"
            onClick={() => Router.push(`recipe/${recipe.id}`)}>
            <div className="grow">
                {image && <img src={image} alt={name} className="w-full h-[75%]"/>}
                <h3 className="pl-2 text-xl font-bold break-normal">{name}</h3>
            </div>
            <div className="p-2 flex gap-x-1 font-bold text-gray-600">
                <p>{duration.duration}</p>
                <p>{duration.unit}</p>
            </div>

        </div>
    );
};

export default RecipeCard;