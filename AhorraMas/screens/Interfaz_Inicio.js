import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  TouchableOpacity 
} from "react-native";

export default function Interfaz_Inicio({ navigation }) {

  const opciones = [
    {
      id: 1,
      titulo: "Presupuestos y Gastos",
      descripcion: "Registra y controla tus gastos fácilmente.",
      imagen: require("../assets/iconos/presupuesto.png"),
      destino: "Interfaz_PresupuestosGastos",
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
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.titulo}>Ahorra+ App</Text>
        <Text style={styles.subtitulo}>Tu asistente financiero personal</Text>
      </View>

      

      {/* Opciones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Funciones Principales</Text>

        {opciones.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => navigation.navigate(item.destino)}
          >
            <Image source={item.imagen} style={styles.cardImage} />

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.titulo}</Text>
              <Text style={styles.cardDesc}>{item.descripcion}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
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
    alignItems: "center",
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

  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  banner: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },

  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#444",
    marginBottom: 10,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "center",
  },

  cardImage: {
    width: 60,
    height: 60,
    marginRight: 15,
    resizeMode: "contain",
  },

  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardDesc: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
});
