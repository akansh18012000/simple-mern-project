import {createContext} from "react";

export const AuthContext = createContext({isLoggedIn: false, login: () => {}, logout: () => {}, userId: '', token: null})