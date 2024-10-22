import React, {useEffect, useState} from "react";
import UsersList from "../components/UsersList";
import { useHttpClient } from "../../shared/hooks/useHttpClient";

const Users =  () => {
    const [allUsers, setAllUsers] = useState([]);
    const {sendRequest} = useHttpClient()

    const allUsersUrl = `${process.env.REACT_APP_BACKEND_URL}/users`

    useEffect(() => {
        const getUsers = async () => {
            const usersData = await sendRequest(allUsersUrl)
            if (!usersData?.isError) {
                setAllUsers(usersData?.users)
            }
            console.log(usersData);
        }
        getUsers();
    }, [])
    return (
        <div className="w-full flex justify-center">
           <UsersList items={allUsers}/>
        </div>
    )
}

export default Users;