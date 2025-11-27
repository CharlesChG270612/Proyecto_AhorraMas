import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Modal,
  Image,
} from "react-native";

export default function ValidandoCredencialesScreen({ navigation, route }) {
  const { usuario, password } = route.params || {};

  useEffect(() => {
    const validarCredenciales = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        const credencialesValidas = usuario && password && 
                                   usuario.length >= 3 && 
                                   password.length >= 3;
        
        if (credencialesValidas) {
         navigation.replace("Tabs", {
  nombre: usuario,
  email: usuario + "@gmail.com",
  telefono: "5512345678",
  userId: "ID-" + Math.floor(Math.random() * 9999),
           });
        }
        
      } catch (error) {
        navigation.replace("Login", { 
          error: "Error de conexión. Intenta nuevamente." 
        });
      }
    };

    validarCredenciales();
  }, [navigation, usuario, password]);

  return (
    <Modal
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.overlay}>
          <View style={styles.content}>


            <Image
                source={require("../assets/iconos/Logo_Cerdo.png")}
                style={styles.headerImage}
                resizeMode="contain" 
            />
            <ActivityIndicator 
              size="large" 
              color="#FFFFFF" 
              style={styles.spinner}
            />
            <Text style={styles.title}>Validando credenciales</Text>
            <Text style={styles.subtitle}>Por favor espera...</Text>
            
            <View style={styles.userContainer}>
              <Text style={styles.userText}>{usuario}</Text>
            </View>

          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: "rgba(15, 26, 36, 0.9)",
    padding: 40,
    borderRadius: 20,
    alignItems: "center",
    minWidth: 280,
    // Sombra suave
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  spinner: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
    marginBottom: 20,
  },
  userContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
  },
  userText: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },
   headerImage: {
    width: 90,
    height: 90,
    marginBottom: 20,
  },
});