import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity,
  Image
} from 'react-native';
import Interfaz_Inicio from "./Interfaz_Inicio";

export default function Interfaz_Grafica() {
  // Datos para el gráfico de gastos mensual
  const monthlyData = [
    { month: 'ENE', amount: 450 },
    { month: 'FEB', amount: 380 },
    { month: 'MAR', amount: 520 },
    { month: 'ABR', amount: 300 },
    { month: 'MAY', amount: 480 },
    { month: 'JUN', amount: 420 },
  ];

  const maxAmount = 600;
const [mostrarApp, setMostrarApp] = useState(false);
  if (mostrarApp) {
    return <Interfaz_Inicio />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
              <TouchableOpacity onPress={() => setMostrarApp(true)} style={styles.btnAtras}>
                <Image
                  source={require("../assets/iconos/flecha-izquierda.png")}
                  style={styles.iconoAtras}
                />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Graficas</Text>
            </View>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        
        {/* Sección: Dinero en y Sacar dinero en misma línea */}
        <View style={styles.moneyRow}>
          {/* Dinero en con contorno gris */}
          <View style={styles.moneyCardGray}>
            <Text style={styles.sectionTitle}>Dinero en</Text>
            <Text style={styles.moneyPositive}>+ $3,456.98</Text>
          </View>

          {/* Sacar dinero con contorno azul */}
          <View style={styles.moneyCardBlue}>
            <Text style={styles.sectionTitle}>Sacar dinero</Text>
            <Text style={styles.moneyNegative}>- $567.25</Text>
          </View>
        </View>

        {/* Sección: Gasto Mensual con contorno */}
        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Gasto Mensual</Text>
          
          {/* Gráfico con escalas y barras - MÁS ALTAS */}
          <View style={styles.chartWrapper}>
            {/* Escala vertical */}
            <View style={styles.yAxis}>
              <Text style={styles.yAxisLabel}>600</Text>
              <Text style={styles.yAxisLabel}>500</Text>
              <Text style={styles.yAxisLabel}>400</Text>
              <Text style={styles.yAxisLabel}>300</Text>
              <Text style={styles.yAxisLabel}>200</Text>
              <Text style={styles.yAxisLabel}>100</Text>
              <Text style={styles.yAxisLabel}>0</Text>
            </View>
            
            {/* Barras del gráfico - MUCHO MÁS ALTAS */}
            <View style={styles.chartContainer}>
              {monthlyData.map((item, index) => {
                const barHeight = (item.amount / maxAmount) * 250;
                return (
                  <View key={index} style={styles.barColumn}>
                    <View style={[styles.bar, { height: barHeight }]} />
                    <Text style={styles.monthText}>{item.month}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Sección: Presupuestos - uno debajo del otro SIN BARRAS */}
        <View style={styles.budgetColumn}>
          
          {/* En presupuesto con contorno azul */}
          <View style={styles.budgetCardBlue}>
            <View style={styles.budgetRow}>
              <Text style={styles.budgetTitle}>En presupuesto</Text>
              <Text style={styles.budgetAmount}>$50.00/ $100.00</Text>
            </View>
            <Text style={styles.budgetSubtitle}>Comprar</Text>
          </View>

          {/* Fuera de presupuesto con contorno gris */}
          <View style={styles.budgetCardGray}>
            <View style={styles.budgetRow}>
              <Text style={styles.budgetTitle}>Fuera de presupuesto</Text>
              <Text style={styles.budgetAmount}>$100.00/ $100.00</Text>
            </View>
          </View>
          
        </View>

      </ScrollView>

      {/* Barra inferior de navegación - MÁS GRANDE */}
      <View style={styles.barraInferior}>
        <TouchableOpacity style={styles.botonIcono} onPress={() => setMostrarApp(true)}>
          <Image
            source={require("../assets/iconos/inicio.png")}
            style={styles.iconoBarra}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.botonIcono}>
          <Image
            source={require("../assets/iconos/buscar.png")}
            style={styles.iconoBarra}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.botonIcono}>
          <Image
            source={require("../assets/iconos/notificaciones.png")}
            style={styles.iconoBarra}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.botonIcono}>
          <Image
            source={require("../assets/iconos/configuraciones.png")}
            style={styles.iconoBarra}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  btnAtras: { position: "absolute", left: 20, padding: 5 },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#222", textAlign: "center" },
  iconoAtras: { width: 25, height: 25, resizeMode: "contain" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 25,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    elevation: 8,
    zIndex: 99,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
    paddingBottom: 100, // Más espacio para la barra más grande
  },
  moneyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginTop: 20,
    width: '100%',
  },
  moneyCardGray: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  moneyCardBlue: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 10,
    fontWeight: '400',
    textAlign: 'center',
  },
  moneyPositive: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
  },
  moneyNegative: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F44336',
    textAlign: 'center',
  },
  chartCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  chartWrapper: {
    flexDirection: 'row',
    marginTop: 10,
    width: '100%',
  },
  yAxis: {
    justifyContent: 'space-between',
    height: 280,
    marginRight: 15,
    paddingVertical: 5,
  },
  yAxisLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '400',
  },
  chartContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 280,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingLeft: 10,
    paddingBottom: 20,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 25,
    backgroundColor: '#4A90E2',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    marginBottom: 8,
    minHeight: 2,
  },
  monthText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '400',
  },
  budgetColumn: {
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  budgetCardBlue: {
    marginBottom: 20,
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#2196F3',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  budgetCardGray: {
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 12,
    padding: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  budgetTitle: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  budgetAmount: {
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
  budgetSubtitle: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
  },
  // Estilos para la barra inferior - MÁS GRANDE
  barraInferior: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 15, // Más padding vertical
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80, // Más altura (era 60)
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  botonIcono: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12, // Más padding (era 8)
    borderRadius: 8,
  },
  iconoBarra: {
    width: 32, // Más grande (era 24)
    height: 32, // Más grande (era 24)
    resizeMode: 'contain',
  },
});
