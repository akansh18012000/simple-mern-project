import React, {useEffect, useRef} from "react";

export const useHttpClient = () => {
    const activeHttpRequests = useRef([]);
    const sendRequest = async (url, method = "GET", headers = {}, body = null) => {
        try {
            // Aborting the request if we are moving from one page to another
            const abortRequest = new AbortController()
            activeHttpRequests.current.push(abortRequest)
            const response = await fetch(url, {
                method: method,
                headers: headers,
                body: body,
                signal: abortRequest?.signal
            });
            const responseData = await response?.json()
            if(!response?.ok) {
                throw new Error(responseData)
            }
            return responseData
        } catch (error) {
            console.log(error);
            return {
                ...error,
                isError: true,
            }
        }
    } 
    useEffect(() => {
        return () => activeHttpRequests?.current?.forEach((abortController) => abortController?.abort())
    }, [])
    return {sendRequest}
}