import React, { useState, useEffect } from "react";
import {View,Text,TouchableOpacity,FlatList,StyleSheet,Image,Modal,TextInput,Alert,} from "react-native";
import ControladorAutenticacion from '../controllers/ControladorAutenticacion';
import ControladorPresupuestos from '../controllers/ControladorPresupuestos';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Interfaz_PresupuestosGastos({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [nombreTema, setNombreTema] = useState("");
  const [presupuestoTotal, setPresupuestoTotal] = useState(null);
  const [presupuestoModal, setPresupuestoModal] = useState(false);
  const [valorPresupuesto, setValorPresupuesto] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [gastosTotales, setGastosTotales] = useState(0);
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: "none" },
    });

    cargarUsuarioYPresupuesto();

    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: {
          height: 90,
          paddingBottom: 50,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        },
      });
    };
  }, []);

  useEffect(() => {
    if (usuario) {
      calcularGastosTotales(usuario.id);
    }
  }, [usuario, presupuestoTotal]);

  useEffect(() => {
    console.log('DEBUG: Estado actual - presupuestoTotal:', presupuestoTotal, 'gastosTotales:', gastosTotales);
  }, [presupuestoTotal, gastosTotales]);

  const cargarUsuarioYPresupuesto = async () => {
    try {
      const usuarioActual = await ControladorAutenticacion.obtenerUsuarioActual();
      if (!usuarioActual) {
        Alert.alert("Error", "Usuario no encontrado");
        navigation.navigate('Login');
        return;
      }
      
      console.log('DEBUG: Usuario cargado:', usuarioActual);
      setUsuario(usuarioActual);
      
      const resultadoPresupuesto = await ControladorPresupuestos.obtenerPresupuestoMensual(usuarioActual.id);
      console.log('DEBUG: Resultado obtenerPresupuestoMensual:', resultadoPresupuesto);
      
      if (resultadoPresupuesto.exito && resultadoPresupuesto.datos) {
        console.log('DEBUG: Presupuesto encontrado:', resultadoPresupuesto.datos);
        setPresupuestoTotal(resultadoPresupuesto.datos.monto);
      } else {
        console.log('DEBUG: No se encontró presupuesto mensual');
        setPresupuestoTotal(null);
      }
      
      await cargarServiciosUsuario(usuarioActual.id);
    } catch (error) {
      console.error('Error cargando usuario:', error);
    }
  };

  const cargarServiciosUsuario = async (usuarioId) => {
    try {
      const serviciosGuardados = await AsyncStorage.getItem(`ahorraplus_servicios_${usuarioId}`);
      if (serviciosGuardados) {
        setServicios(JSON.parse(serviciosGuardados));
      } else {
        const serviciosIniciales = [
          {
            id: "1",
            nombre: "Servicio eléctrico",
            descripcion: "Registra un presupuesto",
            imagen: "electricidad",
          },
          {
            id: "2",
            nombre: "Servicio de agua",
            descripcion: "Registra un presupuesto",
            imagen: "agua",
          },
          {
            id: "3",
            nombre: "Servicio de internet",
            descripcion: "Registra un presupuesto",
            imagen: "internet",
          },
        ];
        setServicios(serviciosIniciales);
        await AsyncStorage.setItem(`ahorraplus_servicios_${usuarioId}`, JSON.stringify(serviciosIniciales));
      }
    } catch (error) {
      console.error('Error cargando servicios:', error);
    }
  };

  const obtenerImagen = (nombreImagen) => {
    const imagenes = {
      'electricidad': require("../assets/iconos/electricidad.png"),
      'agua': require("../assets/iconos/agua.png"),
      'internet': require("../assets/iconos/internet.png"),
      'default': require("../assets/iconos/internet.png"),
    };
    
    return imagenes[nombreImagen] || imagenes.default;
  };

  const calcularGastosTotales = async (usuarioId) => {
    try {
      const resultado = await ControladorPresupuestos.obtenerResumenMensual(usuarioId);
      console.log('DEBUG: Resultado obtenerResumenMensual:', resultado);
      
      if (resultado.exito) {
        setGastosTotales(resultado.datos.gastosTotales);
        
        if (resultado.datos.presupuesto && resultado.datos.gastosTotales > resultado.datos.presupuesto) {
          crearNotificacionPresupuestoExcedido(resultado.datos.gastosTotales, resultado.datos.presupuesto, usuarioId);
        }
      } else {
        console.log('Error obteniendo resumen mensual:', resultado.mensaje);
        setGastosTotales(0);
      }
    } catch (error) {
      console.error('Error calculando gastos:', error);
      setGastosTotales(0);
    }
  };

  const crearNotificacionPresupuestoExcedido = async (gastos, presupuesto, usuarioId) => {
    try {
      const notificacion = {
        id: Date.now().toString(),
        usuario_id: usuarioId,
        tipo: 'presupuesto_excedido',
        titulo: 'Presupuesto Excedido',
        mensaje: `Has excedido tu presupuesto mensual. Gastos: $${gastos} | Presupuesto: $${presupuesto}`,
        fecha: new Date().toISOString(),
        leida: false
      };
      
      await AsyncStorage.setItem(
        `ahorraplus_notificaciones_${notificacion.id}`,
        JSON.stringify(notificacion)
      );
    } catch (error) {
      console.error('Error creando notificación:', error);
    }
  };

  const crearNotificacionPresupuestoActualizado = async (nuevoPresupuesto, usuarioId) => {
    try {
      const notificacion = {
        id: Date.now().toString(),
        usuario_id: usuarioId,
        tipo: 'presupuesto_actualizado',
        titulo: 'Presupuesto Actualizado',
        mensaje: `Tu presupuesto mensual ha sido actualizado a $${nuevoPresupuesto}`,
        fecha: new Date().toISOString(),
        leida: false
      };
      
      await AsyncStorage.setItem(
        `ahorraplus_notificaciones_${notificacion.id}`,
        JSON.stringify(notificacion)
      );
    } catch (error) {
      console.error('Error creando notificación:', error);
    }
  };

  const abrirDetalle = (item) => {
    if (!usuario) {
      Alert.alert("Error", "Usuario no encontrado");
      return;
    }
    navigation.navigate("DetallePresupuesto", { 
      servicio: item,
      usuario: usuario,
      onGastoAgregado: () => calcularGastosTotales(usuario.id)
    });
  };

  const guardarTema = async () => {
    if (!nombreTema.trim()) {
      Alert.alert("Error", "Escribe un nombre para el tema.");
      return;
    }

    if (!usuario) {
      Alert.alert("Error", "Usuario no encontrado");
      return;
    }

    Alert.alert("Confirmación", `¿Crear el tema "${nombreTema}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Crear",
        onPress: async () => {
          const nuevoTema = {
            id: Date.now().toString(),
            nombre: nombreTema,
            descripcion: "Registra un presupuesto",
            imagen: "internet",
          };

          const nuevosServicios = [...servicios, nuevoTema];
          setServicios(nuevosServicios);
          await AsyncStorage.setItem(`ahorraplus_servicios_${usuario.id}`, JSON.stringify(nuevosServicios));
          setNombreTema("");
          setModalVisible(false);
        },
      },
    ]);
  };

  const eliminarTema = async (item) => {
    if (!usuario) {
      Alert.alert("Error", "Usuario no encontrado");
      return;
    }

    Alert.alert("Eliminar tema", `¿Estás seguro de eliminar "${item.nombre}" y todos sus registros?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          try {
            const presupuestos = await ControladorPresupuestos.obtenerPresupuestosUsuario(usuario.id);
            if (presupuestos.exito) {
              const presupuestosAEliminar = presupuestos.datos.filter(
                p => p.servicio_nombre === item.nombre
              );
              
              for (const presupuesto of presupuestosAEliminar) {
                await ControladorPresupuestos.eliminarPresupuesto(presupuesto.id);
              }
            }

            const nuevosServicios = servicios.filter((s) => s.id !== item.id);
            setServicios(nuevosServicios);
            await AsyncStorage.setItem(`ahorraplus_servicios_${usuario.id}`, JSON.stringify(nuevosServicios));
            
            calcularGastosTotales(usuario.id);
            
            Alert.alert("Éxito", "Tema y registros eliminados correctamente");
          } catch (error) {
            console.error('Error eliminando tema:', error);
            Alert.alert("Error", "No se pudieron eliminar todos los registros");
          }
        },
      },
    ]);
  };

  const guardarPresupuesto = async () => {
    const numero = Number(valorPresupuesto);

    if (!valorPresupuesto.trim() || isNaN(numero)) {
      Alert.alert("Error", "Ingresa un valor numérico válido.");
      return;
    }

    if (numero <= 0) {
      Alert.alert("Error", "El presupuesto debe ser mayor a 0.");
      return;
    }

    if (!usuario) {
      Alert.alert("Error", "Usuario no encontrado");
      return;
    }

    try {
      console.log('DEBUG: Guardando presupuesto para usuario:', usuario.id, 'monto:', numero);
      const resultado = await ControladorPresupuestos.establecerPresupuestoMensual(usuario.id, numero);
      console.log('DEBUG: Resultado establecerPresupuestoMensual:', resultado);
      
      if (resultado.exito) {
        setPresupuestoTotal(numero);
        setPresupuestoModal(false);
        setValorPresupuesto("");
        crearNotificacionPresupuestoActualizado(numero, usuario.id);
        Alert.alert("Éxito", resultado.mensaje);
      } else {
        Alert.alert("Error", resultado.mensaje);
      }
    } catch (error) {
      Alert.alert("Error", "Error al guardar el presupuesto");
    }
  };

  const porcentajeUsado = presupuestoTotal ? (gastosTotales / presupuestoTotal) * 100 : 0;
  const restante = presupuestoTotal ? presupuestoTotal - gastosTotales : 0;

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <FlatList
        data={servicios}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        ListHeaderComponent={
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: "700", marginBottom: 10 }}>
              Presupuestos
            </Text>

            <View style={styles.presupuestoBox}>
              <Text style={styles.presupuestoTitulo}>Presupuesto mensual</Text>

              {presupuestoTotal === null ? (
                <Text style={styles.presupuestoCantidad}>No asignado</Text>
              ) : (
                <Text style={styles.presupuestoCantidad}>
                  ${presupuestoTotal}
                </Text>
              )}

              <TouchableOpacity
                style={styles.botonEditarPresupuesto}
                onPress={() => setPresupuestoModal(true)}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>
                  {presupuestoTotal === null ? "Asignar presupuesto" : "Editar"}
                </Text>
              </TouchableOpacity>
            </View>

            {presupuestoTotal !== null && (
              <View style={{ marginTop: 10 }}>
                <Text style={{ fontWeight: "600", color: "#1F64BF" }}>
                  Progreso del mes
                </Text>

                <View style={styles.progressFondo}>
                  <View style={[
                    styles.progressRelleno, 
                    { 
                      width: `${Math.min(porcentajeUsado, 100)}%`,
                      backgroundColor: porcentajeUsado > 100 ? "#E53935" : 
                                      porcentajeUsado > 80 ? "#FFA726" : "#36A15B"
                    }
                  ]} />
                </View>

                <Text style={styles.restanteTexto}>
                  Gastado: ${gastosTotales} | Restante: ${Math.max(0, restante)}
                </Text>
                
                {porcentajeUsado > 100 && (
                  <Text style={styles.textoExcedido}>
                    ⚠️ Has excedido tu presupuesto
                  </Text>
                )}
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.tarjeta}>
            <TouchableOpacity onPress={() => abrirDetalle(item)} style={{ flex: 1 }}>
              <View>
                <Text style={styles.nombre}>{item.nombre}</Text>
                <Text style={styles.descripcion}>{item.descripcion}</Text>
              </View>
            </TouchableOpacity>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image 
                source={obtenerImagen(item.imagen)} 
                style={styles.imagenServicio} 
                resizeMode="contain"
              />

              <TouchableOpacity
                onPress={() => eliminarTema(item)}
                style={styles.botonEliminar}
              >
                <Text style={{ color: "#fff", fontSize: 12, fontWeight: "bold" }}>X</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <TouchableOpacity
        style={styles.botonOtroTema}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textoBotonOtroTema}>
          Añadir tema para presupuesto
        </Text>
      </TouchableOpacity>

      <Modal animationType="slide" transparent visible={presupuestoModal}>
        <View style={styles.modalFondo}>
          <View style={styles.modalContenido}>
            <Text style={styles.modalTitulo}>Presupuesto del mes</Text>

            <TextInput
              value={valorPresupuesto}
              onChangeText={setValorPresupuesto}
              placeholder="Cantidad en $"
              keyboardType="numeric"
              style={styles.modalInput}
            />

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                style={[styles.botonModal, { backgroundColor: "#aaa" }]}
                onPress={() => setPresupuestoModal(false)}
              >
                <Text style={styles.textoBotonModal}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.botonModal}
                onPress={guardarPresupuesto}
              >
                <Text style={styles.textoBotonModal}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent visible={modalVisible}>
        <View style={styles.modalFondo}>
          <View style={styles.modalContenido}>
            <Text style={styles.modalTitulo}>Nuevo Tema de Presupuesto</Text>

            <TextInput
              value={nombreTema}
              onChangeText={setNombreTema}
              placeholder="Nombre del tema"
              style={styles.modalInput}
            />

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity
                onPress={() => {
                  setNombreTema("");
                  setModalVisible(false);
                }}
                style={[styles.botonModal, { backgroundColor: "#aaa" }]}
              >
                <Text style={styles.textoBotonModal}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={guardarTema} style={styles.botonModal}>
                <Text style={styles.textoBotonModal}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  presupuestoBox: {
    backgroundColor: "#E8F0FF",
    padding: 15,
    borderRadius: 15,
  },
  presupuestoTitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F64BF",
  },
  presupuestoCantidad: {
    fontSize: 22,
    fontWeight: "700",
    marginVertical: 5,
  },
  botonEditarPresupuesto: {
    backgroundColor: "#1F64BF",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  progressFondo: {
    width: "100%",
    height: 12,
    backgroundColor: "#DCEBFF",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 5,
  },
  progressRelleno: {
    height: "100%",
    borderRadius: 10,
  },
  restanteTexto: {
    marginTop: 5,
    fontSize: 13,
    color: "#555",
  },
  textoExcedido: {
    marginTop: 5,
    fontSize: 13,
    color: "#E53935",
    fontWeight: "600",
  },
  tarjeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 18,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  nombre: { fontSize: 16, fontWeight: "700", flex: 1 },
  descripcion: { fontSize: 13, color: "#888", marginTop: 4 },
  imagenServicio: { 
    width: 60, 
    height: 60, 
    marginRight: 10 
  },
  botonEliminar: {
    backgroundColor: "#E53935",
    padding: 8,
    borderRadius: 10,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  botonOtroTema: {
    backgroundColor: "#2196F3",
    marginHorizontal: 20,
    borderRadius: 15,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 40,
  },
  textoBotonOtroTema: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  modalFondo: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContenido: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
  },
  modalTitulo: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 15,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  botonModal: {
    backgroundColor: "#1F64BF",
    padding: 12,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },
  textoBotonModal: { color: "#fff", fontWeight: "700" },
});