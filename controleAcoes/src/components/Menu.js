import React, { useContext, useEffect } from 'react'; 
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import LoginView from "../views/LoginView";
import HomeView from "../views/HomeView";
import CadastroView from "../views/CadastroView";
import { AuthContext } from "./context/authContext";
import { View } from "react-native"; 
import HistoricoView from '../views/HistoricoView';
import RetiradaView from '../views/RetiradaView';
import DepositoView from '../views/DepositoView';
import CarteiraView from '../views/CarteiraView';
import AvaliacaoView from '../views/AvaliacaoView';
import Dashboard from '../views/Dashboard';

const Drawer = createDrawerNavigator();

const LogoutView = ()=>{
    const {logout} = useContext(AuthContext)

    useEffect( ()=>{
        logout()
    })

    return(
        <View></View>
    )
}

const Menu = () => {
    const { user } = useContext(AuthContext);

    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName={user ? "home" : "login"}>
                {!user ? (
                    <>
                        <Drawer.Screen
                            name="login"
                            component={LoginView}
                            options={{ headerTitle: "Login" }}
                        />
                        <Drawer.Screen
                            name="cadastro"
                            component={CadastroView}
                            options={{ headerTitle: "Cadastro" }}
                        />
                        
                    </>
                ) : (
                    <>
                        <Drawer.Screen
                            name="home"
                            component={HomeView}
                            options={{ headerTitle: "Home" }}
                        />

                        <Drawer.Screen
                            name="carteira"
                            component={CarteiraView}
                            options={{ headerTitle: "Carteira" }}
                        />

                        <Drawer.Screen
                            name="depósito"
                            component={DepositoView}
                            options={{ headerTitle: "Saque" }}
                        />

                        <Drawer.Screen
                            name="retirada"
                            component={RetiradaView}
                            options={{ headerTitle: "Retirada" }}
                        />
                        
                        <Drawer.Screen
                            name="histórico"
                            component={HistoricoView}
                            options={{ headerTitle: "Histórico" }}
                        />
                        
                        <Drawer.Screen
                        name="avaliação"
                        component={AvaliacaoView}
                        options={{ headerTitle: "Histórico" }}
                        />

                        <Drawer.Screen
                            name="dashboard"
                            component={Dashboard}
                            options={{ headerTitle: "Dashboard" }}
                        />

                        <Drawer.Screen
                            name="logout"
                            component={LogoutView}
                            options={{ headerTitle: "Logout" }}
                        />
                        
                    </>
                )}
            </Drawer.Navigator>
        </NavigationContainer>
    );
};

export default Menu;
