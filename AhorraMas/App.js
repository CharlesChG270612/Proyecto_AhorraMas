import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "./screens/LoginScreen";
import Interfaz_Registrarse from "./screens/Interfaz_Registrarse";
import TabsNavegacion from "./screens/TabsNavegacion";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {/* Login inicial */}
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* Registro */}
        <Stack.Screen name="Registro" component={Interfaz_Registrarse} />

        {/* Home con pestañas */}
        <Stack.Screen name="Tabs" component={TabsNavegacion} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}
