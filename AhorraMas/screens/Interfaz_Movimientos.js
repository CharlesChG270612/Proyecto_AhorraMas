import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import Interfaz_Inicio from "./Interfaz_Inicio";

export default function Interfaz_Movimientos() {
  const [mostrarApp, setMostrarApp] = useState(false);
  if (mostrarApp) {
    return <Interfaz_Inicio />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMostrarApp(true)} style={styles.btnAtras}>
          <Image
            source={require("../assets/iconos/flecha-izquierda.png")}
            style={styles.iconoAtras}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Movimientos</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hoy</Text>
          <View style={styles.movimientoItem}>
            <View style={[styles.iconoContainer, { backgroundColor: "#4A90E2" }]}>
              <FontAwesome5 name="tint" size={24} color="#fff" />
            </View>
            <View style={styles.movimientoInfo}>
              <Text style={styles.movimientoNombre}>CEA</Text>
              <Text style={styles.movimientoEstado}>Sin éxito</Text>
            </View>
            <Text style={styles.movimientoMontoNegativo}>- $280</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ayer</Text>
          <View style={styles.movimientoItem}>
            <View style={[styles.iconoContainer, { backgroundColor: "#4ECDC4" }]}>
              <FontAwesome5 name="money-check" size={22} color="#fff" />
            </View>
            <View style={styles.movimientoInfo}>
              <Text style={styles.movimientoNombre}>Pago Nómina</Text>
            </View>
            <Text style={styles.movimientoMontoPositivo}>+$1200</Text>
          </View>

          <View style={styles.movimientoItem}>
            <View style={[styles.iconoContainer, { backgroundColor: "#45B7D1" }]}>
              <Ionicons name="flash" size={26} color="#fff" />
            </View>
            <View style={styles.movimientoInfo}>
              <Text style={styles.movimientoNombre}>CFE</Text>
              <Text style={styles.movimientoEstado}>Exitoso</Text>
            </View>
            <Text style={styles.movimientoMontoNegativo}>- $480</Text>
          </View>
        </View>
      </ScrollView>

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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 25,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    elevation: 8,
    zIndex: 99,
  },
  btnAtras: { position: "absolute", left: 20, padding: 5 },
  iconoAtras: { width: 25, height: 25, resizeMode: "contain" },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#222", textAlign: "center" },
  scrollView: { flex: 1, marginTop: 10, marginBottom: 80 },
  scrollContent: { paddingBottom: 100 },
  section: { padding: 20, borderBottomWidth: 1, borderBottomColor: "#eee" },
  sectionTitle: { fontSize: 18, fontWeight: "600", color: "#333", marginBottom: 15 },
  movimientoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f8f8f8",
  },
  iconoContainer: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  movimientoInfo: { flex: 1 },
  movimientoNombre: { fontSize: 16, fontWeight: "500", color: "#333", marginBottom: 4 },
  movimientoEstado: { fontSize: 14, color: "#666", fontStyle: "italic" },
  movimientoMontoPositivo: { fontSize: 16, fontWeight: "600", color: "#4CAF50" },
  movimientoMontoNegativo: { fontSize: 16, fontWeight: "600", color: "#F44336" },
  barraInferior: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    elevation: 10,
  },
  botonIcono: { alignItems: "center", justifyContent: "center", padding: 12 },
  iconoBarra: { width: 36, height: 36, resizeMode: "contain" },
});
