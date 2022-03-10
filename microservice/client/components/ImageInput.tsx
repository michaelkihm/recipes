import { FunctionComponent } from 'react';

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
                className={className}
                src={ selectedImage ? URL.createObjectURL(selectedImage) : defaultImage} />
            <input 
                type="file" 
                id="selectedFile" 
                style={{display: 'none'}} 
                onChange={event => event.target.files && onChange(event.target.files[0])}
            />
            <input 
                className='self-end p-1 bg-blue-400 text-white hover:bg-blue-200 rounded'
                type="button" 
                value="Bild suchen..." 
                onClick={() => document.getElementById('selectedFile')!.click() }/>
        </div>
    )
};

export default ImageInput;