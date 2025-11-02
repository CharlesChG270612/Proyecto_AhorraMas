import React from "react";
import {View,Text,Image,FlatList,StyleSheet,TouchableOpacity} from "react-native";

const transacciones = [
  {
    id: "1",
    nombre: "Netflix",
    categoria: "Entretenimiento",
    monto: "- $10",
    imagen: require("./assets/iconos/netflix.png"),
    fecha: "01 Nov 2025",
  },
  {
    id: "2",
    nombre: "Maria Charles",
    categoria: "Transferencia móvil",
    monto: "+ $100",
    imagen: require("./assets/iconos/persona.png"),
    fecha: "01 Nov 2025",
  },
  {
    id: "3",
    nombre: "Walmart",
    categoria: "Supermercado y tienda de conveniencia",
    monto: "- $50",
    imagen: require("./assets/iconos/walmart.png"),
    fecha: "31 Oct 2025",
  },
  {
    id: "4",
    nombre: "Spotify",
    categoria: "Música y audio",
    monto: "- $15",
    imagen: require("./assets/iconos/spotify.png"),
    fecha: "30 Oct 2025",
  },
  {
    id: "5",
    nombre: "Netflix",
    categoria: "Entretenimiento",
    monto: "- $10",
    imagen: require("./assets/iconos/netflix.png"),
    fecha: "01 Nov 2025",
  },
  {
    id: "6",
    nombre: "Maria Charles",
    categoria: "Transferencia móvil",
    monto: "+ $100",
    imagen: require("./assets/iconos/persona.png"),
    fecha: "01 Nov 2025",
  },
  {
    id: "7",
    nombre: "Walmart",
    categoria: "Supermercado y tienda de conveniencia",
    monto: "- $50",
    imagen: require("./assets/iconos/walmart.png"),
    fecha: "31 Oct 2025",
  },
  {
    id: "8",
    nombre: "Spotify",
    categoria: "Música y audio",
    monto: "- $15",
    imagen: require("./assets/iconos/spotify.png"),
    fecha: "30 Oct 2025",
  },
  {
    id: "9",
    nombre: "Maria Charles",
    categoria: "Transferencia móvil",
    monto: "+ $100",
    imagen: require("./assets/iconos/persona.png"),
    fecha: "01 Nov 2025",
  },
  {
    id: "10",
    nombre: "Walmart",
    categoria: "Supermercado y tienda de conveniencia",
    monto: "- $50",
    imagen: require("./assets/iconos/walmart.png"),
    fecha: "31 Oct 2025",
  },
];

export default function Interfaz_HistorialTransacciones() {
  const renderTransaccion = ({ item }) => (
    <View style={estilos.tarjeta}>
      <Image source={item.imagen} style={estilos.imagen} />
      <View style={estilos.info}>
        <Text style={estilos.nombre}>{item.nombre}</Text>
        <Text style={estilos.categoria}>{item.categoria}</Text>
        <Text style={estilos.fecha}>{item.fecha}</Text>
      </View>
      <Text
        style={[
          estilos.monto,
          { color: item.monto.includes("+") ? "#2ecc71" : "#e63946" },
        ]}
      >
        {item.monto}
      </Text>
    </View>
  );

  return (
    <View style={estilos.contenedorPrincipal}>
      <View style={estilos.contenedor}>
        <View style={estilos.encabezado}>
          <Text style={estilos.titulo}>Transacciones recientes</Text>
            <Image
              source={require("./assets/iconos/buscar.png")}
              style={estilos.iconoSuperior}
            />
          </View>

        <FlatList
          data={transacciones}
          keyExtractor={(item) => item.id}
          renderItem={renderTransaccion}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </View>

      <View style={estilos.barraInferior}>
        <TouchableOpacity style={estilos.botonIcono}>
          <Image
            source={require("./assets/iconos/inicio.png")}
            style={estilos.iconoBarra}
          />
        </TouchableOpacity>
        <TouchableOpacity style={estilos.botonIcono}>
          <Image
            source={require("./assets/iconos/buscar.png")}
            style={estilos.iconoBarra}
          />
        </TouchableOpacity>
        <TouchableOpacity style={estilos.botonIcono}>
          <Image
            source={require("./assets/iconos/notificaciones.png")}
            style={estilos.iconoBarra}
          />
        </TouchableOpacity>
        <TouchableOpacity style={estilos.botonIcono}>
          <Image
            source={require("./assets/iconos/configuraciones.png")}
            style={estilos.iconoBarra}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedorPrincipal: {
    flex: 1,
    backgroundColor: "#f7f6fa",
  },
  contenedor: {
    flex: 1,
    padding: 20,
    paddingBottom: 0,
  },
  encabezado: {
    flexDirection: "row",
    justifyContent: "space-between", 
    alignItems: "center",
    marginTop: 30,
    marginBottom: 10,
  },

  titulo: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
  },

  iconoSuperior: {
    width: 30,
    height: 30,
  },

  tarjeta: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  imagen: {
    width: 45,
    height: 45,
    borderRadius: 25,
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  categoria: {
    fontSize: 13,
    color: "#777",
    marginTop: 2,
  },
  fecha: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 2,
  },
  monto: {
    fontSize: 15,
    fontWeight: "bold",
  },
  barraInferior: {
    position: "absolute",
    bottom: 0,
    paddingBottom: 45,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    elevation: 10,
  },
  botonIcono: {
    alignItems: "center",
  },
  iconoBarra: {
    width: 30,
    height: 30,
  },
});