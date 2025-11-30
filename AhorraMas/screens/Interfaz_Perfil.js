import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Pressable, Alert, ActivityIndicator } from "react-native";
import ControladorAutenticacion from "../controllers/ControladorAutenticacion";
import Usuario from "../models/Usuario";

export default function Interfaz_Perfil({ navigation, route }) {
  const [usuarioData, setUsuarioData] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  const cargarDatosUsuario = async () => {
    try {
      setCargando(true);
      
      const usuarioActual = await ControladorAutenticacion.obtenerUsuarioActual();
      
      if (usuarioActual && usuarioActual.id) {
        const usuarioCompleto = await Usuario.buscarPorId(usuarioActual.id);
        
        if (usuarioCompleto) {
          setUsuarioData({
            nombre: usuarioCompleto.usuario || "Usuario",
            email: usuarioCompleto.correo || "No especificado",
            userId: `ID-${usuarioCompleto.id.toString().padStart(4, '0')}`
          });
        } else {
          setUsuarioData({
            nombre: usuarioActual.usuario || "Usuario",
            email: usuarioActual.correo || "No especificado",
            userId: `ID-${usuarioActual.id.toString().padStart(4, '0')}`
          });
        }
      } else {
        setUsuarioData({
          nombre: "Invitado",
          email: "No has iniciado sesión",
          userId: "ID-0000"
        });
      }
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
      Alert.alert("Error", "No se pudieron cargar los datos del perfil");
    } finally {
      setCargando(false);
    }
  };

  const obtenerInicial = (nombre) => {
    if (!nombre || nombre === "Invitado") return "?";
    return nombre.charAt(0).toUpperCase();
  };

  const generarColor = (nombre) => {
    if (!nombre) return "#03A9F4";
    
    const colores = [
      "#03A9F4", "#4CAF50", "#FF9800", "#9C27B0", 
      "#F44336", "#2196F3", "#009688", "#FF5722",
      "#673AB7", "#3F51B5", "#00BCD4", "#FFC107"
    ];
    
    let hash = 0;
    for (let i = 0; i < nombre.length; i++) {
      hash = nombre.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colores[Math.abs(hash) % colores.length];
  };

  const eliminarCuenta = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Seguro que deseas cerrar sesión con tu cuenta?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, cerrar sesión",
          style: "destructive",
          onPress: async () => {
            try {
              const usuarioActual = await ControladorAutenticacion.obtenerUsuarioActual();
              if (usuarioActual && usuarioActual.id) {

              }
              
              await ControladorAutenticacion.cerrarSesion();
              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            } catch (error) {
              console.error('Error eliminando cuenta:', error);
              Alert.alert("Error", "No se pudo eliminar la cuenta");
            }
          },
        },
      ]
    );
  };

  if (cargando) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <ActivityIndicator size="large" color="#03A9F4" />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={[
          styles.avatarCircle,
          { backgroundColor: generarColor(usuarioData?.nombre) }
        ]}>
          <Text style={styles.avatarText}>
            {obtenerInicial(usuarioData?.nombre)}
          </Text>
        </View>

        <Text style={styles.name}>{usuarioData?.nombre}</Text>
        <Text style={styles.email}>{usuarioData?.email}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de la cuenta</Text>

          <Text style={styles.itemLabel}>Nombre de usuario</Text>
          <Text style={styles.itemValue}>{usuarioData?.nombre}</Text>

          <Text style={styles.itemLabel}>Correo electrónico</Text>
          <Text style={styles.itemValue}>{usuarioData?.email}</Text>

          <Text style={styles.itemLabel}>ID de usuario</Text>
          <Text style={styles.itemValue}>{usuarioData?.userId}</Text>
        </View>

        <Pressable style={styles.deleteButton} onPress={eliminarCuenta}>
          <Text style={styles.deleteText}>Cerrar sesión</Text>
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
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  avatarText: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
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
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
});