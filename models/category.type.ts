export const ALL_CATEGORIES = [
    'vegan' , 'vegetarian' , 'quick' , 'chicken' , 'pasta' , 'babyFriendly' ,
    'forTheWeekend' , 'salat' , 'italian' , 'spanish' , 'thaiViet' , 'indian' ,
    'healthy' , 'germanMiddleEuropean' , 'bbq' , 'dessert' , 'arabic', 'bowl',
    'fish',
] as const;

export type Category = typeof ALL_CATEGORIES[number];