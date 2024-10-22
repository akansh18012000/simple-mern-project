import React, {useContext} from "react";
import { Link, useNavigate} from "react-router-dom";
import { useHttpClient } from "../../shared/hooks/useHttpClient";
import { AuthContext } from "../../shared/context/auth-context";

const PlaceItem =  (props) => {
    const auth = useContext(AuthContext);
    const {sendRequest} = useHttpClient();

    const navigate = useNavigate()

    const deletePlaceUrl = `${process.env.REACT_APP_BACKEND_URL}/places/${props?.id}`

    const deletePlaceHandler = async () => {
        const deletedData = await sendRequest(deletePlaceUrl, 'DELETE', {'Authorization': 'Bearer ' + auth?.token});
        if(!deletedData?.isError) {
            navigate('/');
        }
    }

    return (
        <li className="w-[400px] border border-gray-400 flex items-center gap-x-4">
            <div className="w-full max-w-40">
                <img src={props?.image} alt={props?.title}/>
            </div>
            <div>
                <h1>{props?.title}</h1>
                <h3>{props?.description}</h3>
                <p>{props?.address}</p>
                {auth?.userId === props?.creatorId && <div className="flex items-center gap-x-4 mt-4">
                    <Link className="border rounded-sm text-white bg-black p-2" to={`/places/${props?.id}`}>Edit</Link>
                    <button className="border rounded-sm text-white bg-black p-2" onClick={deletePlaceHandler}>Delete</button>
                </div>}
            </div>
        </li>
    )
}

export default PlaceItem;