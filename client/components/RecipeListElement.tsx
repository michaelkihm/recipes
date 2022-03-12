import { Recipe } from '@mickenhosrecipes/common';
import Link from 'next/link';
import { FunctionComponent } from 'react';

const RecipeListElement: FunctionComponent<{recipe: Recipe}> = ({ recipe }) => {

    const { name, image, id } = recipe;

    return (
        <Link href={ `/recipe/${id}` } passHref>
            <div className="w-11/12 p-1 flex items-center gap-x-6 drop-shadow-lg border border-black">
                {image && <div className="w-1/4">
                    <img src={ image } alt={ name } className="h-12" />
                </div>}
                <p className="self-start font-bold">{name}</p>
            </div>
        </Link>);
};

export default RecipeListElement;