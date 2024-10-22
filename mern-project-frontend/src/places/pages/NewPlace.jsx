import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/useHttpClient";
import Input from "../../shared/components/Input";

const NewPlace =  () => {
    const [placeValues, setPlaceValues] = useState({});
    const auth = useContext(AuthContext);
    const {sendRequest} = useHttpClient();

    const navigate = useNavigate()

    const newPlaceUrl = `${process.env.REACT_APP_BACKEND_URL}/places`

    const inputChangeHandler = (data) => {
        setPlaceValues((placeValues) => {return {...placeValues, ...data}});
    }

    console.log(auth, "Auth");

    const addPlaceHandler = async (event) => {
        event?.preventDefault();
        const createdPlaceData = await sendRequest(newPlaceUrl, 'POST', {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + auth?.token}, JSON.stringify({...placeValues, creatorId: auth.userId}))
        if (!createdPlaceData?.isError) {
            navigate('/');
        }
        console.log(createdPlaceData);
    } 

    return (
       <form className="w-full max-w-[400px] flex flex-col gap-y-4" onSubmit={addPlaceHandler}>
        <Input element={"input"} type="text" label="Name of the Place" id="title" onInputChange={inputChangeHandler}/>
        <Input type="text" label="Description of the Place" id="description" onInputChange={inputChangeHandler}/>
        <Input element={"input"}  type="text" label="Address of the Place" id="address" onInputChange={inputChangeHandler}/>
        <button type="submit" className="border rounded-sm text-white bg-black p-2">Add Place</button>
       </form>
    )
}

export default NewPlace;