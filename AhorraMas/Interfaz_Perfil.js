import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { UserData } from "./UserData";

export default function Interfaz_Perfil({ navigation }) {
  
  const cerrarSesion = () => {
   
    UserData.nombre = "";
    UserData.correo = "";
    UserData.telefono = "";
    UserData.id = "";

    navigation.replace("Login");
  };

  const eliminarCuenta = () => {
    Alert.alert(
      "Eliminar Cuenta",
      "¿Deseas eliminar tu cuenta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => {
            UserData.nombre = "";
            UserData.correo = "";
            UserData.telefono = "";
            UserData.id = "";

            navigation.replace("Login");
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Mi Perfil</Text>

      <View style={styles.userCard}>
        <Image source={require("../assets/iconos/usuario.png")} style={styles.avatar} />
        <Text style={styles.nombre}>{UserData.nombre}</Text>
      </View>

      <Text style={styles.label}>Correo:</Text>
      <Text style={styles.value}>{UserData.correo}</Text>

      <Text style={styles.label}>Teléfono:</Text>
      <Text style={styles.value}>{UserData.telefono}</Text>

      <Text style={styles.label}>ID de usuario:</Text>
      <Text style={styles.value}>{UserData.id}</Text>

      <TouchableOpacity style={styles.btnLogout} onPress={cerrarSesion}>
        <Text style={styles.btnText}>Cerrar Sesión</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnDelete} onPress={eliminarCuenta}>
        <Text style={styles.btnText}>Eliminar Cuenta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  titulo: { fontSize: 24, fontWeight: "bold", textAlign: "center" },
  userCard: { alignItems: "center", marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  nombre: { fontSize: 20, fontWeight: "bold" },
  label: { marginTop: 10, fontWeight: "bold" },
  value: { fontSize: 16 },
  btnLogout: {
    backgroundColor: "#1F64BF",
    padding: 12,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },
  btnDelete: {
    backgroundColor: "#E53935",
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold" },
});
