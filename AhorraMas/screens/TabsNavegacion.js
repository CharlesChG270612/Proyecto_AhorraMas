import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Image } from "react-native";

import Interfaz_Inicio from "./Interfaz_Inicio";
import Interfaz_PresupuestosGastos from "./Interfaz_PresupuestosGastos";
import Interfaz_HistorialTransacciones from "./Interfaz_HistorialTransacciones";
import Interfaz_Grafica from "./Interfaz_Grafica";
import Interfaz_Movimientos from "./Interfaz_Movimientos";

const Tab = createBottomTabNavigator();

export default function TabsNavegacion() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { height: 70, paddingBottom: 10 },
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
        component={Interfaz_HistorialTransacciones}
        options={{
          tabBarIcon: () => (
            <Image source={require("../assets/iconos/historial-de-transacciones.png")} style={{ width: 25, height: 25 }} />
          ),
        }}
      />

      <Tab.Screen
        name="Presupuestos"
        component={Interfaz_PresupuestosGastos}
        options={{
          tabBarIcon: () => (
            <Image source={require("../assets/iconos/presupuesto.png")} style={{ width: 25, height: 25 }} />
          ),
        }}
      />

      <Tab.Screen
        name="Gráfica"
        component={Interfaz_Grafica}
        options={{
          tabBarIcon: () => (
            <Image source={require("../assets/iconos/graficas.png")} style={{ width: 25, height: 25 }} />
          ),
        }}
      />

      <Tab.Screen
        name="Movimientos"
        component={Interfaz_Movimientos}
        options={{
          tabBarIcon: () => (
            <Image source={require("../assets/iconos/movimientos.png")} style={{ width: 25, height: 25 }} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
