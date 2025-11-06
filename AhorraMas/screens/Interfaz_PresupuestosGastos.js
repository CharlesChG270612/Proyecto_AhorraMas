import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from "react-native";
import Interfaz_RegistrarPresupuesto from "./Interfaz_RegistrarPresupuesto";
import Interfaz_Inicio from "./Interfaz_Inicio";

export default function Interfaz_PresupuestosGastos() {
  const [pantalla, setPantalla] = useState("presupuestos");
  const [mostrarApp, setMostrarApp] = useState(false);

  const servicios = [
    { id: "1", nombre: "Servicio eléctrico", descripcion: "Registra un presupuesto", imagen: require("../assets/iconos/electricidad.png") },
    { id: "2", nombre: "Servicio de agua", descripcion: "Registra un presupuesto", imagen: require("../assets/iconos/agua.png") },
    { id: "3", nombre: "Servicio de internet", descripcion: "Registra un presupuesto", imagen: require("../assets/iconos/internet.png") },
  ];

  if (mostrarApp) return <Interfaz_Inicio />;
  if (pantalla === "registrar") return <Interfaz_RegistrarPresupuesto onGuardar={() => setPantalla("guardado")} volver={() => setPantalla("presupuestos")} />;

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => setPantalla("registrar")}>
      <View style={estilos.tarjeta}>
        <View>
          <Text style={estilos.nombre}>{item.nombre}</Text>
          <Text style={estilos.descripcion}>{item.descripcion}</Text>
        </View>
        <Image source={item.imagen} style={estilos.imagenServicio} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View style={estilos.encabezado}>
        <TouchableOpacity onPress={() => setMostrarApp(true)}>
          <Image source={require("../assets/iconos/flecha-izquierda.png")} style={estilos.iconoAtras} />
        </TouchableOpacity>
        <Text style={estilos.titulo}>Presupuesto de gastos</Text>
      </View>

      <FlatList
        data={servicios}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={estilos.listaContenido}
      />

      <TouchableOpacity style={estilos.botonOtroTema} onPress={() => setPantalla("registrar")}>
        <Text style={estilos.textoBotonOtroTema}>Designar presupuesto a otro tema</Text>
      </TouchableOpacity>

      <View style={estilos.barraInferior}>
        <TouchableOpacity style={estilos.botonIcono} onPress={() => setMostrarApp(true)}>
          <Image source={require("../assets/iconos/inicio.png")} style={estilos.iconoBarra} />
        </TouchableOpacity>
        <TouchableOpacity style={estilos.botonIcono}>
          <Image source={require("../assets/iconos/buscar.png")} style={estilos.iconoBarra} />
        </TouchableOpacity>
        <TouchableOpacity style={estilos.botonIcono}>
          <Image source={require("../assets/iconos/notificaciones.png")} style={estilos.iconoBarra} />
        </TouchableOpacity>
        <TouchableOpacity style={estilos.botonIcono}>
          <Image source={require("../assets/iconos/configuraciones.png")} style={estilos.iconoBarra} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  encabezado: { flexDirection: "row", alignItems: "center", marginTop: 40, marginHorizontal: 20, marginBottom: 25 },
  iconoAtras: { width: 25, height: 25, marginRight: 10 },
  titulo: { fontSize: 22, fontWeight: "700", color: "#1a1a1a" },
  listaContenido: { paddingHorizontal: 20, paddingBottom: 100 },
  tarjeta: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: "#fff", padding: 20, borderRadius: 18, marginBottom: 15,
    shadowColor: "#000", shadowOpacity: 0.08, shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6, elevation: 3,
  },
  nombre: { fontSize: 16, fontWeight: "700", color: "#222" },
  descripcion: { fontSize: 13, color: "#888", marginTop: 4 },
  imagenServicio: { width: 90, height: 90, resizeMode: "contain" },
  botonOtroTema: {
    backgroundColor: "#2196F3", marginHorizontal: 20, borderRadius: 15,
    paddingVertical: 14, alignItems: "center", marginBottom: 90,
  },
  textoBotonOtroTema: { color: "#fff", fontSize: 16, fontWeight: "700" },
  barraInferior: {
    position: "absolute", bottom: 0, paddingBottom: 45, width: "100%",
    flexDirection: "row", justifyContent: "space-around", alignItems: "center",
    paddingVertical: 12, borderTopWidth: 1, borderColor: "#ddd", backgroundColor: "#fff", elevation: 10,
  },
  botonIcono: { alignItems: "center" },
  iconoBarra: { width: 30, height: 30 },
});
