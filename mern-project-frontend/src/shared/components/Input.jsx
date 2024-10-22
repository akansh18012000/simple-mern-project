import React, {useEffect, useReducer} from "react";

const inputReducer = (state, action) => {
    switch(action?.type) {
        case 'CHANGE':
            return {
                ...state,
                value: action.value,
            } 
        default:
            return state
    }
}

const Input = (props) => {
    const [inputState, dispatch] = useReducer(inputReducer, {value: props?.value || ''})

    const handleOnChange = (event) => {
        dispatch({value: event.target.value, type: "CHANGE"})
    }

    useEffect(() => {
        if(inputState?.value) {
            props?.onInputChange({
                [`${props.id}`]: `${inputState?.value}` 
            })
        }
    }, [inputState]);

    useEffect(() => {
        if(props?.value) {
            dispatch({value: props?.value, type: "CHANGE"})
        }
    }, [props?.value]);

    const element = props?.element === 'input' ? <input type={props?.type} id={props?.id} placeholder={props?.placeholder} className={`border rounded-sm bg-gray-100 focus-visible:outline-none p-1`} value={inputState?.value} onChange={handleOnChange}/> : <textarea id={props?.id} rows={props?.rows || 3} className={`border rounded-sm bg-gray-100 focus-visible:outline-none p-1`} value={inputState?.value} onChange={handleOnChange}/>

    return (<div className="flex flex-col gap-y-4">
        <label htmlFor={props?.id}>{props?.label}</label>
        {element}
    </div>)

}

export default Input;