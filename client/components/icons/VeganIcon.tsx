import { FunctionComponent } from 'react';

const VeganIcon: FunctionComponent<{ sizeRem: number }> = ({ sizeRem }) => {

    return <img src="/Vegan-Transparent.png" alt="Vegan icon" style={ { width: `${sizeRem}rem` } } />;
};

export default VeganIcon;