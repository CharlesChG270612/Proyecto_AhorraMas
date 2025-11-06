import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, FlatList, Alert } from "react-native";
import Interfaz_Inicio from "./Interfaz_Inicio";
import Interfaz_PresupuestoGuardado from "./Interfaz_PresupuestoGuardado";

export default function Interfaz_RegistrarPresupuesto({ volver }) {
  const [empresa, setEmpresa] = useState("");
  const [monto, setMonto] = useState("");
  const [mostrarLista, setMostrarLista] = useState(false);
  const [mostrarApp, setMostrarApp] = useState(false);
  const [guardado, setMostrarGuardado] = useState(false);

  const empresas = ["Empresa A", "Empresa B", "Empresa C"];

  if (mostrarApp) {
    return <Interfaz_Inicio />;
  }

  if (guardado) {
    return <Interfaz_PresupuestoGuardado />;
  }

  const verificarCampos = () => {
    if (!empresa && !monto) {
      Alert.alert("Campos incompletos", "Debes completar todos los campos.");
      return;
    }
    if (!empresa) {
      Alert.alert("Campo faltante", "Debes seleccionar una empresa.");
      return;
    }
    if (!monto) {
      Alert.alert("Campo faltante", "Debes ingresar un monto.");
      return;
    }
    setMostrarGuardado(true);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={volver} style={{ marginTop: 40, marginLeft: 20 }}>
        <Image
          source={require("../assets/iconos/flecha-izquierda.png")}
          style={{ width: 25, height: 25 }}
        />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Registrar presupuesto</Text>

        <View style={styles.card}>
          <View style={{ marginBottom: 15 }}>
            <Text style={styles.label}>Elegir empresa</Text>
            <TouchableOpacity
              style={styles.selectBox}
              onPress={() => setMostrarLista(!mostrarLista)}
            >
              <Text style={{ color: empresa ? "#000" : "#888" }}>
                {empresa || "Selecciona una empresa"}
              </Text>
              <Image
                source={require("../assets/iconos/flecha-abajo.png")}
                style={{ width: 15, height: 15 }}
              />
            </TouchableOpacity>

            {mostrarLista && (
              <View style={styles.dropdown}>
                <FlatList
                  data={empresas}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        setEmpresa(item);
                        setMostrarLista(false);
                      }}
                    >
                      <Text style={{ color: "#000" }}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>

          <View style={{ marginBottom: 15 }}>
            <Text style={styles.label}>Tipo de monto</Text>
            <TextInput
              style={styles.input}
              placeholder="Monto"
              keyboardType="numeric"
              value={monto}
              onChangeText={setMonto}
            />
          </View>

          <Text style={styles.infoText}>
            Por favor ingrese el monto correcto para verificar la información.
          </Text>

          <TouchableOpacity style={styles.button} onPress={verificarCampos}>
            <Text style={styles.buttonText}>Verificar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.barraInferior}>
        <TouchableOpacity style={styles.botonIcono} onPress={() => setMostrarApp(true)}>
          <Image source={require("../assets/iconos/inicio.png")} style={styles.iconoBarra} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.botonIcono}>
          <Image source={require("../assets/iconos/buscar.png")} style={styles.iconoBarra} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.botonIcono}>
          <Image source={require("../assets/iconos/notificaciones.png")} style={styles.iconoBarra} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.botonIcono}>
          <Image source={require("../assets/iconos/configuraciones.png")} style={styles.iconoBarra} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 80 },
  title: { fontSize: 22, fontWeight: "bold", color: "#000", marginBottom: 20 },
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
  label: { fontSize: 14, fontWeight: "600", color: "#444", marginBottom: 6 },
  selectBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginTop: 5,
    backgroundColor: "#fff",
    maxHeight: 120,
    elevation: 4,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  infoText: { fontSize: 13, color: "#777", marginTop: 12, marginBottom: 20 },
  button: {
    backgroundColor: "#2196F3",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
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
  botonIcono: { alignItems: "center", justifyContent: "center" },
  iconoBarra: { width: 30, height: 30, resizeMode: "contain" },
});
