import { useState } from "react";

type InputProps = {
    onUpdate: ((value: string) => void),
    isDisabled: boolean,
    title: string
}

const InputText = ({onUpdate, isDisabled, title}: InputProps) => {
    const [value, setValue] = useState('');
    const handleChange = (value: any) => {
        var result = value.target.value;
        var resultOnUpdate = '';
        resultOnUpdate = result;
        setValue(result);
        if (resultOnUpdate.length <= 0) {
            resultOnUpdate = '';
        }
        onUpdate(resultOnUpdate);
      }
    return (
        <div className="relative rounded-md border border-[#FF0033] px-3 py-2 shadow-sm focus-within:border-gray-600 focus-within:ring-1 focus-within:ring-gray-600 mb-4 mt-4">
            <label
                htmlFor="name"
                className="absolute -top-2 left-2 -mt-px inline-block bg-[#FF0033]/[90%] px-1 text-xs font-small text-gray-100"
            >
                {`${title}`}
            </label>
            <input
                type="text"
                name="name"
                id="name"
                className={`block w-full border-0 p-2 text-black-200 placeholder-gray-500 sm:text-sm bg-sfblue/10 mt-2 mb-2 outline-0`}
                placeholder="0"
                disabled={isDisabled}
                onChange={handleChange}
                value={
                   value
                }
            />
        </div>
    )
}

export default InputText;
