import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Image, Alert, Modal } from "react-native";

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

  const abrirModalEdicion = (item) => {
    setNombre(item.nombre);
    setCategoria(item.categoria);
    setMonto(item.monto.toString());
    setTipo(item.tipo);
    setDescripcion(item.descripcion);
    setEditarId(item.id);
    setModalVisible(true);
  };

  const guardarTransaccion = () => {
    if (!nombre || !categoria || !monto || !descripcion) {
      Alert.alert("Datos incompletos", "Todos los campos son obligatorios.");
      return;
    }

    if (editarId) {
      Alert.alert("Confirmación", "¿Actualizar transacción?", [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Actualizar",
          onPress: () => {
            setTransacciones((prev) =>
              prev.map((item) =>
                item.id === editarId
                  ? { ...item, nombre, categoria, monto: parseFloat(monto), tipo, descripcion }
                  : item
              )
            );
            limpiarCampos();
          },
        },
      ]);
    } else {
      const nueva = {
        id: Date.now().toString(),
        nombre,
        categoria,
        monto: parseFloat(monto),
        tipo,
        descripcion,
        fecha: new Date().toLocaleDateString(),
      };
      setTransacciones((prev) => [...prev, nueva]);
      limpiarCampos();
    }
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

  const eliminarTransaccion = (id) => {
    Alert.alert("Confirmación", "¿Eliminar transacción?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Eliminar", style: "destructive", onPress: () => setTransacciones((prev) => prev.filter((t) => t.id !== id)) },
    ]);
  };

  const categoriasDisponibles = [...new Set(transacciones.map((t) => t.categoria))];
  const fechasDisponibles = [...new Set(transacciones.map((t) => t.fecha))];

  const transaccionesFiltradas = transacciones.filter((item) => {
    const f1 = filtro === "todos" ? true : item.tipo === filtro;
    const f2 = filtroCategoria === "todas" ? true : item.categoria === filtroCategoria;
    const f3 = filtroFecha === "todas" ? true : item.fecha === filtroFecha;
    return f1 && f2 && f3;
  });

  const renderTransaccion = ({ item }) => (
    <TouchableOpacity onPress={() => abrirModalEdicion(item)}>
      <View style={estilos.tarjeta}>
        <Image source={require("../assets/iconos/persona.png")} style={estilos.imagen} />
        <View style={estilos.info}>
          <Text style={estilos.nombre}>{item.nombre}</Text>
          <Text style={estilos.categoria}>{item.categoria}</Text>
          <Text style={{ fontSize: 12, color: "#727272ff" }}>{item.descripcion}</Text>
          <Text style={estilos.fecha}>{item.fecha}</Text>
        </View>
        <Text style={[estilos.monto, { color: item.tipo === "ingreso" ? "#2ecc71" : "#e63946" }]}>
          {item.tipo === "ingreso" ? `+ $${item.monto}` : `- $${item.monto}`}
        </Text>
        <TouchableOpacity onPress={() => eliminarTransaccion(item.id)}>
          <Text style={{ color: "red", marginLeft: 10 }}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={estilos.contenedorPrincipal}>
      <View style={estilos.contenedor}>
        <View style={estilos.encabezado}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={estilos.btnAtras}>
            <Image source={require("../assets/iconos/flecha-izquierda.png")} style={estilos.iconoAtras} />
          </TouchableOpacity>
          <Text style={estilos.titulo}>Transacciones recientes</Text>
          <TouchableOpacity>
            <Image source={require("../assets/iconos/buscar.png")} style={estilos.iconoSuperior} />
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

        <FlatList
          data={transaccionesFiltradas}
          keyExtractor={(item) => item.id}
          renderItem={renderTransaccion}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 150 }}
          ListEmptyComponent={
            <View style={{ alignItems: "center", marginTop: 300 }}>
              <Text style={{ color: "#777", fontSize: 16 }}>No hay transacciones</Text>
            </View>
          }
        />

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

              <TouchableOpacity onPress={() => setModalFiltros(false)} style={[estilos.btnAgregar, { marginTop: 20 }]}>
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
  iconoSuperior: { width: 28, height: 28 },
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
});
