import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from 'react-native';

const screenWidth = Dimensions.get("window").width;

// Componente de gráfica de barras personalizado
const GraficaBarras = ({ datos, altura = 200 }) => {
  const maxValor = Math.max(...datos.datasets[0].data);
  
  return (
    <View style={[styles.graficaContainer, { height: altura }]}>
      {/* Líneas de fondo y valores */}
      <View style={styles.ejeY}>
        {[100, 75, 50, 25, 0].map((valor, index) => (
          <View key={index} style={styles.lineaContainer}>
            <Text style={styles.valorEjeY}>${valor}</Text>
            <View style={styles.lineaFondo} />
          </View>
        ))}
      </View>
      
      {/* Barras */}
      <View style={styles.barrasContainer}>
        {datos.datasets[0].data.map((valor, index) => {
          const alturaBarra = (valor / maxValor) * (altura - 60);
          return (
            <View key={index} style={styles.columnaBarra}>
              <Text style={styles.valorBarra}>${valor}</Text>
              <View 
                style={[
                  styles.barra,
                  { height: Math.max(alturaBarra, 10) }
                ]} 
              />
              <Text style={styles.etiquetaBarra}>{datos.labels[index]}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

// Componente de gráfica circular personalizado
const GraficaCircular = ({ datos }) => {
  const total = datos.reduce((sum, item) => sum + item.population, 0);
  
  return (
    <View style={styles.graficaCircularContainer}>
      <View style={styles.leyendaContainer}>
        {datos.map((item, index) => (
          <View key={index} style={styles.itemLeyenda}>
            <View 
              style={[
                styles.colorLeyenda, 
                { backgroundColor: item.color }
              ]} 
            />
            <View style={styles.infoLeyenda}>
              <Text style={styles.nombreLeyenda}>{item.name}</Text>
              <Text style={styles.valorLeyenda}>
                ${item.population} (${((item.population / total) * 100).toFixed(1)}%)
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default function Interfaz_Grafica({ navigation }) {
  const [periodo, setPeriodo] = useState('mes');
  const [cargando, setCargando] = useState(true);
  const [datosMovimientos, setDatosMovimientos] = useState([]);
  const [estadisticas, setEstadisticas] = useState({
    totalIngresos: 0,
    totalGastos: 0,
    balance: 0
  });

  // Datos de ejemplo
  const datosEjemplo = [
    { id: '1', tipo: 'gasto', monto: 450, categoria: 'comida', fecha: '2024-01-05' },
    { id: '2', tipo: 'gasto', monto: 380, categoria: 'transporte', fecha: '2024-01-12' },
    { id: '3', tipo: 'ingreso', monto: 1200, categoria: 'nomina', fecha: '2024-01-15' },
    { id: '4', tipo: 'gasto', monto: 520, categoria: 'servicios', fecha: '2024-01-20' },
    { id: '5', tipo: 'gasto', monto: 300, categoria: 'entretenimiento', fecha: '2024-01-25' },
    { id: '6', tipo: 'gasto', monto: 480, categoria: 'comida', fecha: '2024-02-03' },
    { id: '7', tipo: 'gasto', monto: 420, categoria: 'transporte', fecha: '2024-02-10' },
    { id: '8', tipo: 'ingreso', monto: 1200, categoria: 'nomina', fecha: '2024-02-15' },
    { id: '9', tipo: 'gasto', monto: 350, categoria: 'servicios', fecha: '2024-02-18' },
  ];

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    if (datosMovimientos.length > 0) {
      calcularEstadisticas();
    }
  }, [datosMovimientos, periodo]);

  const cargarDatos = () => {
    setCargando(true);
    setTimeout(() => {
      setDatosMovimientos(datosEjemplo);
      setCargando(false);
    }, 1000);
  };

  const calcularEstadisticas = () => {
    const gastos = datosMovimientos.filter(m => m.tipo === 'gasto');
    const ingresos = datosMovimientos.filter(m => m.tipo === 'ingreso');
    
    const totalGastos = gastos.reduce((sum, m) => sum + m.monto, 0);
    const totalIngresos = ingresos.reduce((sum, m) => sum + m.monto, 0);
    const balance = totalIngresos - totalGastos;

    setEstadisticas({
      totalIngresos,
      totalGastos,
      balance
    });
  };

  const obtenerDatosGrafica = () => {
    switch (periodo) {
      case 'dia':
        return {
          labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
          datasets: [{ data: [150, 80, 200, 120, 180, 90, 160] }]
        };
      case 'mes':
        return {
          labels: ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN'],
          datasets: [{ data: [450, 480, 520, 300, 420, 380] }]
        };
      case 'año':
        return {
          labels: ['2020', '2021', '2022', '2023', '2024'],
          datasets: [{ data: [12000, 15000, 18000, 22000, 8500] }]
        };
      default:
        return {
          labels: ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN'],
          datasets: [{ data: [450, 480, 520, 300, 420, 380] }]
        };
    }
  };

  const obtenerDatosCategorias = () => {
    return [
      { name: 'Comida', population: 930, color: '#FF6B6B' },
      { name: 'Servicios', population: 870, color: '#4ECDC4' },
      { name: 'Transporte', population: 800, color: '#45B7D1' },
      { name: 'Entretenimiento', population: 300, color: '#96CEB4' },
      { name: 'Otros', population: 450, color: '#FFBE76' }
    ];
  };

  if (cargando) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
          <Text style={styles.loadingText}>Cargando gráficas...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const datosGrafica = obtenerDatosGrafica();
  const datosCategorias = obtenerDatosCategorias();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header con flecha de regreso */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.navigate('Inicio')}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Gráficas Financieras</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        
        {/* Selector de Periodo */}
        <View style={styles.periodoContainer}>
          <TouchableOpacity 
            style={[styles.periodoBoton, periodo === 'dia' && styles.periodoBotonActivo]}
            onPress={() => setPeriodo('dia')}
          >
            <Text style={[styles.periodoTexto, periodo === 'dia' && styles.periodoTextoActivo]}>
              Día
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.periodoBoton, periodo === 'mes' && styles.periodoBotonActivo]}
            onPress={() => setPeriodo('mes')}
          >
            <Text style={[styles.periodoTexto, periodo === 'mes' && styles.periodoTextoActivo]}>
              Mes
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.periodoBoton, periodo === 'año' && styles.periodoBotonActivo]}
            onPress={() => setPeriodo('año')}
          >
            <Text style={[styles.periodoTexto, periodo === 'año' && styles.periodoTextoActivo]}>
              Año
            </Text>
          </TouchableOpacity>
        </View>

        {/* Resumen Financiero */}
        <View style={styles.moneyRow}>
          <View style={styles.moneyCard}>
            <Text style={styles.sectionTitle}>Ingresos</Text>
            <Text style={styles.moneyPositive}>+ ${estadisticas.totalIngresos.toFixed(2)}</Text>
          </View>

          <View style={styles.moneyCard}>
            <Text style={styles.sectionTitle}>Gastos</Text>
            <Text style={styles.moneyNegative}>- ${estadisticas.totalGastos.toFixed(2)}</Text>
          </View>
        </View>

        {/* Balance */}
        <View style={[styles.balanceCard, estadisticas.balance >= 0 ? styles.balancePositivo : styles.balanceNegativo]}>
          <Text style={styles.balanceTitle}>Balance Total</Text>
          <Text style={[
            styles.balanceMonto,
            estadisticas.balance >= 0 ? styles.moneyPositive : styles.moneyNegative
          ]}>
            {estadisticas.balance >= 0 ? '+' : ''} ${Math.abs(estadisticas.balance).toFixed(2)}
          </Text>
        </View>

        {/* Gráfica Principal */}
        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>
            Gastos por {periodo === 'dia' ? 'Día (Última semana)' : periodo === 'mes' ? 'Mes' : 'Año'}
          </Text>
          
          <GraficaBarras datos={datosGrafica} altura={220} />
        </View>

        {/* Gráfica de Categorías */}
        <View style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Gastos por Categoría</Text>
          <GraficaCircular datos={datosCategorias} />
        </View>

        {/* Estadísticas Detalladas */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Estadísticas Detalladas</Text>
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Gasto promedio por {periodo}:</Text>
            <Text style={styles.statValue}>
              ${(estadisticas.totalGastos / (periodo === 'dia' ? 7 : periodo === 'mes' ? 6 : 5)).toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Total de transacciones:</Text>
            <Text style={styles.statValue}>{datosMovimientos.length}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Categoría con más gastos:</Text>
            <Text style={styles.statValue}>
              {datosCategorias.length > 0 ? datosCategorias[0].name : 'N/A'}
            </Text>
          </View>

          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Saldo disponible:</Text>
            <Text style={[styles.statValue, estadisticas.balance >= 0 ? styles.moneyPositive : styles.moneyNegative]}>
              ${estadisticas.balance.toFixed(2)}
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 10,
    marginLeft: 10,
  },
  backButtonText: {
    fontSize: 35,
    fontWeight: 'bold',
    color: '#333',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  periodoContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 6,
    marginBottom: 20,
    width: '100%',
  },
  periodoBoton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodoBotonActivo: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  periodoTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  periodoTextoActivo: {
    color: '#4A90E2',
    fontWeight: '700',
  },
  moneyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    width: '100%',
  },
  moneyCard: {
    flex: 1,
    marginHorizontal: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  balanceCard: {
    width: '100%',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  balancePositivo: {
    backgroundColor: '#e8f5e8',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  balanceNegativo: {
    backgroundColor: '#ffebee',
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  balanceTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '600',
  },
  balanceMonto: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#333',
    marginBottom: 15,
    fontWeight: '700',
    textAlign: 'center',
  },
  moneyPositive: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  moneyNegative: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F44336',
  },
  chartCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  // Estilos para gráficas personalizadas
  graficaContainer: {
    width: '100%',
    flexDirection: 'row',
    marginVertical: 10,
  },
  ejeY: {
    width: 40,
    justifyContent: 'space-between',
    marginRight: 10,
  },
  lineaContainer: {
    height: 1,
    justifyContent: 'center',
  },
  valorEjeY: {
    fontSize: 10,
    color: '#666',
    position: 'absolute',
    left: 0,
    top: -8,
  },
  lineaFondo: {
    height: 1,
    backgroundColor: '#f0f0f0',
    width: '100%',
  },
  barrasContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: 30,
  },
  columnaBarra: {
    alignItems: 'center',
    flex: 1,
  },
  valorBarra: {
    fontSize: 10,
    color: '#666',
    marginBottom: 4,
  },
  barra: {
    width: 20,
    backgroundColor: '#4A90E2',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    marginBottom: 8,
  },
  etiquetaBarra: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  graficaCircularContainer: {
    width: '100%',
    padding: 10,
  },
  leyendaContainer: {
    width: '100%',
  },
  itemLeyenda: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 6,
  },
  colorLeyenda: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 12,
  },
  infoLeyenda: {
    flex: 1,
  },
  nombreLeyenda: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  valorLeyenda: {
    fontSize: 12,
    color: '#666',
  },
  statsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
});