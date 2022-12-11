import React, {createContext, useEffect, useState} from "react";
import { projectAuth } from "../firebase/config";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect( () =>{
       projectAuth.onAuthStateChanged(setCurrentUser);
    }, [])

    

  return (
    <AuthContext.Provider value = {{currentUser}}> {/* we pass in our current user which we get from firebase */}
        {children}
    </AuthContext.Provider>
  )
}
