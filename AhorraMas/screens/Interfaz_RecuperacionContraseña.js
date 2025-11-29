import React, { useState } from "react";
import {View,Text,StyleSheet,TextInput,Pressable,Alert,Image,SafeAreaView,KeyboardAvoidingView,Platform,ActivityIndicator,ScrollView,} from "react-native";
import ControladorAutenticacion from "../controllers/ControladorAutenticacion";

export default function Interfaz_RecuperacionContraseña({ navigation }) {
  const [usuarioOCorreo, setUsuarioOCorreo] = useState("");
  const [cargando, setCargando] = useState(false);
  const [contraseñaEncontrada, setContraseñaEncontrada] = useState("");
  const [usuarioEncontrado, setUsuarioEncontrado] = useState("");

  const handleRecuperar = async () => {
    if (!usuarioOCorreo.trim()) {
      Alert.alert("Error", "Ingresa tu usuario o correo electrónico.");
      return;
    }

    setCargando(true);
    setContraseñaEncontrada("");
    setUsuarioEncontrado("");

    try {
      const resultado = await ControladorAutenticacion.recuperarContraseña({
        usuarioOCorreo: usuarioOCorreo.trim()
      });

      setCargando(false);

      if (resultado.exito) {
        setContraseñaEncontrada(resultado.contraseña);
        setUsuarioEncontrado(resultado.usuario);
      } else {
        Alert.alert("Error", resultado.mensaje);
      }
    } catch (error) {
      setCargando(false);
      Alert.alert("Error", "Ocurrió un error inesperado. Intenta nuevamente.");
    }
  };

  const limpiarResultado = () => {
    setContraseñaEncontrada("");
    setUsuarioEncontrado("");
    setUsuarioOCorreo("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.formCard}>
            <Text style={styles.title}>Recuperar Contraseña</Text>
            <Text style={styles.descripcion}>
              Ingresa tu usuario o correo electrónico para recuperar tu contraseña
            </Text>

            <Image
              source={require("../assets/iconos/entrar.png")}
              style={styles.headerImage}
            />

            <Text style={styles.label}>Usuario o Correo:</Text>
            <TextInput
              style={styles.input}
              placeholder="Usuario o correo electrónico"
              placeholderTextColor="#999"
              value={usuarioOCorreo}
              onChangeText={setUsuarioOCorreo}
              autoCapitalize="none"
              editable={!cargando}
            />

            {cargando ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#03A9F4" />
                <Text style={styles.loadingText}>Buscando tu cuenta...</Text>
              </View>
            ) : (
              <Pressable 
                style={styles.button} 
                onPress={handleRecuperar}
                disabled={cargando}
              >
                <Text style={styles.buttonText}>Buscar Contraseña</Text>
              </Pressable>
            )}

            {contraseñaEncontrada ? (
              <View style={styles.resultadoContainer}>
                <Text style={styles.resultadoTitulo}>¡Contraseña Encontrada!</Text>
                <Text style={styles.resultadoUsuario}>Usuario: {usuarioEncontrado}</Text>
                <View style={styles.contraseñaContainer}>
                  <Text style={styles.contraseñaLabel}>Tu contraseña es:</Text>
                  <Text style={styles.contraseñaTexto}>{contraseñaEncontrada}</Text>
                </View>
                <Pressable 
                  style={styles.botonSecundario} 
                  onPress={limpiarResultado}
                >
                  <Text style={styles.botonSecundarioTexto}>Buscar Otra Cuenta</Text>
                </Pressable>
              </View>
            ) : null}

            <Pressable 
              onPress={() => navigation.navigate("Login")}
              disabled={cargando}
              style={styles.linkContainer}
            >
              <Text style={styles.loginLinkText}>
                Volver al inicio de sesión
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: "#2778BF" 
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
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
    textAlign: "center",
  },
  descripcion: {
    marginBottom: 20,
    textAlign: "center",
    color: "#666",
    lineHeight: 20,
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
  linkContainer: {
    marginTop: 10,
  },
  loginLinkText: {
    color: "#1976D2",
    fontSize: 15,
  },
  resultadoContainer: {
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#28a745",
  },
  resultadoTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#28a745",
    marginBottom: 10,
    textAlign: "center",
  },
  resultadoUsuario: {
    fontSize: 16,
    color: "#555",
    marginBottom: 15,
    textAlign: "center",
  },
  contraseñaContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dee2e6",
    marginBottom: 15,
  },
  contraseñaLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  contraseñaTexto: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  botonSecundario: {
    backgroundColor: "#6c757d",
    paddingVertical: 10,
    borderRadius: 20,
    width: "100%",
    alignItems: "center",
  },
  botonSecundarioTexto: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});