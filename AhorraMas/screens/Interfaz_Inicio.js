import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from "react-native"
import Interfaz_HistorialTransacciones from './Interfaz_HistorialTransacciones'
import Interfaz_Grafica from './Interfaz_Grafica'
import Interfaz_PresupuestosGastos from './Interfaz_PresupuestosGastos'
import Interfaz_Movimientos from './Interfaz_Movimientos'


export default function Interfaz_Inicio() {
  const [pantalla, setPantalla] = useState("Inicio");

  

  if (pantalla === "historial") return <Interfaz_HistorialTransacciones />;
  if (pantalla === "grafica") return <Interfaz_Grafica />;
  if (pantalla === "presupuestos") return <Interfaz_PresupuestosGastos />;
  if (pantalla === "movimientos") return <Interfaz_Movimientos />;

  

  return (
    <ScrollView contentContainerStyle={estilos.contenedor}>
      <Text style={estilos.saludo}>Buenos días,</Text>
      <Text style={estilos.nombre}>ÁNGEL!</Text>

      <View style={estilos.contenedorTarjeta}>
        <View style={estilos.tarjeta}>
          <View style={estilos.superiorTarjeta}>
            <Text style={estilos.nombreTarjeta}>Ángel</Text>
            <Text style={estilos.apellidoTarjeta}>Hernandéz</Text>
            <Text style={estilos.subtituloTarjeta}>OverBridge Expert</Text>
          </View>
          <View style={estilos.inferiorTarjeta}>
            <Text style={estilos.numeroTarjeta}>4756 •••• •••• 9018</Text>
            <Text style={estilos.saldoTarjeta}>$3,469.52</Text>
            <Text style={estilos.marcaTarjeta}>VISA</Text>
          </View>
        </View>
      </View>

      <View style={estilos.contenedorOpciones}>
        <TouchableOpacity style={estilos.opcion} onPress={() => setPantalla("historial")}>
          <View style={[estilos.cajaIcono, { backgroundColor: "#6c63ff1a" }]}>
            <Image source={require("../assets/iconos/historial-de-transacciones.png")} style={estilos.icono} />
          </View>
          <Text style={estilos.textoOpcion}>Historial de{"\n"}transacciones</Text>
        </TouchableOpacity>

        <TouchableOpacity style={estilos.opcion} onPress={() => setPantalla("presupuestos")}>
          <View style={[estilos.cajaIcono, { backgroundColor: "#ff98001a" }]}>
            <Image source={require("../assets/iconos/presupuesto.png")} style={estilos.icono} />
          </View>
          <Text style={estilos.textoOpcion}>Presupuestos{"\n"}de gastos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={estilos.opcion} onPress={() => setPantalla("grafica")}>
          <View style={[estilos.cajaIcono, { backgroundColor: "#4caf501a" }]}>
            <Image source={require("../assets/iconos/graficas.png")} style={estilos.icono} />
          </View>
          <Text style={estilos.textoOpcion}>Gráfica</Text>
        </TouchableOpacity>

        <TouchableOpacity style={estilos.opcion} onPress={() => setPantalla("movimientos")}>
          <View style={[estilos.cajaIcono, { backgroundColor: "#e83b631a" }]}>
            <Image source={require("../assets/iconos/movimientos.png")} style={estilos.icono} />
          </View>
          <Text style={estilos.textoOpcion}>Movimientos</Text>
        </TouchableOpacity>
      </View>

      <View style={estilos.barraInferior}>
        <TouchableOpacity style={estilos.iconoActivo}>
          <Image source={require("../assets/iconos/inicio.png")} style={estilos.iconoBarra} />
          <Text style={estilos.textoActivo}>Inicio</Text>
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
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flexGrow: 1,
    backgroundColor: "#ffffffff",
    alignItems: "center",
    paddingVertical: 50,
  },
  saludo: {
    fontSize: 26,
    fontWeight: "600",
    color: "#000",
  },
  nombre: {
    fontSize: 26,
    fontWeight: "800",
    color: "#000",
    marginBottom: 25,
  },
  contenedorTarjeta: {
    alignItems: "center",
    marginBottom: 40,
  },
  tarjeta: {
    width: 320,
    height: 180,
    borderRadius: 15,
    backgroundColor: "#452b8b",
    padding: 20,
    justifyContent: "space-between",
    overflow: "hidden",
  },
  superiorTarjeta: {
    flexDirection: "column",
  },
  nombreTarjeta: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  apellidoTarjeta: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  subtituloTarjeta: {
    color: "#ddd",
    fontSize: 12,
  },
  inferiorTarjeta: {
    marginTop: 20,
  },
  numeroTarjeta: {
    color: "#fff",
    fontSize: 14,
    marginBottom: 5,
  },
  saldoTarjeta: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  marcaTarjeta: {
    color: "#fff",
    fontSize: 16,
    textAlign: "right",
  },
  contenedorOpciones: {
    width: "90%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  opcion: {
    width: "45%",
    alignItems: "center",
    marginVertical: 15,
  },
  cajaIcono: {
    width: 65,
    height: 65,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  icono: {
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
  },
  textoOpcion: {
    textAlign: "center",
    fontSize: 14,
    color: "#333",
  },
  barraInferior: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
    marginTop: 110,
    backgroundColor: "#fff",
  },
  botonIcono: {
    alignItems: "center",
  },
  iconoBarra: {
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
  },
  textoActivo: {
    fontSize: 12,
    color: "#fff",
  },
  iconoActivo: {
    backgroundColor: "#452b8b",
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: "center",
  },
});
