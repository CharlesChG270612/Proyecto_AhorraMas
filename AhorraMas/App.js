import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import Interfaz_Registrarse from './screens/Interfaz_Registrarse';
import Interfaz_Inicio from './screens/Interfaz_Inicio';

export default function App() {
  const [pantalla, setPantalla] = useState('login'); // 👈 controla qué pantalla se muestra
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (usuario.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Por favor completa tu Usuario y Contraseña.');
      return;
    }

    Alert.alert('Inicio de Sesión', `Bienvenido, ${usuario}`);
    setPantalla('inicio'); // 👈 aquí cambia a la pantalla de inicio
  };

  // 👇 Renderizado condicional de pantallas
  if (pantalla === 'registro') {
    return <Interfaz_Registrarse volverAlLogin={() => setPantalla('login')} />;
  }

  if (pantalla === 'inicio') {
    return <Interfaz_Inicio cerrarSesion={() => setPantalla('login')} />;
  }

  // 👇 Pantalla de login
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Inicia Sesión</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.formCard}>
          <Text style={styles.title}>BIENVENIDO DE NUEVO</Text>
          <Text>HOLA, INICIA SESIÓN PARA CONTINUAR</Text>

          <Image
            source={require('./assets/iconos/entrar.png')}
            style={styles.headerImage}
          />

          <Text style={styles.label}>Usuario:</Text>
          <TextInput
            style={styles.input}
            placeholder="Usuario"
            placeholderTextColor="#999"
            value={usuario}
            onChangeText={setUsuario}
            autoCapitalize="words"
          />

          <Text style={styles.label}>Contraseña:</Text>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { opacity: pressed ? 0.8 : 1.0 },
            ]}
            onPress={handleLogin}
          >
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.loginLink,
              { opacity: pressed ? 0.6 : 1.0 },
            ]}
            onPress={() => setPantalla('registro')}
          >
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
  safeArea: { flex: 1, backgroundColor: '#2196F3' },
  header: { padding: 10 },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  formCard: {
    backgroundColor: '#ffffff',
    padding: 25,
    borderRadius: 15,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5.46,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#7f1cc5ff',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  input: {
    height: 50,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#03A9F4',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: { marginBottom: 20, padding: 5 },
  loginLinkText: { color: '#1976D2', fontSize: 15 },
  headerImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 20,
  },
});
