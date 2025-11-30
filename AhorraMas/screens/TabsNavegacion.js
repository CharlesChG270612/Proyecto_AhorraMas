
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from "react-native";

import Interfaz_Inicio from "./Interfaz_Inicio";
import StackPresupuestos from "./StackPresupuestos";
import Interfaz_Grafica from "./Interfaz_Grafica";
import Interfaz_Perfil from "./Interfaz_Perfil";

const Tab = createBottomTabNavigator();

export default function TabsNavegacion({ route }) {
  const {
    nombre,
    email,
    telefono,
    userId,
  } = route?.params || {};

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={Interfaz_Inicio}
        options={{
          tabBarIcon: () => (
            <Image
              source={require("../assets/iconos/inicio.png")}
              style={{ width: 25, height: 25 }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Historial"
        component={() => null}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("Interfaz_HistorialTransacciones");
          },
        })}
        options={{
          tabBarIcon: () => (
            <Image
              source={require("../assets/iconos/historial-de-transacciones.png")}
              style={{ width: 25, height: 25 }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Presupuestos"
        component={StackPresupuestos}
        options={{
          tabBarIcon: () => (
            <Image
              source={require("../assets/iconos/presupuesto.png")}
              style={{ width: 25, height: 25 }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Gráfica"
        component={() => null}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("Interfaz_Grafica");
          },
        })}
        options={{
          tabBarIcon: () => (
            <Image
              source={require("../assets/iconos/graficas.png")}
              style={{ width: 25, height: 25 }}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Perfil"
        component={Interfaz_Perfil}
        initialParams={{ nombre, email, telefono, userId }}
        options={{
          tabBarIcon: () => (
            <Image
              source={require("../assets/iconos/usuario.png")}
              style={{ width: 28, height: 28 }}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
