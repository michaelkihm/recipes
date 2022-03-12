import { Duration } from '@mickenhosrecipes/common';
import { ALL_DURATION_UNITS } from '@mickenhosrecipes/common/build/types/duration.type';
import { FunctionComponent, useState } from 'react';
import { inputStyle } from './form-styles';

interface TimeProps {
    duration: Duration,
    setDuration: (duration: Duration) => void
}

const DurationInput: FunctionComponent<TimeProps> = ({ duration, setDuration }) => {

    const [durationNumber, setDurationNumber] = useState<string>(duration.duration.toString());
    const [unit, setUnit] = useState<Duration['unit']>(duration.unit);

    const handleDurationNumber = (value: string) => {
        setDurationNumber(value);
        setDuration({ unit, duration: +value });
    };

    const unitHandler = (value: Duration['unit']) => {
        setUnit(value);
        setDuration({ unit: value, duration: +durationNumber });
    };

    return (
        <div className="flex gap-x-1">
            <p className="font-bold">Zeit:</p>
            <input
                type="number" value={ durationNumber }
                onChange={ e => handleDurationNumber(e.target.value) }
                className={ `${inputStyle} max-w-[15%]` } placeholder="Zeit"
            />
            <select className="bg-transparent px-2 appearance-none"
                value={ unit } onChange={ e => unitHandler(e.target.value as Duration['unit']) }>
                    {ALL_DURATION_UNITS.map(unit => <option key={ unit }>{unit}</option>)}
            </select>
        </div>
    );
};

export default DurationInput;