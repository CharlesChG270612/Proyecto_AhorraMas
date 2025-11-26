import React, { useState, useEffect } from "react"; // ✅ useEffect agregado
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

export default function LoginScreen({ navigation, route }) { // ✅ route agregado
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  // ✅ useEffect para manejar errores que vengan de ValidandoCredencialesScreen
  useEffect(() => {
    if (route.params?.error) {
      Alert.alert("Error de Autenticación", route.params.error);
      // Limpiar el parámetro de error después de mostrarlo
      navigation.setParams({ error: undefined });
    }
  }, [route.params, navigation]);

  const handleLogin = () => {
    if (!usuario.trim() || !password.trim()) {
      Alert.alert("Error", "Completa Usuario y Contraseña.");
      return;
    }

    // Navega a la pantalla de validación
    navigation.navigate("ValidandoCredenciales", {
      usuario: usuario,
      password: password
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Inicia Sesión</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.formCard}>
          <Text style={styles.title}>BIENVENIDO DE NUEVO</Text>
          <Text style={{ marginBottom: 10, color: "#666" }}>
            Inicia sesión para continuar
          </Text>

          <Image
            source={require("../assets/iconos/entrar.png")}
            style={styles.headerImage}
            resizeMode="contain" // ✅ Usar prop resizeMode en lugar de style
          />

          <Text style={styles.label}>Usuario:</Text>
          <TextInput
            style={styles.input}
            placeholder="Usuario"
            placeholderTextColor="#999"
            value={usuario}
            onChangeText={setUsuario}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Contraseña:</Text>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <View style={styles.linkContainer}>
            <Pressable onPress={() => navigation.navigate("Recuperacion")}>
              <Text style={styles.contraseñaLinkText}>Olvidaste tu contraseña</Text>
            </Pressable>
          </View>

          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </Pressable>
          
          <Pressable onPress={() => navigation.navigate("Registro")}>
            <Text style={styles.loginLinkText}>
              ¿No tienes cuenta? Regístrate aquí
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: "#2778BF" 
  },
  header: { 
    padding: 50 
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
  },
  formCard: {
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 15,
    width: "90%",
    alignItems: "center",
    // ✅ Solución para el warning de shadow*
    ...Platform.select({
      web: {
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      },
      default: {
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#7f1cc5ff",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: "#555",
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  input: {
    height: 50,
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#03A9F4",
    paddingVertical: 12,
    borderRadius: 25,
    width: "100%",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginLinkText: {
    color: "#1976D2",
    fontSize: 15,
  },
  contraseñaLinkText: {
    color: "#1976D2",
    fontSize: 15,          
  },
  linkContainer: {
    width: "100%",
    alignItems: "flex-end",   
    marginTop: 5,             
    marginBottom: 15,         
  },
  headerImage: {
    width: 90,
    height: 90,
    marginBottom: 20,
    // ✅ resizeMode se usa como prop, no en styles
  },
});