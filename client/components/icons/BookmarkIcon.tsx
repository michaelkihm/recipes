import { FunctionComponent, MouseEvent } from 'react';

interface BookmarkIconProps {
    checked: boolean;
    onClick: (event: MouseEvent<SVGSVGElement, globalThis.MouseEvent>) => void;
    sizeRem: number
}

const BookmarkIcon: FunctionComponent<BookmarkIconProps> = ({ checked, onClick, sizeRem }) => {

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={ `${sizeRem}rem` }
            className={ checked ? 'fill-mandy' : 'fill-bookmark' }
            onClick={ (e) => onClick(e) }>
            <title>Bookmark</title>
            <path d="M416 480L256 357.41 96 480V32h320z" />
        </svg>);
};

export default BookmarkIcon;