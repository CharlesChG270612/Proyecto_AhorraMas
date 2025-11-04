import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity,
  Image
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const MovimientosScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
      >
        
        {/* Header con flecha de regreso */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Movimientos</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Sección Hoy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hoy</Text>
          
          {/* Movimiento 1 - CEA con icono de gota */}
          <View style={styles.movimientoItem}>
            <View style={[styles.iconoContainer, { backgroundColor: '#4A90E2' }]}>
              <FontAwesome5 name="tint" size={24} color="#fff" />
            </View>
            <View style={styles.movimientoInfo}>
              <Text style={styles.movimientoNombre}>CEA</Text>
              <Text style={styles.movimientoEstado}>Sin éxito</Text>
            </View>
            <Text style={styles.movimientoMontoNegativo}>- $280</Text>
          </View>
        </View>

        {/* Sección Ayer */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ayer</Text>
          
          {/* Movimiento 1 - Nómina */}
          <View style={styles.movimientoItem}>
            <View style={[styles.iconoContainer, { backgroundColor: '#4ECDC4' }]}>
              <FontAwesome5 name="money-check" size={22} color="#fff" />
            </View>
            <View style={styles.movimientoInfo}>
              <Text style={styles.movimientoNombre}>Pago Nómina</Text>
            </View>
            <Text style={styles.movimientoMontoPositivo}>+$1200</Text>
          </View>

          {/* Movimiento 2 - CFE */}
          <View style={styles.movimientoItem}>
            <View style={[styles.iconoContainer, { backgroundColor: '#45B7D1' }]}>
              <Ionicons name="flash" size={26} color="#fff" />
            </View>
            <View style={styles.movimientoInfo}>
              <Text style={styles.movimientoNombre}>CFE</Text>
              <Text style={styles.movimientoEstado}>Exitoso</Text>
            </View>
            <Text style={styles.movimientoMontoNegativo}>- $480</Text>
          </View>

          {/* Movimiento 3 - Transferencia recibida */}
          <View style={styles.movimientoItem}>
            <View style={[styles.iconoContainer, { backgroundColor: '#96CEB4' }]}>
              <MaterialIcons name="swap-horiz" size={26} color="#fff" />
            </View>
            <View style={styles.movimientoInfo}>
              <Text style={styles.movimientoNombre}>Recibiste de : Juan</Text>
            </View>
            <Text style={styles.movimientoMontoPositivo}>+ $500</Text>
          </View>

          {/* Movimiento 4 - Telmex */}
          <View style={styles.movimientoItem}>
            <View style={[styles.iconoContainer, { backgroundColor: '#FFBE76' }]}>
              <Ionicons name="call" size={22} color="#fff" />
            </View>
            <View style={styles.movimientoInfo}>
              <Text style={styles.movimientoNombre}>Telmex</Text>
              <Text style={styles.movimientoEstado}>Exitoso</Text>
            </View>
            <Text style={styles.movimientoMontoNegativo}>- $100</Text>
          </View>

          {/* Movimiento 5 - Nómina */}
          <View style={styles.movimientoItem}>
            <View style={[styles.iconoContainer, { backgroundColor: '#4ECDC4' }]}>
              <FontAwesome5 name="money-check" size={22} color="#fff" />
            </View>
            <View style={styles.movimientoInfo}>
              <Text style={styles.movimientoNombre}>Pago Nómina</Text>
            </View>
            <Text style={styles.movimientoMontoPositivo}>+$1200</Text>
          </View>

          {/* Movimiento 6 - CFE */}
          <View style={styles.movimientoItem}>
            <View style={[styles.iconoContainer, { backgroundColor: '#45B7D1' }]}>
              <Ionicons name="flash" size={26} color="#fff" />
            </View>
            <View style={styles.movimientoInfo}>
              <Text style={styles.movimientoNombre}>CFE</Text>
              <Text style={styles.movimientoEstado}>Exitoso</Text>
            </View>
            <Text style={styles.movimientoMontoNegativo}>- $480</Text>
          </View>

          {/* Movimiento 7 - Transferencia recibida */}
          <View style={styles.movimientoItem}>
            <View style={[styles.iconoContainer, { backgroundColor: '#96CEB4' }]}>
              <MaterialIcons name="swap-horiz" size={26} color="#fff" />
            </View>
            <View style={styles.movimientoInfo}>
              <Text style={styles.movimientoNombre}>Recibiste de : María</Text>
            </View>
            <Text style={styles.movimientoMontoPositivo}>+ $500</Text>
          </View>

          {/* Movimiento 8 - Telmex */}
          <View style={styles.movimientoItem}>
            <View style={[styles.iconoContainer, { backgroundColor: '#FFBE76' }]}>
              <Ionicons name="call" size={22} color="#fff" />
            </View>
            <View style={styles.movimientoInfo}>
              <Text style={styles.movimientoNombre}>Telmex</Text>
              <Text style={styles.movimientoEstado}>Exitoso</Text>
            </View>
            <Text style={styles.movimientoMontoNegativo}>- $100</Text>
          </View>

          {/* Movimientos adicionales para hacer scroll más evidente */}
          <View style={styles.movimientoItem}>
            <View style={[styles.iconoContainer, { backgroundColor: '#4ECDC4' }]}>
              <FontAwesome5 name="money-check" size={22} color="#fff" />
            </View>
            <View style={styles.movimientoInfo}>
              <Text style={styles.movimientoNombre}>Pago Nómina Extra</Text>
            </View>
            <Text style={styles.movimientoMontoPositivo}>+$800</Text>
          </View>

          <View style={styles.movimientoItem}>
            <View style={[styles.iconoContainer, { backgroundColor: '#45B7D1' }]}>
              <Ionicons name="flash" size={26} color="#fff" />
            </View>
            <View style={styles.movimientoInfo}>
              <Text style={styles.movimientoNombre}>CFE</Text>
              <Text style={styles.movimientoEstado}>Exitoso</Text>
            </View>
            <Text style={styles.movimientoMontoNegativo}>- $320</Text>
          </View>

          <View style={styles.movimientoItem}>
            <View style={[styles.iconoContainer, { backgroundColor: '#96CEB4' }]}>
              <MaterialIcons name="swap-horiz" size={26} color="#fff" />
            </View>
            <View style={styles.movimientoInfo}>
              <Text style={styles.movimientoNombre}>Recibiste de : Pedro</Text>
            </View>
            <Text style={styles.movimientoMontoPositivo}>+ $300</Text>
          </View>

          <View style={styles.movimientoItem}>
            <View style={[styles.iconoContainer, { backgroundColor: '#FFBE76' }]}>
              <Ionicons name="call" size={22} color="#fff" />
            </View>
            <View style={styles.movimientoInfo}>
              <Text style={styles.movimientoNombre}>Telmex</Text>
              <Text style={styles.movimientoEstado}>Exitoso</Text>
            </View>
            <Text style={styles.movimientoMontoNegativo}>- $150</Text>
          </View>

        </View>

      </ScrollView>

      {/* Barra inferior con iconos más grandes */}
      <View style={styles.barraInferior}>
        <TouchableOpacity style={styles.botonIcono}>
          <Image
            source={require("./assets/iconos/inicio.png")}
            style={styles.iconoBarra}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.botonIcono}>
          <Image
            source={require("./assets/iconos/buscar.png")}
            style={styles.iconoBarra}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.botonIcono}>
          <Image
            source={require("./assets/iconos/notificaciones.png")}
            style={styles.iconoBarra}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.botonIcono}>
          <Image
            source={require("./assets/iconos/configuraciones.png")}
            style={styles.iconoBarra}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 100, // Espacio para la barra inferior
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  movimientoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f8f8',
  },
  iconoContainer: {
    width: 40,
    height: 40,
    borderRadius: 25,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  movimientoInfo: {
    flex: 1,
  },
  movimientoNombre: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  movimientoEstado: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  movimientoMontoPositivo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  movimientoMontoNegativo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F44336',
  },
  barraInferior: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingVertical: 15,
    paddingHorizontal: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
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
    padding: 12,
    borderRadius: 8,
  },
  iconoBarra: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
});

export default MovimientosScreen;