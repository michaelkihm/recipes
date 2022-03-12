/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NEW_RECIPES } from '../../routes/__test__/data/dummy-new-recipes';
import { RecipeDoc, RecipeModel } from '../recipe.model';

describe('Recipe Model', () => {

    it('implements optimistic concurrency control', async () => {

        // Create an instance of a recipe
        const recipe = RecipeModel.build(NEW_RECIPES[0]);
        await recipe.save();

        // Fetch recipe twice
        const firstInstance = await RecipeModel.findById(recipe.id);
        const secondInstance = await RecipeModel.findById(recipe.id);

        // Make to separate changes to the recipe
        firstInstance!.set({ name: 'First Recipe' });
        secondInstance!.set({ name: 'Second Recipe' });

        // Save first fetched recipe
        await firstInstance!.save();

        // Save second fetched recipe and expect an error
        try {
            await secondInstance!.save();
        } catch {
            return;
        }
          
        throw new Error('Should have thrown an Version Error');
    });

    it('increments the version number of multiple saves', async () => {

        let foundRecipe: RecipeDoc | null = null;
        const recipe = RecipeModel.build(NEW_RECIPES[0]);
        await recipe.save();

        foundRecipe = await RecipeModel.findById(recipe.id);
        expect(foundRecipe?.version).toBe(0);

        foundRecipe!.set({ name: 'New Name' });
        await foundRecipe!.save();

        foundRecipe = await RecipeModel.findById(recipe.id);
        expect(foundRecipe?.version).toBe(1);

        await foundRecipe!.save();
        expect(foundRecipe?.version).toBe(2);
    });
});