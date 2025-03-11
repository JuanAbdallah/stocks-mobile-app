import { createContext, useState } from "react";
import { LoginUser } from "../../service/UserService";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);  

    const login = async (email, senha) => {
        try {
            const userData = await LoginUser(email, senha);

            
            if (userData.user && userData.token) {
                setUser({
                    ...userData.user,
                    token: userData.token
                });
            } else {
                throw new Error("Dados de usuário inválidos");
            }
        } catch (error) {
            console.error("Erro ao fazer login:", error.message);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
