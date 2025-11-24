import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "./screens/SplashScreen";
import LoginScreen from "./screens/LoginScreen";
import Interfaz_Registrarse from "./screens/Interfaz_Registrarse";
import TabsNavegacion from "./screens/TabsNavegacion";
import Interfaz_HistorialTransacciones from "./screens/Interfaz_HistorialTransacciones";
import Interfaz_Grafica from "./screens/Interfaz_Grafica";
import Interfaz_Movimientos from "./screens/Interfaz_Movimientos"


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        <Stack.Screen name="Splash" component={SplashScreen} />

        <Stack.Screen name="Login" component={LoginScreen} />

        <Stack.Screen name="Registro" component={Interfaz_Registrarse} />

        <Stack.Screen name="Tabs" component={TabsNavegacion} />

        <Stack.Screen name="Interfaz_HistorialTransacciones" component={Interfaz_HistorialTransacciones} />

        <Stack.Screen name="Interfaz_Grafica" component={Interfaz_Grafica} />

        <Stack.Screen name="Interfaz_Movimientos" component={Interfaz_Movimientos} />


      </Stack.Navigator>
    </NavigationContainer>
  );
}
