import { FunctionComponent } from 'react';

const RecipeThematicBreak: FunctionComponent<{name: string}> = ({ name }) => {

    return (
        <div className="w-full py-2 flex justify-center items-center bg-mandy text-white text-bold">
            <p>{name}</p>
        </div>);
};

export default RecipeThematicBreak;