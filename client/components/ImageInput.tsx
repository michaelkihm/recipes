import { FunctionComponent } from 'react';
import Button from './Button';

interface ImageInputProps {
    onChange: (value: File | null) => void;
    selectedImage: File | null;
    defaultImage: string;
    className?: string;
}


const ImageInput: FunctionComponent<ImageInputProps> = ({ onChange, selectedImage, defaultImage, className }) => {

    return (
        <div className="mt-2 flex gap-x-2 items-center">
            <img
                alt="no user image found"
                className={ className }
                src={ selectedImage ? URL.createObjectURL(selectedImage) : defaultImage } />
            <input
                type="file"
                id="selectedFile"
                style={ { display: 'none' } }
                onChange={ event => event.target.files && onChange(event.target.files[0]) }
            />
            <Button
                type="button"
                color="blue"
                onClick={ () => document.getElementById('selectedFile')!.click() }
                className="self-end">Bild suchen...</Button>
        </div>
    );
};

export default ImageInput;