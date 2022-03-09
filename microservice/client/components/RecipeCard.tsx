import { FunctionComponent, MouseEvent, useState } from 'react';
import { Recipe } from '@mickenhosrecipes/common';
import Router from 'next/router';
import BookmarkIcon from './icons/BookmarkIcon';
import VeganIcon from './icons/VeganIcon';
import RecipeImage from './RecipeImage';

const BOOKMARK_ICON_SIZE_REM = 2;

const RecipeCard: FunctionComponent<{recipe: Recipe}> = ({ recipe }) => {

    const [bookmarked, setBookmarked] = useState<boolean>(false);

    const { name, image, duration, categories } = recipe;

    const handleBookmarkClick = (event: MouseEvent<SVGSVGElement, globalThis.MouseEvent>) => {
        event.stopPropagation();
        setBookmarked(!bookmarked);
    };

    return (
        <div className="relative w-card_width h-card_height shrink-0 flex flex-col justify-between bg-white shadow-lg"
            onClick={() => Router.push(`recipe/${recipe.id}`)}>
            <div className="grow">
                { image && <RecipeImage imagePath={image} name={name}
                    categories={categories} className="w-full h-[75%]"/>}
                <h3 className="pl-2 text-xl font-bold break-normal">{name}</h3>
            </div>
            <div className="p-2 flex justify-between font-bold text-gray-600">
                <div className="flex gap-x-1">
                    <p>{duration.duration}</p>
                    <p>{duration.unit}</p>
                </div>
                <BookmarkIcon checked={bookmarked} onClick={handleBookmarkClick} sizeRem={BOOKMARK_ICON_SIZE_REM}/>
            </div>

        </div>
    );
};

export default RecipeCard;