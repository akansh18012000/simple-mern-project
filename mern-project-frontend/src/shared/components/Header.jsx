import React, {useContext} from "react";
import { AuthContext } from "../context/auth-context";
import { useNavigate } from "react-router";

const Header = () => {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();
    return (
        <div className="flex gap-x-4 justify-end w-full shadow-lg mb-4 h-[42px]">
            {auth?.isLoggedIn && (
                <>
                    <button className="border rounded-sm text-white bg-black p-2" onClick={() => navigate('/')}>All Users</button>
                    <button className="border rounded-sm text-white bg-black p-2" onClick={() => navigate('/places/new')}>Create a Place</button>
                    <button className="border rounded-sm text-white bg-black p-2" onClick={auth?.logout}>Log Out</button>
                </>
            )}
        </div>
    )

}

export default Header