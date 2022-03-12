export const ALL_INGREDIENT_UNITS = [
    'ml' , 'kg' , 'g' , 'pieces' , 'teaspoon' , 'tablespoon' , 'hands' , 'slices'
] as const;

type Unit = typeof ALL_INGREDIENT_UNITS[number];

export interface Ingredient {
    name: string,
    amount: number,
    unit: Unit
}