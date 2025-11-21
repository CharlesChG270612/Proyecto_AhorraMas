import React from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

function RegistrarPresupuestoScreen({ navigation }) {
  return (
    <View style={styles.container}>
      
      <View style={styles.content}>
        <Text style={styles.title}>Registrar presupuesto</Text>

        <View style={styles.card}>
          <View style={{ marginBottom: 15 }}>
            <Text style={styles.label}>Elegir empresa</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue="">
                <Picker.Item label="Selecciona una empresa" value="" />
                <Picker.Item label="Empresa A" value="a" />
                <Picker.Item label="Empresa B" value="b" />
              </Picker>
            </View>
          </View>

          <View style={{ marginBottom: 15 }}>
            <Text style={styles.label}>Tipo de monto</Text>
            <TextInput style={styles.input} placeholder="Monto" />
          </View>

          <Text style={styles.infoText}>
            Por favor ingrese el monto correcto para verificar la información.
          </Text>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#d6d6d6" }]}
            onPress={() => navigation.navigate("Guardado")}
          >
            <Text style={styles.buttonText}>Verificar</Text>
          </TouchableOpacity>
        </View>
      </View>

      
      <View style={styles.barraInferior}>
        <TouchableOpacity style={styles.botonIcono}>
          <Image
            source={require("./assets/iconos/inicio.png")}
            style={styles.iconoBarra}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.botonIcono}>
          <Image
            source={require("./assets/iconos/buscar.png")}
            style={styles.iconoBarra}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.botonIcono}>
          <Image
            source={require("./assets/iconos/notificaciones.png")}
            style={styles.iconoBarra}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.botonIcono}>
          <Image
            source={require("./assets/iconos/configuraciones.png")}
            style={styles.iconoBarra}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

function PresupuestoGuardadoScreen() {
  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 22, textAlign: "center", marginTop: 50 }}>
        Aquí se mostrarán los presupuestos guardados
      </Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();
function TabsNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Registrar" component={RegistrarPresupuestoScreen} />
      <Tab.Screen name="Guardado" component={PresupuestoGuardadoScreen} />
    </Tab.Navigator>
  );
}

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Inicio" component={TabsNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginBottom: 6,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    overflow: "hidden",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  infoText: {
    fontSize: 13,
    color: "#777",
    marginTop: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#999",
    fontWeight: "600",
  },

  barraInferior: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderTopWidth: 1,
    borderColor: "#eee",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: -2 },
    shadowRadius: 4,
  },
  botonIcono: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconoBarra: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
});
