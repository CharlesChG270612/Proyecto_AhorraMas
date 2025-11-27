import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from "react-native";

import Interfaz_Inicio from "./Interfaz_Inicio";
import StackPresupuestos from "./StackPresupuestos";
import Interfaz_Grafica from "./Interfaz_Grafica";

const Tab = createBottomTabNavigator();

export default function TabsNavegacion() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 90,
          paddingBottom: 50,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        },
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={Interfaz_Inicio}
        options={{
          tabBarIcon: () => (
            <Image source={require("../assets/iconos/inicio.png")} style={{ width: 25, height: 25 }} />
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
            <Image source={require("../assets/iconos/historial-de-transacciones.png")} style={{ width: 25, height: 25 }} />
          ),
        }}
      />

      <Tab.Screen
        name="Presupuestos"
        component={StackPresupuestos}
        options={{
          tabBarIcon: () => (
            <Image source={require("../assets/iconos/presupuesto.png")} style={{ width: 25, height: 25 }} />
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
            <Image source={require("../assets/iconos/graficas.png")} style={{ width: 25, height: 25 }} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
