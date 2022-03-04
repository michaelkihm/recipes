import { Ingredient } from '@mickenhosrecipes/common';
import { FunctionComponent } from 'react';
import { inputStyle } from './form-styles';
import { ALL_INGREDIENT_UNITS } from '@mickenhosrecipes/common/build/types/ingredient.type';
import AddIcon from '../icons/AddIcon';
import DeleteIcon from '../icons/DeleteIcon';

interface IngredientsInputProps {
    ingredients: Ingredient[];
    setIngredients: (ingredients: Ingredient[]) => void;
}

const emptyIngredient: Ingredient = { name: '', amount: 0, unit: 'g' };

const isEmptyIngredient = (ingredient: Ingredient) => JSON.stringify(ingredient) === JSON.stringify(emptyIngredient);

export const removeEmptyIngredients = (ingredients: Ingredient[]): Ingredient[] =>
    ingredients.filter(ingredient => !isEmptyIngredient(ingredient));

const IngredientsInput: FunctionComponent<IngredientsInputProps> = ({ ingredients, setIngredients }) => {

    const ingredientsPlusOne = () => [...ingredients, ...(!ingredients.length ? [emptyIngredient] : [])];

    const plusBtnHandler = () => {
        setIngredients([...ingredients, emptyIngredient]);
    };

    const amountChangedHandler = (index: number, amount: string) => {

        const ingredientsCopy = ingredientsPlusOne();
        ingredientsCopy[index] = { ...ingredientsCopy[index], amount: +amount };
        setIngredients(ingredientsCopy);
    };

    const nameChangedHandler = (index: number, name: Ingredient['name']) => {
        const ingredientsCopy = ingredientsPlusOne();
        ingredientsCopy[index] = { ...ingredientsCopy[index], name };
        setIngredients(ingredientsCopy);
    };

    const unitChangedHandler = (index: number, unit: Ingredient['unit']) => {
        const ingredientsCopy = ingredientsPlusOne();
        ingredientsCopy[index] = { ...ingredientsCopy[index], unit };
        setIngredients(ingredientsCopy);
    };

    const removeIngredient = (index: number) => {

        const ingredientsCopy = ingredientsPlusOne();

        ingredientsCopy.splice(index,1);
        setIngredients(ingredientsCopy);
    };

    return (
        <div>
            <ul className='list-inside list-disc'>
                {ingredientsPlusOne().map((ingredient, i) => (
                    <li key={i} className="w-full my-1">
                            <input
                                type="number"
                                className={`w-2/12 ${inputStyle}`}
                                value={ingredient.amount.toString()}
                                onChange={(e) => amountChangedHandler(i, e.target.value)}
                            />
                            <select
                                className="w-2/12 bg-transparent px appearance-none"
                                value={ingredient.unit}
                                onChange={(e) => unitChangedHandler(i, e.target.value as Ingredient['unit'])}
                            >
                                    {ALL_INGREDIENT_UNITS.map(unit => <option key={unit}>{unit}</option>)}
                            </select>
                            <input
                                type="text"
                                className={`flex-1 ${inputStyle}`}
                                value={ingredient.name}
                                onChange={(e) => nameChangedHandler(i, e.target.value)}
                            />
                            <DeleteIcon onClick={() => removeIngredient(i)} sizeRem={1.25}/>
                    </li>
                ))}
            </ul>
            <div className="w-8 my-1 p-1 flex items-center justify-center bg-chenin rounded">
                <AddIcon sizeRem={1.12} onClick={plusBtnHandler}/>
            </div>
        </div>
    );
};

export default IngredientsInput;