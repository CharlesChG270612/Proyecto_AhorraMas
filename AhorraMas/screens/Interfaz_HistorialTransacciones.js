import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Image, Alert, Modal, ActivityIndicator } from "react-native";
import ControladorTransacciones from '../controllers/ControladorTransacciones';
import ControladorAutenticacion from '../controllers/ControladorAutenticacion';

export default function Interfaz_HistorialTransacciones({ navigation }) {
  useEffect(() => {
    const parent = navigation.getParent();
    if (!parent) return;
    parent.setOptions({ tabBarStyle: { display: "none" } });
    return () =>
      parent.setOptions({
        tabBarStyle: {
          height: 90,
          paddingBottom: 50,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        },
      });
  }, []);

  const [usuario, setUsuario] = useState(null);
  const [transacciones, setTransacciones] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalFiltros, setModalFiltros] = useState(false);
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [monto, setMonto] = useState("");
  const [tipo, setTipo] = useState("gasto");
  const [editarId, setEditarId] = useState(null);
  const [descripcion, setDescripcion] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("todas");
  const [filtroFecha, setFiltroFecha] = useState("todas");
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    verificarYcargarUsuario();
  }, []);

  useEffect(() => {
    if (usuario) {
      cargarTransacciones();
    }
  }, [usuario, filtro, filtroCategoria, filtroFecha]);

  const verificarYcargarUsuario = async () => {
    try {
      const usuarioActual = await ControladorAutenticacion.obtenerUsuarioActual();
      
      if (!usuarioActual) {
        Alert.alert("Sesión expirada", "Por favor inicia sesión nuevamente");
        navigation.navigate('Login');
        return;
      }
      
      setUsuario(usuarioActual);
    } catch (error) {
      console.error('Error verificando usuario:', error);
      Alert.alert("Error", "No se pudo verificar la sesión");
    }
  };

  const cargarTransacciones = async () => {
    if (!usuario) {
      console.log('DEBUG: No hay usuario para cargar transacciones');
      return;
    }
    
    setCargando(true);
    try {
      const filtros = {
        tipo: filtro === 'todos' ? null : filtro,
        categoria: filtroCategoria === 'todas' ? null : filtroCategoria,
        fecha: filtroFecha === 'todas' ? null : filtroFecha
      };

      console.log('DEBUG: Llamando a ControladorTransacciones.obtenerTransaccionesUsuario');
      console.log('DEBUG: usuario.id =', usuario.id);
      console.log('DEBUG: filtros =', filtros);

      const resultado = await ControladorTransacciones.obtenerTransaccionesUsuario(usuario.id, filtros);
      
      console.log('DEBUG: Resultado completo del controlador:', resultado);
      console.log('DEBUG: resultado.exito =', resultado.exito);
      console.log('DEBUG: resultado.mensaje =', resultado.mensaje);
      console.log('DEBUG: resultado.datos =', resultado.datos);
      console.log('DEBUG: Tipo de resultado.datos =', typeof resultado.datos);
      console.log('DEBUG: Es array?', Array.isArray(resultado.datos));
      
      if (resultado.exito) {
        console.log('DEBUG: Transacciones cargadas exitosamente:', resultado.datos);
        console.log('DEBUG: Cantidad de transacciones:', resultado.datos?.length || 0);
        setTransacciones(resultado.datos || []);
      } else {
        console.log('DEBUG: Error del controlador:', resultado.mensaje);
        Alert.alert("Error", resultado.mensaje);
        setTransacciones([]);
      }
    } catch (error) {
      console.error('DEBUG: Error cargando transacciones:', error);
      Alert.alert("Error", "No se pudieron cargar las transacciones");
      setTransacciones([]);
    } finally {
      setCargando(false);
    }
  };

  const abrirModalEdicion = (item) => {
    if (!item || !item.id) {
      Alert.alert("Error", "Transacción no válida");
      return;
    }
    
    console.log('DEBUG: Abriendo modal para editar transacción:', item);
    
    setNombre(item.nombre || "");
    setCategoria(item.categoria || "");
    setMonto(item.monto ? item.monto.toString() : "");
    setTipo(item.tipo || "gasto");
    setDescripcion(item.descripcion || "");
    setEditarId(item.id);
    setModalVisible(true);
  };

  const guardarTransaccion = async () => {
    if (!nombre || !categoria || !monto || !descripcion) {
      Alert.alert("Datos incompletos", "Todos los campos son obligatorios.");
      return;
    }

    if (!usuario) {
      Alert.alert("Error", "No se encontró el usuario");
      return;
    }

    const montoNumerico = parseFloat(monto);
    if (isNaN(montoNumerico) || montoNumerico <= 0) {
      Alert.alert("Error", "El monto debe ser un número mayor a 0");
      return;
    }

    const datosTransaccion = {
      usuario_id: usuario.id,
      nombre: nombre.trim(),
      categoria: categoria.trim(),
      descripcion: descripcion.trim(),
      monto: montoNumerico,
      tipo,
      fecha: new Date().toISOString().split('T')[0]
    };

    console.log('DEBUG: Enviando datos al controlador:', datosTransaccion);

    try {
      let resultado;
      
      if (editarId) {
        console.log('DEBUG: Editando transacción existente');
        resultado = await ControladorTransacciones.actualizarTransaccion(editarId, datosTransaccion);
      } else {
        console.log('DEBUG: Creando nueva transacción');
        resultado = await ControladorTransacciones.crearTransaccion(datosTransaccion);
      }
      
      console.log('DEBUG: Respuesta del controlador:', resultado);
      
      if (resultado.exito) {
        Alert.alert("Éxito", resultado.mensaje);
        console.log('DEBUG: Recargando transacciones después de guardar...');
        await cargarTransacciones();
        limpiarCampos();
      } else {
        Alert.alert("Error", resultado.mensaje);
      }
    } catch (error) {
      console.error('DEBUG: Error guardando transacción:', error);
      Alert.alert("Error", "Error al guardar la transacción");
    }
  };

  const eliminarTransaccion = async (id) => {
    if (!id) {
      Alert.alert("Error", "ID de transacción no válido");
      return;
    }

    console.log('DEBUG: Intentando eliminar transacción ID:', id);

    Alert.alert("Confirmación", "¿Eliminar transacción permanentemente?", [
      { text: "Cancelar", style: "cancel" },
      { 
        text: "Eliminar", 
        style: "destructive", 
        onPress: async () => {
          try {
            console.log('DEBUG: Ejecutando eliminación de transacción ID:', id);
            const resultado = await ControladorTransacciones.eliminarTransaccion(id);
            
            console.log('DEBUG: Resultado de eliminación:', resultado);
            
            if (resultado.exito) {
              Alert.alert("Éxito", resultado.mensaje);
              console.log('DEBUG: Recargando transacciones después de eliminar...');
              cargarTransacciones();
            } else {
              Alert.alert("Error", resultado.mensaje);
            }
          } catch (error) {
            console.error('DEBUG: Error eliminando transacción:', error);
            Alert.alert("Error", "Error al eliminar la transacción");
          }
        }
      },
    ]);
  };

  const limpiarCampos = () => {
    setNombre("");
    setCategoria("");
    setMonto("");
    setTipo("gasto");
    setDescripcion("");
    setEditarId(null);
    setModalVisible(false);
  };

  const limpiarFiltros = () => {
    setFiltro("todos");
    setFiltroCategoria("todas");
    setFiltroFecha("todas");
  };

  const categoriasDisponibles = [...new Set(transacciones.map((t) => t.categoria).filter(Boolean))];
  const fechasDisponibles = [...new Set(transacciones.map((t) => t.fecha).filter(Boolean))];

  const transaccionesFiltradas = transacciones.filter((item) => {
    if (!item || !item.id) return false;
    
    const f1 = filtro === "todos" ? true : item.tipo === filtro;
    const f2 = filtroCategoria === "todas" ? true : item.categoria === filtroCategoria;
    const f3 = filtroFecha === "todas" ? true : item.fecha === filtroFecha;
    return f1 && f2 && f3;
  });

  const renderTransaccion = ({ item }) => {
    if (!item || !item.id) return null;

    return (
      <TouchableOpacity onPress={() => abrirModalEdicion(item)}>
        <View style={estilos.tarjeta}>
          <Image source={require("../assets/iconos/persona.png")} style={estilos.imagen} />
          <View style={estilos.info}>
            <Text style={estilos.nombre}>{item.nombre || "Sin nombre"}</Text>
            <Text style={estilos.categoria}>{item.categoria || "Sin categoría"}</Text>
            <Text style={{ fontSize: 12, color: "#727272ff" }}>{item.descripcion || "Sin descripción"}</Text>
            <Text style={estilos.fecha}>{item.fecha || "Sin fecha"}</Text>
          </View>
          <Text style={[estilos.monto, { color: item.tipo === "ingreso" ? "#2ecc71" : "#e63946" }]}>
            {item.tipo === "ingreso" ? `+ $${item.monto || 0}` : `- $${item.monto || 0}`}
          </Text>
          <TouchableOpacity onPress={() => eliminarTransaccion(item.id)}>
            <Text style={{ color: "red", marginLeft: 10 }}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={estilos.contenedorPrincipal}>
      <View style={estilos.contenedor}>
        <View style={estilos.encabezado}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={estilos.btnAtras}>
            <Image source={require("../assets/iconos/flecha-izquierda.png")} style={estilos.iconoAtras} />
          </TouchableOpacity>
          <Text style={estilos.titulo}>Transacciones recientes</Text>
          <TouchableOpacity onPress={cargarTransacciones}>
            <Image source={require("../assets/iconos/actualizar.png")} style={estilos.iconoSuperior} />
          </TouchableOpacity>
        </View>

        <View style={estilos.filaFiltros}>
          <TouchableOpacity onPress={() => setFiltro("todos")} style={[estilos.filtroChip, filtro === "todos" && estilos.chipActivo]}>
            <Text style={[estilos.textoChip, filtro === "todos" && estilos.textoActivo]}>Todos</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setFiltro("gasto")} style={[estilos.filtroChip, filtro === "gasto" && estilos.chipActivo]}>
            <Text style={[estilos.textoChip, filtro === "gasto" && estilos.textoActivo]}>Gastos</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setFiltro("ingreso")} style={[estilos.filtroChip, filtro === "ingreso" && estilos.chipActivo]}>
            <Text style={[estilos.textoChip, filtro === "ingreso" && estilos.textoActivo]}>Ingresos</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setModalFiltros(true)} style={estilos.filtroExtra}>
            <Text style={{ color: "#1F64BF", fontWeight: "600" }}>Más filtros ▼</Text>
          </TouchableOpacity>
        </View>

        {cargando ? (
          <View style={estilos.contenedorCarga}>
            <ActivityIndicator size="large" color="#1F64BF" />
            <Text style={estilos.textoCarga}>Cargando transacciones...</Text>
          </View>
        ) : (
          <FlatList
            data={transaccionesFiltradas}
            keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
            renderItem={renderTransaccion}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 150 }}
            ListEmptyComponent={
              <View style={estilos.contenedorVacio}>
                <Text style={estilos.textoVacio}>No hay transacciones</Text>
                <Text style={estilos.subtextoVacio}>
                  {filtro !== "todos" || filtroCategoria !== "todas" || filtroFecha !== "todas" 
                    ? "Intenta con otros filtros" 
                    : "Agrega tu primera transacción"}
                </Text>
              </View>
            }
          />
        )}

        <TouchableOpacity style={estilos.btnModal} onPress={() => setModalVisible(true)}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>+ Agregar</Text>
        </TouchableOpacity>

        <Modal animationType="fade" transparent visible={modalFiltros}>
          <View style={estilos.modalFondo}>
            <View style={estilos.modalContenedor}>
              <Text style={estilos.modalTitulo}>Filtros avanzados</Text>

              <Text style={{ marginTop: 5, fontWeight: "bold" }}>Categoría</Text>
              <View style={estilos.listadoFiltros}>
                <TouchableOpacity onPress={() => setFiltroCategoria("todas")} style={[estilos.filtroChip, filtroCategoria === "todas" && estilos.chipActivo]}>
                  <Text style={[estilos.textoChip, filtroCategoria === "todas" && estilos.textoActivo]}>Todas</Text>
                </TouchableOpacity>

                {categoriasDisponibles.map((c) => (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setFiltroCategoria(c)}
                    style={[estilos.filtroChip, filtroCategoria === c && estilos.chipActivo]}
                  >
                    <Text style={[estilos.textoChip, filtroCategoria === c && estilos.textoActivo]}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={{ marginTop: 15, fontWeight: "bold" }}>Fecha</Text>
              <View style={estilos.listadoFiltros}>
                <TouchableOpacity onPress={() => setFiltroFecha("todas")} style={[estilos.filtroChip, filtroFecha === "todas" && estilos.chipActivo]}>
                  <Text style={[estilos.textoChip, filtroFecha === "todas" && estilos.textoActivo]}>Todas</Text>
                </TouchableOpacity>

                {fechasDisponibles.map((f) => (
                  <TouchableOpacity
                    key={f}
                    onPress={() => setFiltroFecha(f)}
                    style={[estilos.filtroChip, filtroFecha === f && estilos.chipActivo]}
                  >
                    <Text style={[estilos.textoChip, filtroFecha === f && estilos.textoActivo]}>{f}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity onPress={limpiarFiltros} style={[estilos.btnSecundario, { marginTop: 10 }]}>
                <Text style={{ color: "#1F64BF" }}>Limpiar Filtros</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setModalFiltros(false)} style={[estilos.btnAgregar, { marginTop: 10 }]}>
                <Text style={{ color: "#fff" }}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal animationType="slide" transparent visible={modalVisible}>
          <View style={estilos.modalFondo}>
            <View style={estilos.modalContenedor}>
              <Text style={estilos.modalTitulo}>{editarId ? "Editar Transacción" : "Nueva Transacción"}</Text>

              <TextInput placeholder="Nombre" value={nombre} onChangeText={setNombre} style={estilos.input} />
              <TextInput placeholder="Categoría" value={categoria} onChangeText={setCategoria} style={estilos.input} />
              <TextInput placeholder="Descripción" value={descripcion} onChangeText={setDescripcion} style={estilos.input} />
              <TextInput placeholder="Monto" value={monto} onChangeText={setMonto} style={estilos.input} keyboardType="numeric" />

              <View style={estilos.filtroTipo}>
                <TouchableOpacity onPress={() => setTipo("gasto")} style={[estilos.tipoBtn, tipo === "gasto" && estilos.tipoBtnActivo]}>
                  <Text style={{ color: tipo === "gasto" ? "#fff" : "#000" }}>Gasto</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setTipo("ingreso")} style={[estilos.tipoBtn, tipo === "ingreso" && estilos.tipoBtnActivo]}>
                  <Text style={{ color: tipo === "ingreso" ? "#fff" : "#000" }}>Ingreso</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={guardarTransaccion} style={estilos.btnAgregar}>
                <Text style={{ color: "#fff" }}>{editarId ? "Guardar" : "Agregar"}</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={limpiarCampos} style={[estilos.btnAgregar, { backgroundColor: "#aaa", marginTop: 10 }]}>
                <Text style={{ color: "#fff" }}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedorPrincipal: { flex: 1, backgroundColor: "#f7f6fa" },
  contenedor: { flex: 1, padding: 20, paddingBottom: 0 },
  encabezado: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 30, marginBottom: 10 },
  btnAtras: { padding: 5 },
  iconoAtras: { width: 25, height: 25 },
  titulo: { fontSize: 20, fontWeight: "700", color: "#1a1a1a" },
  iconoSuperior: { width: 20, height: 20 },
  filaFiltros: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 5 },
  filtroChip: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, borderWidth: 1, borderColor: "#ccc", marginRight: 5 },
  chipActivo: { backgroundColor: "#1F64BF", borderColor: "#1F64BF" },
  textoChip: { color: "#000", fontSize: 13 },
  textoActivo: { color: "#fff", fontWeight: "600" },
  filtroExtra: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: "#e9f1ff" },
  tarjeta: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 15, padding: 12, marginBottom: 10, elevation: 2 },
  imagen: { width: 45, height: 45, borderRadius: 25, marginRight: 15 },
  info: { flex: 1 },
  nombre: { fontSize: 16, fontWeight: "600", color: "#222" },
  categoria: { fontSize: 13, color: "#777", marginTop: 2 },
  fecha: { fontSize: 12, color: "#aaa", marginTop: 2 },
  monto: { fontSize: 15, fontWeight: "bold" },
  btnModal: { position: "absolute", bottom: 100, right: 20, backgroundColor: "#1F64BF", padding: 15, borderRadius: 50 },
  modalFondo: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContenedor: { width: "90%", backgroundColor: "#fff", borderRadius: 20, padding: 20 },
  modalTitulo: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  input: { backgroundColor: "#f0f0f0", borderRadius: 10, padding: 10, marginBottom: 10 },
  filtroTipo: { flexDirection: "row", marginBottom: 10 },
  tipoBtn: { flex: 1, padding: 10, borderRadius: 10, borderWidth: 1, borderColor: "#ccc", marginRight: 5, alignItems: "center" },
  tipoBtnActivo: { backgroundColor: "#1F64BF", borderColor: "#1F64BF" },
  btnAgregar: { backgroundColor: "#1F64BF", padding: 12, borderRadius: 10, alignItems: "center" },
  listadoFiltros: { flexDirection: "row", flexWrap: "wrap", gap: 5, marginTop: 5 },
  contenedorCarga: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50
  },
  textoCarga: {
    marginTop: 10,
    color: '#666',
    fontSize: 16
  },
  contenedorVacio: {
    alignItems: "center", 
    marginTop: 100,
    padding: 20
  },
  textoVacio: { 
    color: "#777", 
    fontSize: 16,
    marginBottom: 8
  },
  subtextoVacio: {
    color: "#aaa",
    fontSize: 14,
    textAlign: 'center'
  },
  btnSecundario: { 
    backgroundColor: "#f0f0f0", 
    padding: 12, 
    borderRadius: 10, 
    alignItems: "center" 
  }
});