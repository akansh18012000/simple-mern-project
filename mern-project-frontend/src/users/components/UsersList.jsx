import React from "react";
import UserItem from "./UserItem";

const UsersList =  (props) => {
    return (
        <>
            {!!props?.items?.length ? (
            <ul className="flex gap-y-4 flex-col">
                {props?.items?.map((user) => <UserItem key={user?.id} id={user?.id} image={user?.image} name={user?.name} placeCount={user?.places?.length}/>)}
            </ul>): (
            <p className="text-2xl">
               No Results Found 
            </p>
            )}
        </>
    )
}

export default UsersList;