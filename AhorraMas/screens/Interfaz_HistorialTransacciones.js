import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Image, Alert, Modal } from "react-native";
import { useEffect } from "react";

export default function Interfaz_HistorialTransacciones({ navigation }) {

   useEffect(() => {
  const parent = navigation.getParent();

  if (!parent) return;

  parent.setOptions({ tabBarStyle: { display: "none" } });

  return () => parent.setOptions({
    tabBarStyle: {
      height: 90,
      paddingBottom: 50,
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
    }
  });
}, []);
  const [transacciones, setTransacciones] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [modalVisible, setModalVisible] = useState(false);
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [monto, setMonto] = useState("");
  const [tipo, setTipo] = useState("gasto");
  const [editarId, setEditarId] = useState(null);

  const abrirModalEdicion = (item) => {
    setNombre(item.nombre);
    setCategoria(item.categoria);
    setMonto(item.monto.toString());
    setTipo(item.tipo);
    setEditarId(item.id);
    setModalVisible(true);
  };

  const guardarTransaccion = () => {
  if (!nombre || !categoria || !monto) {
    Alert.alert("Datos incompletos", "Por favor, completa todos los campos.");
    return;
  }

  if (editarId) {
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de actualizar esta transacción?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Actualizar",
          onPress: () => {
            setTransacciones(prev =>
              prev.map(item =>
                item.id === editarId
                  ? { ...item, nombre, categoria, monto: parseFloat(monto), tipo }
                  : item
              )
            );
            setNombre(""); setCategoria(""); setMonto(""); setTipo("gasto"); setEditarId(null); setModalVisible(false);
          }
        }
      ]
    );
  } else {
    const nueva = {
      id: Date.now().toString(),
      nombre,
      categoria,
      monto: parseFloat(monto),
      tipo,
      fecha: new Date().toLocaleDateString(),
    };
    setTransacciones(prev => [...prev, nueva]);
    setNombre(""); setCategoria(""); setMonto(""); setTipo("gasto"); setModalVisible(false);
  }
};

  const eliminarTransaccion = (id) => {
    Alert.alert(
      "Confirmación",
      "¿Estás seguro de eliminar esta transacción?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: () => setTransacciones(prev => prev.filter(item => item.id !== id)) }
      ]
    );
  };

  const cancelarModal = () => {
    setNombre("");
    setCategoria("");
    setMonto("");
    setTipo("gasto");
    setEditarId(null); 
    setModalVisible(false);
  };


  const transaccionesFiltradas = transacciones.filter(item => filtro === "todos" ? true : item.tipo === filtro);

  const renderTransaccion = ({ item }) => (
    <TouchableOpacity onPress={() => abrirModalEdicion(item)}>
      <View style={estilos.tarjeta}>
        <Image source={require("../assets/iconos/persona.png")} style={estilos.imagen} />
        <View style={estilos.info}>
          <Text style={estilos.nombre}>{item.nombre}</Text>
          <Text style={estilos.categoria}>{item.categoria}</Text>
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
          <Image source={require("../assets/iconos/buscar.png")} style={estilos.iconoSuperior} />
        </View>

        <View style={estilos.filtros}>
          <TouchableOpacity onPress={() => setFiltro("todos")} style={[estilos.filtroBtn, filtro === "todos" && estilos.filtroBtnActivo]}>
            <Text style={{ color: filtro === "todos" ? "#fff" : "#000" }}>Todos</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFiltro("gasto")} style={[estilos.filtroBtn, filtro === "gasto" && estilos.filtroBtnActivo]}>
            <Text style={{ color: filtro === "gasto" ? "#fff" : "#000" }}>Gastos</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFiltro("ingreso")} style={[estilos.filtroBtn, filtro === "ingreso" && estilos.filtroBtnActivo]}>
            <Text style={{ color: filtro === "ingreso" ? "#fff" : "#000" }}>Ingresos</Text>
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
              <Text style={{ color: "#777", fontSize: 16 }}>No hay transacciones recientes</Text>
            </View>
          }
        />

        <TouchableOpacity style={estilos.btnModal} onPress={() => setModalVisible(true)}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>+ Agregar</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={estilos.modalFondo}>
            <View style={estilos.modalContenedor}>
              <Text style={estilos.modalTitulo}>{editarId ? "Editar Transacción" : "Nueva Transacción"}</Text>
              <TextInput placeholder="Nombre" value={nombre} onChangeText={setNombre} style={estilos.input} />
              <TextInput placeholder="Categoría" value={categoria} onChangeText={setCategoria} style={estilos.input} />
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
              <TouchableOpacity onPress={cancelarModal} style={[estilos.btnAgregar, { backgroundColor: "#aaa", marginTop: 10 }]}>
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
  encabezado: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 30, marginBottom: 10, paddingHorizontal: 5 },
  btnAtras: { padding: 5 },
  iconoAtras: { width: 25, height: 25, resizeMode: "contain" },
  titulo: { fontSize: 20, fontWeight: "700", color: "#1a1a1a" },
  iconoSuperior: { width: 30, height: 30 },
  filtros: { flexDirection: "row", justifyContent: "space-around", marginBottom: 10 },
  filtroBtn: { flex: 1, marginHorizontal: 5, padding: 10, borderRadius: 10, borderWidth: 1, borderColor: "#ccc", alignItems: "center" },
  filtroBtnActivo: { backgroundColor: "#1F64BF", borderColor: "#1F64BF" },
  tarjeta: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 15, padding: 12, marginBottom: 10, shadowColor: "#000", shadowOpacity: 0.08, shadowOffset: { width: 0, height: 2 }, shadowRadius: 5, elevation: 3 },
  imagen: { width: 45, height: 45, borderRadius: 25, marginRight: 15 },
  info: { flex: 1 },
  nombre: { fontSize: 16, fontWeight: "600", color: "#222" },
  categoria: { fontSize: 13, color: "#777", marginTop: 2 },
  fecha: { fontSize: 12, color: "#aaa", marginTop: 2 },
  monto: { fontSize: 15, fontWeight: "bold" },
  btnModal: { position: "absolute", bottom: 100, right: 20, backgroundColor: "#1F64BF", padding: 15, borderRadius: 50, alignItems: "center", justifyContent: "center" },
  modalFondo: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContenedor: { width: "90%", backgroundColor: "#fff", borderRadius: 20, padding: 20 },
  modalTitulo: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  input: { backgroundColor: "#f0f0f0", borderRadius: 10, padding: 10, marginBottom: 10 },
  filtroTipo: { flexDirection: "row", marginBottom: 10 },
  tipoBtn: { flex: 1, padding: 10, borderRadius: 10, borderWidth: 1, borderColor: "#ccc", marginRight: 5, alignItems: "center" },
  tipoBtnActivo: { backgroundColor: "#1F64BF", borderColor: "#1F64BF" },
  btnAgregar: { backgroundColor: "#1F64BF", padding: 12, borderRadius: 10, alignItems: "center" },
});
