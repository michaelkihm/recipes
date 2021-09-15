type Unit = 'ml' | 'kg' | 'g' | 'pieces' | 'teaspoon' | 'tablespoon' | 'hands';
export class Ingredient {
    constructor(
        public name: string,
        public amount: number,
        public unit: Unit
    ) {}
}