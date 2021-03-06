/* eslint-disable max-len */
import { BaseRecipe } from '@mickenhosrecipes/common';

export const user1Id = '137ce4177ef1da711f08a4f6';
export const user2Id = '1cf1dec6b41f85794acd20bc';


export const NEW_RECIPES: BaseRecipe[] = [
    {
        name: 'Spaghetti aglio',
        description: [
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco',
            'laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat',
            'non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'],
        userId: user1Id,
        categories: ['italian', 'pasta', 'vegan', 'healthy'],
        ingredients: [
            { name: 'tomatoes', amount: 2, unit: 'pieces' },
            { name: 'garlic', amount: 5, unit: 'pieces' },
            { name: 'parsley', amount: 1, unit: 'pieces' }
        ],
        duration: { duration: 100, unit: 'min' },
        image: 'images/salmon-g856c1740c_640.jpg',
    },
    {
        name: 'Burger',
        description:[
            'Lorem ipsum dolor sit amet, consectetur. Duis aute irure dolor in reprehenderit',
            'in voluptate dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat',
            'non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'],
        userId: user1Id,
        categories: ['bbq'],
        ingredients: [
            { name: 'tomatoes', amount: 2, unit: 'pieces' },
            { name: 'bread', amount: 2, unit: 'slices' },
            { name: 'salat', amount: 3, unit: 'pieces' }
        ],
        duration: { duration: 1, unit: 'min' },
        image: 'images/vegetables-g1e5fb0e84_640.jpg',
    },
    {
        name: 'Falafel',
        description: [
            'Vel pretium lectus quam id leo in vitae.',
            'Fames ac turpis egestas sed tempus urna et. Dui id ornare arcu odio ut sem nulla pharetra. ',
            'Pretium fusce id velit ut tortor pretium. Mauris augue neque gravida in fermentum et sollicitudin ac. Sed adipiscing diam donec adipiscing tristique. Viverra adipiscing at in tellus. Fusce id velit ut tortor pretium. In massa tempor nec feugiat nisl pretium. Potenti nullam ac tortor vitae purus.'],
        userId: user2Id,
        categories: ['vegan', 'arabic'],
        ingredients: [
            { name: 'chickpeas', amount: 12, unit: 'g' },
            { name: 'capsicum', amount: 7 , unit: 'pieces' },
            { name: 'tahin', amount: 1, unit: 'ml' }
        ],
        duration: { duration: 12, unit: 'min' },
        image: 'images/vegetables-g1e5fb0e84_640.jpg',
    },
    {
        name: 'Rezept',
        description: [
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, ',
            'sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            'Pretium quam vulputate dignissim suspendisse in est ante in nibh.',
            'Porta nibh venenatis cras sed felis eget velit aliquet. Dolor purus non enim praesent elementum facilisis leo vel.',
            'Sit amet mauris commodo quis imperdiet. Sem fringilla ut morbi tincidunt augue. Mattis nunc sed blandit libero. Tortor at auctor urna nunc id. Sapien eget mi proin sed libero enim sed faucibus.',
            'Massa massa ultricies mi quis hendrerit dolor magna eget. Posuere ac ut consequat semper. Ut enim blandit volutpat maecenas volutpat blandit aliquam. Aliquet bibendum enim facilisis gravida neque. Volutpat diam ut venenatis tellus in metus vulputate eu. Bibendum neque egestas congue quisque egestas diam in arcu cursus. Posuere lorem ipsum dolor sit amet consectetur adipiscing elit duis. Tincidunt nunc pulvinar sapien et ligula ullamcorper malesuada proin. Gravida rutrum quisque non tellus. Vulputate sapien nec sagittis aliquam.'],
        userId: user1Id,
        categories: ['chicken', 'forTheWeekend', 'italian', 'healthy'],
        ingredients: [
            { name: 'meat', amount: 4, unit: 'g' },
            { name: 'water', amount: 2, unit: 'ml' },
            { name: 'onion', amount: 4, unit: 'pieces' },
        ],
        duration: { duration: 90, unit: 'min' }
    }
];