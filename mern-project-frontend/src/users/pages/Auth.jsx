import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";

import { useHttpClient } from "../../shared/hooks/useHttpClient";
import { AuthContext } from "../../shared/context/auth-context";
import Input from "../../shared/components/Input";
import ImageUpload from "../../shared/components/ImageUpload";


const Auth =  () => {
    const [placeValues, setPlaceValues] = useState({});
    const [isLoginMode, setIsLoginMode] = useState(true);
    const auth = useContext(AuthContext);
    const {sendRequest} = useHttpClient();

    const loginUrl = `${process.env.REACT_APP_BACKEND_URL}/users/login`;
    const signupUrl = `${process.env.REACT_APP_BACKEND_URL}/users/signup`;

    const navigate = useNavigate();

    const inputChangeHandler = (data) => {
        setPlaceValues((placeValues) => {return {...placeValues, ...data}});
    }

    console.log(placeValues)

    const authHandler = async (event) => {
        event?.preventDefault();
        if(isLoginMode) {
            const loggedInUser = await sendRequest(loginUrl, 'POST', {
                'Content-Type': 'application/json'
            },
            JSON?.stringify({
                email: placeValues?.email,
                password: placeValues?.password
            }),);
            if (!loggedInUser?.isError) {
                auth?.login(loggedInUser?.user);
                navigate('/');
            } 
            console.log(loggedInUser, auth);
        } else {
            const formData = new FormData()
            formData.append('name', placeValues?.name);
            formData.append('email', placeValues?.email);
            formData.append('password', placeValues?.password);
            formData.append('image', placeValues?.image);
            // FormData addes headers to the request in the browser so we don't need to add headers here.
            const signedInUser = await sendRequest(signupUrl, 'POST', {}, formData);
            if (!signedInUser?.isError) {
                auth?.login(signedInUser?.user);
                navigate('/');
            } 
            console.log(signedInUser);
        }
    } 

    return (
        <>
            <form className="w-full max-w-[400px] flex flex-col gap-y-4" onSubmit={authHandler}>
                {!isLoginMode && (
                <>
                    <Input element={"input"} type="text" label="Name" id="name" onInputChange={inputChangeHandler}/>
                    <ImageUpload id="image" onInputChange={inputChangeHandler}/>
                </>
                )}
                <Input element={"input"} type="email" label="Email Address" id="email" onInputChange={inputChangeHandler}/>
                <Input element={"input"} type="text" label="Password" id="password" onInputChange={inputChangeHandler}/>
                <button type="submit" className="border rounded-sm text-white bg-black p-2">{`${isLoginMode ? "Login" : "Sign Up"}`}</button>
            </form>
            <button className="border rounded-sm text-white bg-black p-2 w-full max-w-[400px] mt-4" onClick={() => setIsLoginMode(!isLoginMode)}>{`Switch to ${isLoginMode ? "Sign Up" : "Login"}`}</button>
        </>
    )
}

export default Auth;