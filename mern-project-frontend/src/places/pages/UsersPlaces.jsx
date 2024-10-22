import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/useHttpClient";
import PlacesList from "../components/PlacesList";

const UsersPlaces =  () => {
    const [allUserPlaces, setAllUserPlaces] = useState([]);
    const {userId} = useParams();
    const {sendRequest} = useHttpClient()

    const userPlacesUrl = `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
    useEffect(() => {
        const getUserPlaces = async () => {
            const userPlacesData = await sendRequest(userPlacesUrl);
            if (!userPlacesData?.isError) {
                setAllUserPlaces(userPlacesData?.places)
            }
        }
        getUserPlaces();
    }, [])
    return (
        <div className="flex justify-center w-full">
            <PlacesList items={allUserPlaces}/>
        </div>
    )
}

export default UsersPlaces;