import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';


export default function Interfaz_Login() {
    // 1. Manejo del estado para los campos de entrada
    const [name, setname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
   

    // Función que se ejecuta al presionar el botón de inicio de sesión
    const mostrarAlerta = () => {
    
        if (!name || !email || !password) {
           
            Alert.alert('Éxito', '¡Inicio de sesión correcto!');
            //Limpiar campos 
            setname(''); 
            setPassword('');
            setEmail('');       
        }
        else {
            // mensaje de error
            Alert.alert('Error', 'Usuario o contraseña incorrectos.');
            //Limpiar solo la contraseña 
            setPassword('');
        }
    };

    return (
            <View style={styles.container}>

            <Text style={styles.titleSesion}>Iniciar Sesión</Text> 
            
          
            

        <View style={styles.overlay}>
          {/* Texto principal */}
          <Text style={styles.textoBienvenida}>BIENVENIDO</Text> 
            
          <Text style={styles.mensaje}>HOLA, CREA TU USUARIO PARA CONTINUAR</Text>

        </View>


            {/* Campo de Usuario */}
            <TextInput
                style={styles.input}
                placeholder="Nombre de usuario"
                placeholderTextColor="#999"
                onChangeText={setUsername} // Actualiza el estado 'username'
                value={username}
                autoCapitalize="none"
            />

            {/* Campo de Contraseña */}
            <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#999"
                onChangeText={setPassword} // Actualiza el estado 'password'
                value={password}
                secureTextEntry={true} // Oculta los caracteres
            />

            {/* Botón de Inicio de Sesión */}
            <TouchableOpacity style={styles.button} onPress={mostrarAlerta}>
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>

            <StatusBar style="auto" />
        </View>
    );
}

// Estilos   
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#72a2c7ff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 40,
        color: '#333',
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#007bff',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    textoBienvenida: {
        fontSize: 32, 
        fontWeight: '900',
        marginBottom: 20,
        color: 'purple', 
        textAlign: 'center',
    },

 titleSesion: {
        fontSize: 28, 
        fontWeight: '900',
        marginBottom: 20,
        color: 'white', 
        textAlign: 'rigth',
    },
     mensaje: {
        fontSize: 25, 
        fontWeight: '900',
        marginBottom: 20,
        color: 'black', 
        textAlign: 'center',
    },
    overlay: {
    backgroundColor: 'rgba(250, 247, 247, 0.9)', 
    padding: 20, 
    borderRadius: 10, 
  },
});