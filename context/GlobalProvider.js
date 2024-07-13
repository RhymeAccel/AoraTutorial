import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../lib/appwrite";

const GlobalContext = createContext();

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({children}) => {
    const [loggedIn, setLoggedIn] = useState(false)
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        getCurrentUser()
        .then((res) =>{
            if (res) {
                setLoggedIn(true);
                setUser(res)
            } else {
                setLoggedIn(false);
                setUser(null);
            }
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            setLoading(false)
        })
    },[]);

    return(
        <GlobalContext.Provider
        value={{
            loggedIn,
            setLoggedIn,
            user,
            setUser,
            loading
        }}
        >
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalProvider;