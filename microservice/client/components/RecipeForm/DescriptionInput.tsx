import { FunctionComponent } from 'react';
import AddIcon from '../icons/AddIcon';
import DeleteIcon from '../icons/DeleteIcon';

interface DescriptionInputProps {
    description: string[];
    setDescription: (description: string[]) => void;
}

const DescriptionInput: FunctionComponent<DescriptionInputProps> = ({ description, setDescription }) => {

    const descriptionPlusOne = () => [...description, ...(!description.length ? [''] : [])];

    const handleChange = (step: string, index: number) => {

        const descriptionCopy = descriptionPlusOne();
        descriptionCopy[index] = step;
        setDescription(descriptionCopy);
    };

    const removeStep = (index: number) => {

        const descriptionCopy = descriptionPlusOne();
        descriptionCopy.splice(index,1);
        setDescription(descriptionCopy);
    };

    const plusBtnHandler = () => {
        setDescription([...description, '']);
    };

    return (
        <div>
            {descriptionPlusOne().map((step, i) => (
                <div key={i}>
                    <p className="font-bold">Schritt {i + 1}</p>
                    <div className="w-full flex gap-x-1 items-start">
                        <textarea
                            className="grow"
                            value={step}
                            onChange={(e) => handleChange(e.target.value, i)}
                            rows={4}
                        />
                        <DeleteIcon onClick={() => removeStep(i)} sizeRem={1.25}/>
                    </div>
                </div>
            ))}
            <div className="w-8 my-1 p-1 flex items-center justify-center bg-chenin rounded">
                <AddIcon sizeRem={1.12} onClick={plusBtnHandler}/>
            </div>
        </div>
    );
};

export default DescriptionInput;