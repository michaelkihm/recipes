import { ALL_CATEGORIES } from 'models/category.type';
import { RecipeCategoryTranslatorPipe } from './recipeCategoryTranslator.pipe';

describe('RecipeCategoryTranslatorPipe',() => {

    const pipe = new RecipeCategoryTranslatorPipe();

    it('has a translation to each category',() => {

        ALL_CATEGORIES.forEach(category => {
            expect(pipe.transform(category)).withContext(`No translation for ${category}`).not.toBe('');
        });
    });
});