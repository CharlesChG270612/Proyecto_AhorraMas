import React from "react";
import {View,Text,StyleSheet,Image,TouchableOpacity,FlatList} from "react-native";

export default function Interfaz_PresupuestosGastos() {
  const servicios = [
    {
      id: "1",
      nombre: "Servicio eléctrico",
      descripcion: "Registra un presupuesto",
      imagen: require("./assets/iconos/electricidad.png"),
    },
    {
      id: "2",
      nombre: "Servicio de agua",
      descripcion: "Registra un presupuesto",
      imagen: require("./assets/iconos/agua.png"),
    },
    {
      id: "3",
      nombre: "Servicio de internet",
      descripcion: "Registra un presupuesto",
      imagen: require("./assets/iconos/internet.png"),
    },
  ];

  const renderItem = ({ item }) => (
    <View style={estilos.tarjeta}>
      <View>
        <Text style={estilos.nombre}>{item.nombre}</Text>
        <Text style={estilos.descripcion}>{item.descripcion}</Text>
      </View>
      <Image source={item.imagen} style={estilos.imagenServicio} />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <View style={estilos.encabezado}>
        <TouchableOpacity>
          <Image
            source={require("./assets/iconos/flecha-izquierda.png")}
            style={estilos.iconoAtras}
          />
        </TouchableOpacity>
        <Text style={estilos.titulo}>Presupuesto de gastos</Text>
      </View>

      <FlatList
        data={servicios}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={estilos.listaContenido}
      />
      <View style={estilos.barraInferior}>
        <TouchableOpacity style={estilos.botonIcono}>
          <Image source={require("./assets/iconos/inicio.png")} style={estilos.iconoBarra} />
        </TouchableOpacity>
        <TouchableOpacity style={estilos.botonIcono}>
          <Image source={require("./assets/iconos/buscar.png")} style={estilos.iconoBarra} />
        </TouchableOpacity>
        <TouchableOpacity style={estilos.botonIcono}>
          <Image source={require("./assets/iconos/notificaciones.png")} style={estilos.iconoBarra} />
        </TouchableOpacity>
        <TouchableOpacity style={estilos.botonIcono}>
          <Image source={require("./assets/iconos/configuraciones.png")} style={estilos.iconoBarra} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  encabezado: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 40,
    marginHorizontal: 20,
    marginBottom: 25,
  },
  iconoAtras: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  listaContenido: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  tarjeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 18,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  nombre: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },
  descripcion: {
    fontSize: 13,
    color: "#888",
    marginTop: 4,
  },
  imagenServicio: {
    width: 90,
    height: 90,
    resizeMode: "contain",
  },
  barraInferior: {
    position: "absolute",
    bottom: 0,
    paddingBottom:45,
    width: "100%",
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