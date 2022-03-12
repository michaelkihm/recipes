import { Category } from '@mickenhosrecipes/common';

export const categoryBoolean = (): {[key in Category]: boolean} => {

    return {
        arabic: false, babyFriendly: false, bbq: false,
        bowl: false, chicken: false, dessert: false, fish: false,
        forTheWeekend: false, germanMiddleEuropean: false, healthy: false,
        indian: false, italian: false, pasta: false, quick: false, salat: false,
        spanish: false, thaiViet: false, vegan: false, vegetarian: false
    };
};