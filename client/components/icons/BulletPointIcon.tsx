import { FunctionComponent } from 'react';

const BulletPointIcon: FunctionComponent<{sizeRem?: number}> = ({ sizeRem = 0.5 }) => {

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={ `${sizeRem}rem` }>
            <title>Ellipse</title>
            <path d="M256 464c-114.69 0-208-93.31-208-208S141.31 48 256 48s208 93.31 208 208-93.31 208-208 208z" />
        </svg>);
};

export default BulletPointIcon;