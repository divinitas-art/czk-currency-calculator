import { useState } from 'react';

type ItemChangeEvent = React.ChangeEvent<HTMLInputElement>
    | React.ChangeEvent<HTMLSelectElement>
    | React.ChangeEvent<HTMLTextAreaElement>;

export function useForm<T extends Record<string, any>>(initialValues: T) {
    const [values, setValues] = useState<T>(initialValues);

    function handleChange(event: ItemChangeEvent) {
        event.persist();
        let value: string | number = event.target.value;
        if (typeof values[event.target.name] === 'number') {
            value = parseFloat(value);
            if (Number.isNaN(value)) {
                value = 0;
            }
        }
        setValues(values => ({
            ...values,
            [event.target.name]: value,
        }));
    }

    return {
        handleChange,
        values,
    };
}
