import React from "react";
import {View,Text,StyleSheet,Image,ScrollView,TouchableOpacity,
} from "react-native";

import BarraProgreso from "./components/BarraProgreso";

export default function Interfaz_Inicio({ navigation }) {
  const opciones = [
    {
      id: 1,
      titulo: "Presupuestos y Gastos",
      descripcion: "Registra y controla tus gastos fácilmente.",
      imagen: require("../assets/iconos/presupuesto.png"),
      destino: { tab: "Presupuestos", screen: "ListaPresupuestos" },
    },
    {
      id: 2,
      titulo: "Historial de Transacciones",
      descripcion: "Consulta tus movimientos recientes.",
      imagen: require("../assets/iconos/historial-de-transacciones.png"),
      destino: "Interfaz_HistorialTransacciones",
    },
    {
      id: 3,
      titulo: "Gráfica Financiera",
      descripcion: "Visualiza tus gastos de forma clara.",
      imagen: require("../assets/iconos/graficas.png"),
      destino: "Interfaz_Grafica",
    },
    {
      id: 4,
      titulo: "Movimientos",
      descripcion: "Agrega ingresos y egresos fácilmente.",
      imagen: require("../assets/iconos/movimientos.png"),
      destino: "Interfaz_Movimientos",
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.titulo}>Ahorra+ App</Text>
          <Text style={styles.subtitulo}>Tu asistente financiero personal</Text>
        </View>

        <Image
          source={require("../assets/iconos/Logo_Cerdo.png")}
          style={styles.logo}
        />
      </View>
      <View style={styles.banner}>
  <View style={styles.bannerLeft}>
    <Text style={styles.bannerTitle}>¡Cuida tus finanzas!</Text>
    <Text style={styles.bannerText}>
      Organiza tus gastos y alcanza tus metas más rápido.
    </Text>
  </View>

  <Image
    source={require("../assets/iconos/Banner.png")}
    style={styles.bannerImg}
  />
</View>
       

      <Text style={styles.sectionTitle}>Funciones Principales</Text>

      <View style={styles.grid}>
        {opciones.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => {
            if (item.destino.tab) {
              navigation.navigate(item.destino.tab, {
                screen: item.destino.screen,
              });
            } else {
              navigation.navigate(item.destino);
            }
          }}
          >
            <Image source={item.imagen} style={styles.cardImage} />
            <Text style={styles.cardTitle}>{item.titulo}</Text>
            <Text style={styles.cardDesc}>{item.descripcion}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <BarraProgreso gasto={1000} presupuesto={5000} />
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    paddingHorizontal: 15,
  },
  header: {
    paddingVertical: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
  },
  subtitulo: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  logo: {
    width: 70,
    height: 70,
    resizeMode: "contain",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#444",
    marginBottom: -50,
    marginTop: -30,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 80,
  },
  card: {
    width: "48%",
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 14,
    marginBottom: 15,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardImage: {
    width: 60,
    height: 60,
    marginBottom: 10,
    resizeMode: "contain",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  cardDesc: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginTop: 5,
  },
   banner: {
  backgroundColor: "#1F64BF",
  marginTop: -10,
  padding: 20,
  borderRadius: 18,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  elevation: 6,
  shadowColor: "#000",
  shadowOpacity: 0.15,
  shadowRadius: 6,
  shadowOffset: { width: 0, height: 3 },

  marginBottom: 40,
},

bannerLeft: {
  flex: 1,
  paddingRight: 10,
},

bannerTitle: {
  fontSize: 18,
  fontWeight: "bold",
  color: "#fff",
  marginBottom: 5,
},

bannerText: {
  fontSize: 14,
  color: "#F0F8FF",
},

bannerImg: {
  width: 70,
  height: 70,
  resizeMode: "contain",
},

});
