import React, { useState } from "react";
import {View,Text,StyleSheet,TextInput,Pressable,Alert,Image,SafeAreaView,KeyboardAvoidingView,Platform,ActivityIndicator,} from "react-native";

export default function Interfaz_Registrarse({ navigation }) {
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargando, setCargando] = useState(false);

 const handleRegistro = () => {
  if (!usuario.trim()) {
    Alert.alert("Falta información", "Ingresa un nombre de usuario.");
    return;
  }

  if (!email.trim()) {
    Alert.alert("Falta información", "Ingresa un correo electrónico.");
    return;
  }

  const regexEmail =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!regexEmail.test(email)) {
    Alert.alert("Correo inválido", "Ingresa un correo electrónico válido.");
    return;
  }

  if (!password.trim()) {
    Alert.alert("Falta información", "Ingresa una contraseña.");
    return;
  }

  if (password.length < 6) {
    Alert.alert(
      "Contraseña débil",
      "La contraseña debe tener al menos 6 caracteres."
    );
    return;
  }

  setCargando(true);

    setTimeout(() => {
      setCargando(false);
      Alert.alert("Registrado", "Tu cuenta ha sido creada exitosamente.");
      navigation.replace("Login");
    }, 3000);
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
            placeholder="Usuario"
            placeholderTextColor="#999"
            value={usuario}
            onChangeText={setUsuario}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Correo electrónico:</Text>
          <TextInput
            style={styles.input}
            placeholder="Correo"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
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

          {cargando ? (
            <View style={{ alignItems: "center", marginTop: 10 }}>
              <ActivityIndicator size="large" color="#03A9F4" />
              <Text style={{ marginTop: 10, fontSize: 16 }}>
                Validando credenciales...
              </Text>
            </View>
          ) : (
            <Pressable style={styles.button} onPress={handleRegistro}>
              <Text style={styles.buttonText}>Guardar</Text>
            </Pressable>
          )}

          <Pressable onPress={() => navigation.replace("Login")}>
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
  safeArea: { flex: 1, backgroundColor: "#2778BF" },
  header: { padding: 50 },
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
});
