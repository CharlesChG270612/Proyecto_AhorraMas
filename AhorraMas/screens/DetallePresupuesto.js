import React, { useState, useMemo, useEffect } from "react";
import {View,Text,TextInput,TouchableOpacity,FlatList,StyleSheet,Alert,Modal,} from "react-native";
import { Picker } from "@react-native-picker/picker";
import ControladorPresupuestos from '../controllers/ControladorPresupuestos';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetallePresupuesto({ route }) {
  const { servicio, usuario, onGastoAgregado } = route.params;

  const [empresa, setEmpresa] = useState("");
  const [tipoMonto, setTipoMonto] = useState("");
  const [monto, setMonto] = useState("");
  const [presupuestos, setPresupuestos] = useState([]);
  const [editarId, setEditarId] = useState(null);
  const [modalFiltros, setModalFiltros] = useState(false);
  const [filtroEmpresa, setFiltroEmpresa] = useState("todas");
  const [filtroMes, setFiltroMes] = useState("todas");

  useEffect(() => {
    cargarPresupuestos();
  }, [usuario]);

  const cargarPresupuestos = async () => {
    try {
      if (!usuario || !usuario.id) {
        console.log('DEBUG: No hay usuario para cargar presupuestos');
        return;
      }

      const resultado = await ControladorPresupuestos.obtenerPresupuestosUsuario(usuario.id);
      
      if (resultado.exito) {
        const presupuestosFiltrados = resultado.datos.filter(p => 
          p.servicio_nombre === servicio.nombre
        );
        setPresupuestos(presupuestosFiltrados);
      } else {
        const claves = await AsyncStorage.getAllKeys();
        const clavesPresupuestos = claves.filter(key => 
          key.startsWith('ahorraplus_presupuestos_')
        );
        
        const items = await AsyncStorage.multiGet(clavesPresupuestos);
        const presupuestosCargados = items.map(([key, value]) => {
          try {
            const presupuesto = JSON.parse(value);
            return presupuesto;
          } catch (error) {
            return null;
          }
        }).filter(Boolean).filter(p => 
          p.servicio_nombre === servicio.nombre && 
          p.usuario_id === usuario.id
        );
        
        setPresupuestos(presupuestosCargados);
      }
    } catch (error) {
      console.error('Error cargando presupuestos:', error);
    }
  };

  const meses = [
    ["01", "Enero"],
    ["02", "Febrero"],
    ["03", "Marzo"],
    ["04", "Abril"],
    ["05", "Mayo"],
    ["06", "Junio"],
    ["07", "Julio"],
    ["08", "Agosto"],
    ["09", "Septiembre"],
    ["10", "Octubre"],
    ["11", "Noviembre"],
    ["12", "Diciembre"],
  ];

  const validarCampos = () => {
    if (!empresa) {
      Alert.alert("Falta empresa", "Selecciona una empresa.");
      return false;
    }
    if (!tipoMonto.trim()) {
      Alert.alert("Falta descripción", "Debes ingresar una descripción.");
      return false;
    }
    if (!monto.trim()) {
      Alert.alert("Falta monto", "Ingresa un monto válido.");
      return false;
    }
    const montoNum = Number(monto);
    if (isNaN(montoNum) || montoNum <= 0) {
      Alert.alert("Monto inválido", "El monto debe ser mayor a 0.");
      return false;
    }
    return true;
  };

  const crearNotificacionGasto = async (servicioNombre, monto) => {
    try {
      const notificacion = {
        id: Date.now().toString(),
        usuario_id: usuario.id,
        tipo: 'gasto_registrado',
        titulo: 'Gasto Registrado',
        mensaje: `Se registró un gasto de $${monto} para ${servicioNombre}`,
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

  const agregarPresupuesto = async () => {
    if (!validarCampos()) return;

    if (!usuario || !usuario.id) {
      Alert.alert("Error", "Usuario no encontrado");
      return;
    }

    const montoNum = Number(monto);
    const fechaActual = new Date().toISOString().split('T')[0];

    try {
      if (editarId) {
        const resultado = await ControladorPresupuestos.actualizarPresupuesto(editarId, {
          empresa,
          tipo_monto: tipoMonto,
          monto: montoNum
        });

        if (resultado.exito) {
          await cargarPresupuestos();
          Alert.alert("Éxito", resultado.mensaje);
        } else {
          Alert.alert("Error", resultado.mensaje);
        }
      } else {
        const resultado = await ControladorPresupuestos.crearPresupuesto({
          usuario_id: usuario.id,
          servicio_nombre: servicio.nombre,
          empresa,
          tipo_monto: tipoMonto,
          monto: montoNum,
          fecha: fechaActual
        });

        if (resultado.exito) {
          await cargarPresupuestos();
          crearNotificacionGasto(servicio.nombre, montoNum);
          Alert.alert("Éxito", resultado.mensaje);
        } else {
          Alert.alert("Error", resultado.mensaje);
        }
      }

      limpiar();
      if (onGastoAgregado) onGastoAgregado();
    } catch (error) {
      Alert.alert("Error", "Error al guardar el presupuesto");
    }
  };

  const limpiar = () => {
    setEmpresa("");
    setTipoMonto("");
    setMonto("");
    setEditarId(null);
  };

  const editar = (item) => {
    setEmpresa(item.empresa);
    setTipoMonto(item.tipo_monto);
    setMonto(item.monto.toString());
    setEditarId(item.id);
  };

  const eliminarPresupuesto = async (id) => {
    Alert.alert("Confirmación", "¿Eliminar este registro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: async () => {
          const resultado = await ControladorPresupuestos.eliminarPresupuesto(id);
          
          if (resultado.exito) {
            await cargarPresupuestos();
            if (onGastoAgregado) onGastoAgregado();
          } else {
            Alert.alert("Error", resultado.mensaje);
          }
        },
      },
    ]);
  };

  const listaFiltrada = useMemo(() => {
    return presupuestos.filter((item) => {
      const [año, mes] = item.fecha.split('-');

      if (filtroEmpresa !== "todas" && item.empresa !== filtroEmpresa)
        return false;

      if (filtroMes !== "todas" && filtroMes !== mes) return false;

      return true;
    });
  }, [presupuestos, filtroEmpresa, filtroMes]);

  return (
    <View style={styles.container}>
      <FlatList
        data={listaFiltrada}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
        ListHeaderComponent={
          <View>
            <Text style={styles.titulo}>{servicio.nombre}</Text>

            <Text style={styles.subtitulo}>Registro mensual</Text>

            <Text style={styles.label}>Empresa</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={empresa} onValueChange={setEmpresa}>
                <Picker.Item label="Selecciona una empresa" value="" />
                <Picker.Item label="Empresa A" value="A" />
                <Picker.Item label="Empresa B" value="B" />
                <Picker.Item label="Empresa C" value="C" />
              </Picker>
            </View>

            <Text style={styles.label}>Descripción</Text>
            <TextInput
              placeholder="renta, servicio, etc..."
              value={tipoMonto}
              onChangeText={setTipoMonto}
              style={styles.input}
            />

            <Text style={styles.label}>Monto</Text>
            <TextInput
              placeholder="$0.00"
              value={monto}
              onChangeText={setMonto}
              keyboardType="numeric"
              style={styles.input}
            />

            <TouchableOpacity style={styles.botonPrincipal} onPress={agregarPresupuesto}>
              <Text style={styles.botonTexto}>{editarId ? "Actualizar" : "Agregar"}</Text>
            </TouchableOpacity>

            <View style={styles.filtrosRow}>
              <TouchableOpacity
                onPress={() => {
                  setFiltroEmpresa("todas");
                  setFiltroMes("todas");
                }}
                style={[styles.chip, (filtroEmpresa === "todas" && filtroMes === "todas") && styles.chipActivo]}
              >
                <Text style={(filtroEmpresa === "todas" && filtroMes === "todas") && styles.textoChipActivo}>
                  Todos
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setModalFiltros(true)}
                style={styles.chipFiltros}
              >
                <Text style={{ color: "#1F64BF", fontWeight: "600" }}>
                  Más filtros ▼
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.cardEmpresa}>Empresa {item.empresa}</Text>
              <Text style={styles.cardDesc}>{item.tipo_monto}</Text>
              <Text style={styles.cardMonto}>${item.monto}</Text>
              <Text style={styles.cardFecha}>{item.fecha}</Text>
            </View>

            <View>
              <TouchableOpacity
                onPress={() => editar(item)}
                style={styles.btnEditar}
              >
                <Text style={styles.btnTexto}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => eliminarPresupuesto(item.id)}
                style={styles.btnEliminar}
              >
                <Text style={styles.btnTexto}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.listaVacia}>Sin registros</Text>
        }
      />

      <Modal transparent visible={modalFiltros} animationType="fade">
        <View style={styles.modalFondo}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitulo}>Filtros</Text>

            <Text style={styles.label}>Empresa</Text>
            <View style={styles.modalChips}>
              {["todas", "A", "B", "C"].map((e) => (
                <TouchableOpacity
                  key={e}
                  onPress={() => setFiltroEmpresa(e)}
                  style={[styles.chip, filtroEmpresa === e && styles.chipActivo]}
                >
                  <Text style={filtroEmpresa === e && styles.textoChipActivo}>
                    {e === "todas" ? "Todas" : e}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.label, { marginTop: 10 }]}>Mes</Text>
            <View style={styles.modalChips}>
              <TouchableOpacity
                onPress={() => setFiltroMes("todas")}
                style={[styles.chip, filtroMes === "todas" && styles.chipActivo]}
              >
                <Text style={filtroMes === "todas" && styles.textoChipActivo}>
                  Todos
                </Text>
              </TouchableOpacity>

              {meses.map(([num, nombre]) => (
                <TouchableOpacity
                  key={num}
                  onPress={() => setFiltroMes(num)}
                  style={[styles.chip, filtroMes === num && styles.chipActivo]}
                >
                  <Text style={filtroMes === num && styles.textoChipActivo}>
                    {nombre}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              onPress={() => setModalFiltros(false)}
              style={styles.botonPrincipal}
            >
              <Text style={styles.botonTexto}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  titulo: { fontSize: 20, fontWeight: "700" },
  subtitulo: { color: "#555", marginBottom: 15 },
  label: { marginTop: 10, fontWeight: "700" },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    marginTop: 5,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
  },
  botonPrincipal: {
    backgroundColor: "#1F64BF",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  botonTexto: { color: "#fff", fontWeight: "700" },
  filtrosRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 20,
    marginBottom: 10,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#bbb",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  chipActivo: {
    backgroundColor: "#1F64BF",
    borderColor: "#1F64BF",
  },
  textoChipActivo: { color: "#fff" },
  chipFiltros: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#e8f0ff",
  },
  card: {
    backgroundColor: "#f3f3f3",
    padding: 15,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardEmpresa: { fontSize: 16, fontWeight: "700" },
  cardDesc: { color: "#555" },
  cardMonto: { fontWeight: "bold", marginTop: 5 },
  cardFecha: { fontSize: 12, color: "#777", marginTop: 3 },
  btnEditar: {
    backgroundColor: "#2196F3",
    padding: 7,
    borderRadius: 10,
    marginBottom: 5,
  },
  btnEliminar: {
    backgroundColor: "#E53935",
    padding: 7,
    borderRadius: 10,
  },
  btnTexto: { color: "#fff", fontWeight: "600" },
  listaVacia: {
    textAlign: "center",
    marginTop: 50,
    color: "#777",
  },
  modalFondo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
  },
  modalTitulo: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  modalChips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 5,
  },
});