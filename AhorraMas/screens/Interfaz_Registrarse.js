import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Switch,
  Pressable,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';

export default function Interfaz_Registrarse({ volverAlLogin }) {
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);

  const validarEmail = (correo) => {
    // Expresión regular para validar formato de correo electrónico
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(correo);
  };

  const handleRegistro = () => {
    if (nombreCompleto.trim() === '' || email.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }

    // Validar formato del correo
    if (!validarEmail(email)) {
      Alert.alert('Correo inválido', 'Por favor ingresa un correo electrónico válido.');
      return;
    }

    if (!aceptaTerminos) {
      Alert.alert('Aviso', 'Debes aceptar los términos y condiciones.');
      return;
    }

    Alert.alert('Registro exitoso', `¡Bienvenido, ${nombreCompleto}!`);
    volverAlLogin();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Crear Cuenta</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.formCard}>
          <Text style={styles.title}>¡BIENVENIDO!</Text>
          <Text>Crea tu usuario para continuar</Text>

          <Image
            source={require('../assets/iconos/inicioS.png')}
            style={styles.headerImage}
          />

          <Text style={styles.label}>Nombre Completo:</Text>
          <TextInput
            style={styles.input}
            placeholder="Escribe tu nombre completo"
            placeholderTextColor="#999"
            value={nombreCompleto}
            onChangeText={setNombreCompleto}
          />

          <Text style={styles.label}>Correo Electrónico:</Text>
          <TextInput
            style={styles.input}
            placeholder="tu.correo@ejemplo.com"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
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
            autoCapitalize="none"
          />

          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Acepto los Términos y Condiciones</Text>
            <Switch
              trackColor={{ false: '#ccc', true: '#64b5f6' }}
              thumbColor={aceptaTerminos ? '#1976D2' : '#f4f3f4'}
              onValueChange={() => setAceptaTerminos(!aceptaTerminos)}
              value={aceptaTerminos}
            />
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { opacity: pressed ? 0.8 : 1.0 },
            ]}
            onPress={handleRegistro}
          >
            <Text style={styles.buttonText}>Crear Cuenta</Text>
          </Pressable>

          <Pressable style={styles.loginLink} onPress={volverAlLogin}>
            <Text style={styles.loginLinkText}>
              ¿Ya tienes cuenta? Inicia sesión aquí
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7f1cc5ff',
    marginBottom: 10,
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
    backgroundColor: '#f9f9f9',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 25,
  },
  switchLabel: {
    color: '#555',
    fontSize: 15,
    flex: 1,
    marginRight: 10,
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
