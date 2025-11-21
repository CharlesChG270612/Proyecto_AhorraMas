import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

export default function MovimientosScreen({ navigation }) {
  const [movimientos, setMovimientos] = useState([
    // Movimientos de Hoy
    { 
      id: 1, 
      nombre: 'CEA', 
      monto: -280, 
      estado: 'Sin éxito', 
      fecha: 'hoy',
      icono: 'tint',
      color: '#4A90E2',
      iconoLib: FontAwesome5
    },
    
    // Movimientos de Ayer
    { 
      id: 2, 
      nombre: 'Pago Nómina', 
      monto: 1200, 
      estado: 'Exitoso', 
      fecha: 'ayer',
      icono: 'money-check',
      color: '#4ECDC4',
      iconoLib: FontAwesome5
    },
    { 
      id: 3, 
      nombre: 'CFE', 
      monto: -480, 
      estado: 'Exitoso', 
      fecha: 'ayer',
      icono: 'flash',
      color: '#45B7D1',
      iconoLib: Ionicons
    },
    { 
      id: 4, 
      nombre: 'Recibiste de: Juan', 
      monto: 500, 
      estado: 'Exitoso', 
      fecha: 'ayer',
      icono: 'swap-horiz',
      color: '#96CEB4',
      iconoLib: MaterialIcons
    },
    { 
      id: 5, 
      nombre: 'Telmex', 
      monto: -100, 
      estado: 'Exitoso', 
      fecha: 'ayer',
      icono: 'call',
      color: '#FFBE76',
      iconoLib: Ionicons
    },
    { 
      id: 6, 
      nombre: 'Pago Nómina', 
      monto: 1200, 
      estado: 'Exitoso', 
      fecha: 'ayer',
      icono: 'money-check',
      color: '#4ECDC4',
      iconoLib: FontAwesome5
    },
    { 
      id: 7, 
      nombre: 'CFE', 
      monto: -480, 
      estado: 'Exitoso', 
      fecha: 'ayer',
      icono: 'flash',
      color: '#45B7D1',
      iconoLib: Ionicons
    },
    { 
      id: 8, 
      nombre: 'Recibiste de: María', 
      monto: 500, 
      estado: 'Exitoso', 
      fecha: 'ayer',
      icono: 'swap-horiz',
      color: '#96CEB4',
      iconoLib: MaterialIcons
    },
    { 
      id: 9, 
      nombre: 'Telmex', 
      monto: -100, 
      estado: 'Exitoso', 
      fecha: 'ayer',
      icono: 'call',
      color: '#FFBE76',
      iconoLib: Ionicons
    },
    { 
      id: 10, 
      nombre: 'Pago Nómina Extra', 
      monto: 800, 
      estado: 'Exitoso', 
      fecha: 'ayer',
      icono: 'money-check',
      color: '#4ECDC4',
      iconoLib: FontAwesome5
    },
    { 
      id: 11, 
      nombre: 'CFE', 
      monto: -320, 
      estado: 'Exitoso', 
      fecha: 'ayer',
      icono: 'flash',
      color: '#45B7D1',
      iconoLib: Ionicons
    },
    { 
      id: 12, 
      nombre: 'Recibiste de: Pedro', 
      monto: 300, 
      estado: 'Exitoso', 
      fecha: 'ayer',
      icono: 'swap-horiz',
      color: '#96CEB4',
      iconoLib: MaterialIcons
    },
    { 
      id: 13, 
      nombre: 'Telmex', 
      monto: -150, 
      estado: 'Exitoso', 
      fecha: 'ayer',
      icono: 'call',
      color: '#FFBE76',
      iconoLib: Ionicons
    }
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [movimientoEditando, setMovimientoEditando] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevoMonto, setNuevoMonto] = useState('');

  // Función para eliminar movimiento
  const eliminarMovimiento = (id) => {
    Alert.alert(
      "Eliminar Movimiento",
      "¿Estás seguro de que quieres eliminar este movimiento?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        { 
          text: "Eliminar", 
          onPress: () => {
            setMovimientos(movimientos.filter(mov => mov.id !== id));
          },
          style: "destructive"
        }
      ]
    );
  };

  // Función para editar movimiento
  const iniciarEdicion = (movimiento) => {
    setMovimientoEditando(movimiento);
    setNuevoNombre(movimiento.nombre);
    setNuevoMonto(Math.abs(movimiento.monto).toString());
    setModalVisible(true);
  };

  const guardarEdicion = () => {
    if (nuevoNombre && nuevoMonto) {
      const montoNumero = movimientoEditando.monto < 0 ? -Math.abs(parseFloat(nuevoMonto)) : Math.abs(parseFloat(nuevoMonto));
      
      setMovimientos(movimientos.map(mov => 
        mov.id === movimientoEditando.id 
          ? { ...mov, nombre: nuevoNombre, monto: montoNumero }
          : mov
      ));
      setModalVisible(false);
      setMovimientoEditando(null);
      setNuevoNombre('');
      setNuevoMonto('');
    }
  };

  // Función para marcar como depositado/exitoso - SOLO para movimientos no exitosos
  const depositarMovimiento = (id, movimiento) => {
    // Solo mostrar alerta si el movimiento NO es exitoso
    if (movimiento.estado !== 'Exitoso') {
      Alert.alert(
        "Depositar Movimiento",
        "¿Confirmas que deseas marcar este movimiento como depositado?",
        [
          {
            text: "Cancelar",
            style: "cancel"
          },
          { 
            text: "Depositar", 
            onPress: () => {
              setMovimientos(movimientos.map(mov => 
                mov.id === id ? { ...mov, estado: 'Exitoso' } : mov
              ));
              Alert.alert("Éxito", "Se ha pagado correctamente");
            }
          }
        ]
      );
    }
    // Si ya es exitoso, no hacer nada al hacer clic
  };

  // Función para agrupar movimientos por fecha
  const movimientosPorFecha = movimientos.reduce((acc, mov) => {
    if (!acc[mov.fecha]) {
      acc[mov.fecha] = [];
    }
    acc[mov.fecha].push(mov);
    return acc;
  }, {});

  const renderMovimientoItem = (movimiento) => {
    const IconComponent = movimiento.iconoLib;
    const esExitoso = movimiento.estado === 'Exitoso';
    
    return (
      <TouchableOpacity 
        key={movimiento.id}
        style={[
          styles.movimientoItem,
          esExitoso ? styles.movimientoExitoso : styles.movimientoPendiente
        ]}
        onPress={() => depositarMovimiento(movimiento.id, movimiento)}
        onLongPress={() => {
          Alert.alert(
            "Opciones",
            "¿Qué deseas hacer con este movimiento?",
            [
              {
                text: "Editar",
                onPress: () => iniciarEdicion(movimiento)
              },
              {
                text: "Eliminar",
                onPress: () => eliminarMovimiento(movimiento.id),
                style: "destructive"
              },
              {
                text: "Cancelar",
                style: "cancel"
              }
            ]
          );
        }}
      >
        <View style={[styles.iconoContainer, { backgroundColor: movimiento.color }]}>
          <IconComponent name={movimiento.icono} size={24} color="#fff" />
        </View>
        <View style={styles.movimientoInfo}>
          <Text style={styles.movimientoNombre}>{movimiento.nombre}</Text>
          {movimiento.estado && (
            <Text style={[
              styles.movimientoEstado,
              esExitoso ? styles.estadoExitoso : styles.estadoSinExito
            ]}>
              {movimiento.estado}
            </Text>
          )}
        </View>
        <Text style={movimiento.monto >= 0 ? styles.movimientoMontoPositivo : styles.movimientoMontoNegativo}>
          {movimiento.monto >= 0 ? '+ ' : '- '}${Math.abs(movimiento.monto)}
        </Text>
      </TouchableOpacity>
    );
  };

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

        {/* Secciones por fecha */}
        {Object.entries(movimientosPorFecha).map(([fecha, movs]) => (
          <View key={fecha} style={styles.section}>
            <Text style={styles.sectionTitle}>
              {fecha === 'hoy' ? 'Hoy' : 'Ayer'}
            </Text>
            {movs.map(renderMovimientoItem)}
          </View>
        ))}

      </ScrollView>

      {/* Modal para editar movimiento */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Movimiento</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nombre del movimiento"
              value={nuevoNombre}
              onChangeText={setNuevoNombre}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Monto"
              keyboardType="numeric"
              value={nuevoMonto}
              onChangeText={setNuevoMonto}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.saveButton]}
                onPress={guardarEdicion}
              >
                <Text style={styles.saveButtonText}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 20, // Reducido ya que no hay barra inferior
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
  movimientoExitoso: {
    opacity: 0.7, // Un poco más transparente para movimientos exitosos
  },
  movimientoPendiente: {
    // Estilo normal para movimientos pendientes
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
    fontStyle: 'italic',
  },
  estadoExitoso: {
    color: '#4CAF50',
  },
  estadoSinExito: {
    color: '#F44336',
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
  // Estilos para el modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});