import { createContext, useContext, useState } from "react";

const AuthContext = createContext({
    isLogged : false,
    userData : null,
    signin: () => { },
    signout: ()=>{} 
});

export const useAuthContext = () => {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [isLogged, setIsLogged] = useState(false);
    const [userData, setUserData] = useState(null);
    const signin = () => {
        
    }
    const signout = () => {
        
    }
    return (
        <AuthContext.Provider value={{isLogged, userData, signin, signout}}>
            {children}
        </AuthContext.Provider>
    )
}