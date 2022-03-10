import { FunctionComponent, MouseEvent, useContext } from 'react';
import { Recipe } from '@mickenhosrecipes/common';
import Router from 'next/router';
import BookmarkIcon from './icons/BookmarkIcon';
import RecipeImage from './RecipeImage';
import UserContext from '../context/user-context';

const BOOKMARK_ICON_SIZE_REM = 2;

interface RecipeCardProps {
    recipe: Recipe;
    bookmarked: boolean;
    handleBookmark: (bookmarked: boolean) => void;
}

const RecipeCard: FunctionComponent<RecipeCardProps> = ({ recipe, bookmarked, handleBookmark }) => {

    //const [bookmarked, setBookmarked] = useState<boolean>(false);

    const { currentUser } = useContext(UserContext);

    const { name, image, duration, categories } = recipe;

    const handleBookmarkClick = (event: MouseEvent<SVGSVGElement, globalThis.MouseEvent>) => {
        event.stopPropagation();
        handleBookmark(!bookmarked);
        //setBookmarked(!bookmarked);
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
                {currentUser && <BookmarkIcon checked={bookmarked}
                    onClick={handleBookmarkClick} sizeRem={BOOKMARK_ICON_SIZE_REM}/>}
            </div>
        </div>
    );
};

export default RecipeCard;