type Unit = 'ml' | 'kg' | 'g' | 'pieces' | 'teaspoon' | 'tablespoon' | 'hands' | 'slices';
export class Ingredient {
    constructor(
        public name: string,
        public amount: number,
        public unit: Unit
    ) {}
}