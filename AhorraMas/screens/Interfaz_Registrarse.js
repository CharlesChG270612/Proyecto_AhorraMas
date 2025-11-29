import React, { useState } from "react";
import {View,Text,StyleSheet,TextInput,Pressable,Alert,Image,SafeAreaView,KeyboardAvoidingView,Platform,ActivityIndicator,} from "react-native";
import ControladorAutenticacion from "../controllers/ControladorAutenticacion";

export default function Interfaz_Registrarse({ navigation }) {
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleRegistro = async () => {
    if (!usuario.trim()) {
      Alert.alert("Falta información", "Ingresa un nombre de usuario.");
      return;
    }

    if (usuario.length < 3) {
      Alert.alert("Usuario inválido", "El usuario debe tener al menos 3 caracteres.");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Falta información", "Ingresa un correo electrónico.");
      return;
    }

    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!regexEmail.test(email)) {
      Alert.alert("Correo inválido", "Ingresa un correo electrónico válido.");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Falta información", "Ingresa una contraseña.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Contraseña débil", "La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setCargando(true);

    try {
      const resultado = await ControladorAutenticacion.registrar({
        usuario: usuario.trim(),
        correo: email.trim(),
        contraseña: password.trim()
      });

      setCargando(false);

      if (resultado.exito) {
        Alert.alert(
          "Registro Exitoso", 
          resultado.mensaje,
          [
            {
              text: "OK",
              onPress: () => navigation.replace("Login")
            }
          ]
        );
      } else {
        Alert.alert("Error en el registro", resultado.mensaje);
      }
    } catch (error) {
      setCargando(false);
      console.error('Error en registro:', error);
      Alert.alert("Error", "Ocurrió un error inesperado. Intenta nuevamente.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Crear Cuenta</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.formCard}>
          <Text style={styles.title}>REGISTRO</Text>
          <Text style={{ marginBottom: 10 }}>Crea una nueva cuenta</Text>

          <Image
            source={require("../assets/iconos/inicioS.png")}
            style={styles.headerImage}
          />

          <Text style={styles.label}>Usuario:</Text>
          <TextInput
            style={styles.input}
            placeholder="Usuario (mín. 3 caracteres)"
            placeholderTextColor="#999"
            value={usuario}
            onChangeText={setUsuario}
            autoCapitalize="none"
            editable={!cargando}
          />

          <Text style={styles.label}>Correo electrónico:</Text>
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            editable={!cargando}
            keyboardType="email-address"
            autoComplete="email"
          />

          <Text style={styles.label}>Contraseña:</Text>
          <TextInput
            style={styles.input}
            placeholder="Contraseña (mín. 6 caracteres)"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!cargando}
          />

          {cargando ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#03A9F4" />
              <Text style={styles.loadingText}>Creando cuenta...</Text>
            </View>
          ) : (
            <Pressable 
              style={styles.button} 
              onPress={handleRegistro}
              disabled={cargando}
            >
              <Text style={styles.buttonText}>Registrarse</Text>
            </Pressable>
          )}

          <Pressable 
            onPress={() => navigation.replace("Login")}
            disabled={cargando}
          >
            <Text style={styles.loginLinkText}>
              ¿Ya tienes cuenta? Inicia sesión
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
    elevation: 8,
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
  headerImage: {
    width: 90,
    height: 90,
    marginBottom: 20,
    resizeMode: "contain",
  },
  loadingContainer: {
    alignItems: "center",
    marginVertical: 15,
    width: "100%",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
});