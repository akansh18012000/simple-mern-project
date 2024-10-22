import React from "react";
import { Link } from "react-router-dom";

const UserItem =  (props) => {
    return (
        <li className="w-[400px] border border-gray-400">
            <Link to={`${props?.id}/places`} className="flex items-center gap-x-4">
                <div className="w-full max-w-40">
                    <img src={`${process.env.REACT_APP_ASSET_URL}/${props?.image}`} alt={props?.name}/>
                </div>
                <div>
                    <h1>{props?.name}</h1>
                    {!!props?.placeCount && <p>{props?.placeCount}</p>}
                </div>
            </Link>
        </li>
    )
}

export default UserItem;