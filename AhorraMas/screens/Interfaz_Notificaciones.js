import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import ControladorAutenticacion from '../controllers/ControladorAutenticacion';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Interfaz_Notificaciones() {
  const navigation = useNavigation();
  const [notificaciones, setNotificaciones] = useState([]);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    cargarNotificaciones();
  }, []);

  const cargarNotificaciones = async () => {
    try {
      const usuarioActual = await ControladorAutenticacion.obtenerUsuarioActual();
      if (!usuarioActual) return;

      setUsuario(usuarioActual);
      
      const claves = await AsyncStorage.getAllKeys();
      const clavesNotificaciones = claves.filter(key => 
        key.startsWith('ahorraplus_notificaciones_')
      );
      
      const items = await AsyncStorage.multiGet(clavesNotificaciones);
      const notifs = items.map(([key, value]) => {
        try {
          const notif = JSON.parse(value);
          return notif.usuario_id === usuarioActual.id ? notif : null;
        } catch (error) {
          return null;
        }
      }).filter(Boolean).sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      
      setNotificaciones(notifs);
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    }
  };

  const eliminarNotificacion = async (id) => {
    try {
      await AsyncStorage.removeItem(`ahorraplus_notificaciones_${id}`);
      setNotificaciones(prev => prev.filter(notif => notif.id !== id));
    } catch (error) {
      console.error('Error eliminando notificación:', error);
    }
  };

  const agruparNotificacionesPorFecha = () => {
    const hoy = new Date().toDateString();
    const ayer = new Date(Date.now() - 86400000).toDateString();
    
    const grupos = {
      hoy: [],
      ayer: [],
      anteriores: []
    };

    notificaciones.forEach(notif => {
      const fechaNotif = new Date(notif.fecha).toDateString();
      
      if (fechaNotif === hoy) {
        grupos.hoy.push(notif);
      } else if (fechaNotif === ayer) {
        grupos.ayer.push(notif);
      } else {
        grupos.anteriores.push(notif);
      }
    });

    return grupos;
  };

  const grupos = agruparNotificacionesPorFecha();

  const renderNotificacion = (notif) => {
    let icono, color;
    
    switch (notif.tipo) {
      case 'presupuesto_excedido':
        icono = <Ionicons name="warning" size={24} color="#fff" />;
        color = "#FF6B6B";
        break;
      case 'presupuesto_actualizado':
        icono = <FontAwesome5 name="money-bill-wave" size={22} color="#fff" />;
        color = "#4ECDC4";
        break;
      case 'gasto_registrado':
        icono = <Ionicons name="cash" size={24} color="#fff" />;
        color = "#45B7D1";
        break;
      default:
        icono = <Ionicons name="notifications" size={24} color="#fff" />;
        color = "#4A90E2";
    }

    return (
      <View key={notif.id} style={styles.notificacionItem}>
        <View style={[styles.iconoContainer, { backgroundColor: color }]}>
          {icono}
        </View>
        <View style={styles.notificacionInfo}>
          <Text style={styles.notificacionTitulo}>{notif.titulo}</Text>
          <Text style={styles.notificacionTexto}>{notif.mensaje}</Text>
          <Text style={styles.notificacionFecha}>
            {new Date(notif.fecha).toLocaleString()}
          </Text>
        </View>
        <TouchableOpacity 
          onPress={() => eliminarNotificacion(notif.id)}
          style={styles.btnEliminar}
        >
          <Text style={styles.textoEliminar}>×</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.btnAtras}
        >
          <Image
            source={require("../assets/iconos/flecha-izquierda.png")}
            style={styles.iconoAtras}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Notificaciones</Text>
        
        <TouchableOpacity onPress={cargarNotificaciones} style={styles.btnActualizar}>
          <Image source={require("../assets/iconos/actualizar.png")} style={styles.iconoSuperior} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {grupos.hoy.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hoy</Text>
            {grupos.hoy.map(renderNotificacion)}
          </View>
        )}

        {grupos.ayer.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ayer</Text>
            {grupos.ayer.map(renderNotificacion)}
          </View>
        )}

        {grupos.anteriores.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Anteriores</Text>
            {grupos.anteriores.map(renderNotificacion)}
          </View>
        )}

        {notificaciones.length === 0 && (
          <View style={styles.contenedorVacio}>
            <Text style={styles.textoVacio}>No hay notificaciones</Text>
            <Text style={styles.subtextoVacio}>
              Las notificaciones sobre tus presupuestos aparecerán aquí
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 25,
    paddingHorizontal: 20,
    backgroundColor: "#f8f9fa",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    elevation: 8,
  },
  iconoSuperior: { width: 20, height: 20 },
  btnAtras: { padding: 5 },
  iconoAtras: { width: 25, height: 25, resizeMode: "contain" },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#222" },
  btnActualizar: { padding: 8 },
  textoActualizar: { color: "#1F64BF", fontWeight: "600" },
  scrollView: { flex: 1, marginTop: 10 },
  scrollContent: { paddingBottom: 30 },
  section: { padding: 20, borderBottomWidth: 1, borderBottomColor: "#eee" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  notificacionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f3f3",
  },
  iconoContainer: {
    width: 42,
    height: 42,
    borderRadius: 25,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  notificacionInfo: { flex: 1 },
  notificacionTitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  notificacionTexto: {
    fontSize: 14,
    color: "#666",
    marginTop: 3,
  },
  notificacionFecha: {
    fontSize: 12,
    color: "#999",
    marginTop: 5,
  },
  btnEliminar: {
    padding: 8,
  },
  textoEliminar: {
    fontSize: 18,
    color: "#999",
    fontWeight: "bold",
  },
  contenedorVacio: {
    alignItems: "center",
    marginTop: 100,
    padding: 20,
  },
  textoVacio: {
    color: "#777",
    fontSize: 16,
    marginBottom: 8,
  },
  subtextoVacio: {
    color: "#aaa",
    fontSize: 14,
    textAlign: 'center'
  },
});