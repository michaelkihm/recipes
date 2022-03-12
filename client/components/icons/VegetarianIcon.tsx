import { FunctionComponent } from 'react';

const VegetarianIcon: FunctionComponent<{ sizeRem: number }> = ({ sizeRem }) => {

    return <img src="/pngfind.com-veg-png-2108055.png" alt="Vegetarian icon" style={ { width: `${sizeRem}rem` } } />;
};

export default VegetarianIcon;