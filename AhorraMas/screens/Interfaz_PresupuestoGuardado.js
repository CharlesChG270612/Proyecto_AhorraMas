import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function Interfaz_PresupuestoGuardado() {
  return (
    <View style={styles.container}>
    
      <View style={styles.content}>
        <Text style={styles.title}>Presupuesto guardado</Text>

        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
          }}
          style={styles.image}
        />

        <Text style={styles.successTitle}>Presupuesto exitoso</Text>
        <Text style={styles.description}>
          ¡Ya tienes un presupuesto para el servicio!
        </Text>

        <View style={styles.button}>
          <Text style={styles.buttonText}>Confirmar</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 90, 
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000",
    alignSelf: "flex-start",
    marginBottom: 40,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 25,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#4C6EF5",
    marginBottom: 8,
  },
  description: {
    textAlign: "center",
    color: "#555",
    marginBottom: 30,
    fontSize: 14,
  },
  button: {
    backgroundColor: "#4C6EF5",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
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
