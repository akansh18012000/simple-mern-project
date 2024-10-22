import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/useHttpClient";
import Input from "../../shared/components/Input";

const UpdatePlace =  () => {
    const [placeValues, setPlaceValues] = useState({});
    const auth = useContext(AuthContext)

    const {placeId} = useParams();
    const navigate = useNavigate()

    const {sendRequest} = useHttpClient()

    const updatePlaceUrl = `${process.env.REACT_APP_BACKEND_URL}/places/${placeId}`

    const inputChangeHandler = (data) => {
        setPlaceValues((placeValues) => {return {...placeValues, ...data}});
    }

    useEffect(() => {
        const getPlaceById = async () => {
            const placeData = await sendRequest(updatePlaceUrl);
            if (!placeData?.isError) {
                setPlaceValues(placeData?.place)
            }
        }
        getPlaceById();
    }, []);

    const updatePlaceHandler = async (event) => {
        event?.preventDefault()
        const updatedPlaceData = await sendRequest(updatePlaceUrl, 'PATCH',  {'Content-Type': 'application/json', 'Authorization': 'Bearer ' + auth?.token}, JSON.stringify({...placeValues}));
        if(!updatedPlaceData?.isError) {
            navigate(`/${auth?.userId}/places`);
        }
        console.log(updatedPlaceData);
    } 

    return (
       <form className="w-full max-w-[400px] flex flex-col gap-y-4" onSubmit={updatePlaceHandler}>
        <Input element={"input"} type="text" label="Name of the Place" id="title" onInputChange={inputChangeHandler} value={placeValues?.title}/>
        <Input type="text" label="Description of the Place" id="description" onInputChange={inputChangeHandler} value={placeValues?.description}/>
        <button type="submit" className="border rounded-sm text-white bg-black p-2">Update Place</button>
       </form>
    )
}

export default UpdatePlace;