import { Pipe, PipeTransform } from '@angular/core';
import { Category } from 'models/category.type';

@Pipe({
    name: 'recipeCategoryTranslator',
    pure: false
})
export class RecipeCategoryTranslatorPipe implements PipeTransform {

    transform(value: Category): string {
        
        switch(value){
            case 'arabic': return 'Arabisch';
            case 'babyFriendly': return 'Für Babys';
            case 'bbq': return 'BBQ';
            case 'bowl': return 'Bowl';
            case 'chicken': return 'Geflügel';
            case 'dessert': return 'Dessert';
            case 'fish': return 'Fisch';
            case 'forTheWeekend': return 'Fürs Wochenende';
            case 'germanMiddleEuropean': return 'Deutsch/Österreichisch';
            case 'healthy': return 'Gesund';
            case 'indian': return 'Indisch';
            case 'italian': return 'Italienisch';
            case 'pasta': return 'Pasta';
            case 'quick': return 'Schnell gemacht';
            case 'salat': return 'Salat';
            case 'spanish': return 'Spanisch';
            case 'thaiViet': return 'Thailändisches/Vietnamesisch';
            case 'vegan': return 'Vegan';
            case 'vegetarian': return 'Vegetarisch';

            default: return '';
        }
    }
}