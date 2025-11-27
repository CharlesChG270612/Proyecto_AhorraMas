import React from "react";
import { View, Text, StyleSheet, Image, Pressable, Alert } from "react-native";

export default function Interfaz_Perfil({ navigation, route }) {
  const {
    nombre = "Usuario de ejemplo",
    email = "correo@ejemplo.com",
    telefono = "5512345678",
    userId = "ID-0001",
  } = route?.params || {};

  const eliminarCuenta = () => {
    Alert.alert(
      "Eliminar cuenta",
      "¿Seguro que deseas eliminar tu cuenta? Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, eliminar",
          style: "destructive",
          onPress: () => {
          
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image
          source={require("../assets/iconos/perfil.png")}
          style={styles.avatar}
        />

        <Text style={styles.name}>{nombre}</Text>
        <Text style={styles.email}>{email}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos de la cuenta</Text>

          <Text style={styles.itemLabel}>Nombre</Text>
          <Text style={styles.itemValue}>{nombre}</Text>

          <Text style={styles.itemLabel}>Correo electrónico</Text>
          <Text style={styles.itemValue}>{email}</Text>

          <Text style={styles.itemLabel}>Número telefónico</Text>
          <Text style={styles.itemValue}>{telefono}</Text>

          <Text style={styles.itemLabel}>ID de usuario</Text>
          <Text style={styles.itemValue}>{userId}</Text>
        </View>

        <Pressable style={styles.deleteButton} onPress={eliminarCuenta}>
          <Text style={styles.deleteText}>Eliminar cuenta</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    elevation: 4,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#555",
    marginBottom: 20,
  },
  section: {
    width: "100%",
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  itemLabel: {
    fontSize: 13,
    color: "#777",
  },
  itemValue: {
    fontSize: 15,
    marginBottom: 12,
  },
  deleteButton: {
    width: "100%",
    backgroundColor: "#ff5252",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
