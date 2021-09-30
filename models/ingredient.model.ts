export const ALL_INGREDIENT_UNITS = [
    'ml' , 'kg' , 'g' , 'pieces' , 'teaspoon' , 'tablespoon' , 'hands' , 'slices'
] as const;

type Unit = typeof ALL_INGREDIENT_UNITS[number];
export class Ingredient {
    constructor(
        public name: string,
        public amount: number,
        public unit: Unit
    ) {}
}