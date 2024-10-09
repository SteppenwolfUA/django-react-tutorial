import { Navigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import api from "../api"
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants"
import { useEffect, useState } from "react"

function ProtectedRoute({ children }) {
    // we need to check if we are authorized 
    // before we allow someone to access this route
    // otherwise we just need to redirect them and
    // tell them they need to log in before they can view this

    // theoretically someone could bypass this because it is
    // all frontend code 
    // but the concept is I don't want to allow someone to go to
    // route on the frontend they shouldn't be able to access
    // until they've logged in 
    // that's why I'm writing my own custom frontend protection here
    // just to make this a little bit cleaner

    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        auth().catch(() => setIsAuthorized(false));
    }, []);

    const refreshToken = async () => {
        // refresh the access token automatically

        const refreshToken = localStorage.getItem(REFRESH_TOKEN);

        try {
            // send a reqest to my backend with my refresh token
            // to get a new access token

            const res = await api.post("/api/token/refresh/", { refresh: refreshToken }); // res = response, 2nd argument is the payload
            // the trailing slash is a MUST

            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorized(true);

            } else {
                setIsAuthorized(false);
            }

        } catch (error) {
            console.log(error);
            setIsAuthorized(false);
        }
    };


    const auth = async () => {
        // checks if we need to refresh the token or if we are good to go

        // first we look at our access token, see if we have one 
        // and if we have one, check if it's expired or not
        // if it's expired we want just automatically just refresh the token
        // so that the user doesn't have to worry about anything
        // and it just happens by itself in the background

        // if we cannot refresh the token or it's expired 
        // we'll just say "Hey, no, you'r not authorized and you need to 
        // log in again by by going to that login route"

        const token = localStorage.getItem(ACCESS_TOKEN);

        if (!token) {
            setIsAuthorized(false);
            return
        }

        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp; //expiration in seconds
        const now = Date.now() / 1000; // to get the date in seconds not in milliseconds

        if (tokenExpiration < now) {
            await refreshToken();
        } else {
            setIsAuthorized(true);
            // is the token has not yet expired that means that it is valid
            // and we are good to simply say that yes 
            // it is authorized, we are good to go
        }


    };

    if (isAuthorized === null) {
        // until isAuthorized has some state, I'm loading
        // and just checking the tokens and potentially refreshing them

        return <div>Loading...</div>
    }
    return isAuthorized ? children : <Navigate to="/login" />

}

export default ProtectedRoute
