import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Interfaz_Notificaciones() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.btnAtras}
        >
          <Image
            source={require("../assets/iconos/flecha-izquierda.png")}
            style={styles.iconoAtras}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Notificaciones</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hoy</Text>

          <View style={styles.notificacionItem}>
            <View
              style={[styles.iconoContainer, { backgroundColor: "#4A90E2" }]}
            >
              <Ionicons name="notifications" size={24} color="#fff" />
            </View>
            <View style={styles.notificacionInfo}>
              <Text style={styles.notificacionTitulo}>Intento de pago</Text>
              <Text style={styles.notificacionTexto}>
                El pago a CEA no se pudo completar
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ayer</Text>

          <View style={styles.notificacionItem}>
            <View
              style={[styles.iconoContainer, { backgroundColor: "#4ECDC4" }]}
            >
              <FontAwesome5 name="check-circle" size={22} color="#fff" />
            </View>
            <View style={styles.notificacionInfo}>
              <Text style={styles.notificacionTitulo}>Depósito recibido</Text>
              <Text style={styles.notificacionTexto}>
                Se agregó dinero a tu cuenta
              </Text>
            </View>
          </View>

          <View style={styles.notificacionItem}>
            <View
              style={[styles.iconoContainer, { backgroundColor: "#45B7D1" }]}
            >
              <Ionicons name="flash" size={26} color="#fff" />
            </View>
            <View style={styles.notificacionInfo}>
              <Text style={styles.notificacionTitulo}>Pago realizado</Text>
              <Text style={styles.notificacionTexto}>
                El pago de CFE fue exitoso
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
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

  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#222" },

  scrollView: { flex: 1, marginTop: 10 },
  scrollContent: { paddingBottom: 30 },

  section: { padding: 20, borderBottomWidth: 1, borderBottomColor: "#eee" },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },

  notificacionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f3f3",
  },

  iconoContainer: {
    width: 42,
    height: 42,
    borderRadius: 25,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  notificacionInfo: { flex: 1 },

  notificacionTitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  notificacionTexto: {
    fontSize: 14,
    color: "#666",
    marginTop: 3,
  },
});
