import React, { useEffect } from "react";
import { View, Image, StyleSheet, ActivityIndicator } from "react-native";

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace("Login");
    }, 3000);
  }, []);

  return (
    <View style={styles.container}>
      <Image
            source={require("../assets/iconos/Logo.png")}
            style={styles.logo}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
   logo: {
    width: 300,    
    height: 300,
    resizeMode: "contain",
    marginBottom: 20,
  },
});
