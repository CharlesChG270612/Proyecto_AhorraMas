import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { TouchableOpacity, Image } from "react-native";
import Interfaz_PresupuestosGastos from "./Interfaz_PresupuestosGastos";
import DetallePresupuesto from "./DetallePresupuesto";

const Stack = createNativeStackNavigator();

export default function StackPresupuestos() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
  <Stack.Screen
    name="ListaPresupuestos"
    component={Interfaz_PresupuestosGastos}
     options={({ navigation }) => ({
    title: "    Presupuestos",
    headerLeft: () => (
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image
          source={require("../assets/iconos/flecha-izquierda.png")}
          style={{ width: 22, height: 22, marginLeft: 10 }}
        />
      </TouchableOpacity>
    ),
  })}
  />

  <Stack.Screen
    name="DetallePresupuesto"
    component={DetallePresupuesto}
    options={{
      headerBackVisible: true,   
      title: "Detalle",
    }}
  />
</Stack.Navigator>
  );
}