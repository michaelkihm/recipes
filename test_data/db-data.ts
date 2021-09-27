/* eslint-disable max-len */
import { Recipe } from '../models/recipe.model';

export const RECIPES: Recipe[] = [
    {
        name: 'Spaghetti aglio',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        createdBy: 'user1',
        id: '6151e30732820d7c71705f24',
        category: ['italian', 'pasta'],
        ingredients: [
            { name: 'tomatoes', amount: 2, unit: 'pieces' },
            { name: 'garlic', amount: 5, unit: 'pieces' },
            { name: 'parsley', amount: 1, unit: 'pieces' }
        ],
        duration: { duration: 100, unit: 'min' }
    },
    {
        name: 'Burger',
        description: 'Lorem ipsum dolor sit amet, consectetur. Duis aute irure dolor in reprehenderit in voluptate dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        createdBy: 'user1',
        id: '6151e310f525051cccd70219',
        category: ['bbq'],
        ingredients: [
            { name: 'tomatoes', amount: 2, unit: 'pieces' },
            { name: 'bread', amount: 2, unit: 'slices' },
            { name: 'salat', amount: 3, unit: 'pieces' }
        ],
        duration: { duration: 1, unit: 'min' }
    },
    {
        name: 'Falafel',
        description: 'Vel pretium lectus quam id leo in vitae. Fames ac turpis egestas sed tempus urna et. Dui id ornare arcu odio ut sem nulla pharetra. Pretium fusce id velit ut tortor pretium. Mauris augue neque gravida in fermentum et sollicitudin ac. Sed adipiscing diam donec adipiscing tristique. Viverra adipiscing at in tellus. Fusce id velit ut tortor pretium. In massa tempor nec feugiat nisl pretium. Potenti nullam ac tortor vitae purus.',
        createdBy: 'user2',
        id: '6151e318a81f71122c95f756',
        category: ['vegan', 'arabic'],
        ingredients: [
            { name: 'chickpeas', amount: 12, unit: 'g' },
            { name: 'capsicum', amount: 7 , unit: 'pieces' },
            { name: 'tahin', amount: 1, unit: 'ml' }
        ],
        duration: { duration: 12, unit: 'min' }
    },
    {
        name: 'Recipe',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Pretium quam vulputate dignissim suspendisse in est ante in nibh. Porta nibh venenatis cras sed felis eget velit aliquet. Dolor purus non enim praesent elementum facilisis leo vel. Sit amet mauris commodo quis imperdiet. Sem fringilla ut morbi tincidunt augue. Mattis nunc sed blandit libero. Tortor at auctor urna nunc id. Sapien eget mi proin sed libero enim sed faucibus. Massa massa ultricies mi quis hendrerit dolor magna eget. Posuere ac ut consequat semper. Ut enim blandit volutpat maecenas volutpat blandit aliquam. Aliquet bibendum enim facilisis gravida neque. Volutpat diam ut venenatis tellus in metus vulputate eu. Bibendum neque egestas congue quisque egestas diam in arcu cursus. Posuere lorem ipsum dolor sit amet consectetur adipiscing elit duis. Tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin. Gravida rutrum quisque non tellus. Vulputate sapien nec sagittis aliquam.',
        createdBy: 'user4',
        id: '6151e322116c1ac97aadd5f8',
        category: ['chicken', 'forTheWeekend'],
        ingredients: [
            { name: 'meat', amount: 4, unit: 'g' },
            { name: 'water', amount: 2, unit: 'ml' },
            { name: 'onion', amount: 4, unit: 'pieces' },
        ],
        duration: { duration: 90, unit: 'min' }
    }
];