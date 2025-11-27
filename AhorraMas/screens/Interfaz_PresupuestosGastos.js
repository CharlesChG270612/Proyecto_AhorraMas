import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Modal,
  TextInput,
  Alert,
} from "react-native";

export default function Interfaz_PresupuestosGastos({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [nombreTema, setNombreTema] = useState("");

  const [presupuestoTotal, setPresupuestoTotal] = useState(null);
  const [presupuestoModal, setPresupuestoModal] = useState(false);
  const [valorPresupuesto, setValorPresupuesto] = useState("");

  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: "none" },
    });

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

  const [servicios, setServicios] = useState([
    {
      id: "1",
      nombre: "Servicio eléctrico",
      descripcion: "Registra un presupuesto",
      imagen: require("../assets/iconos/electricidad.png"),
    },
    {
      id: "2",
      nombre: "Servicio de agua",
      descripcion: "Registra un presupuesto",
      imagen: require("../assets/iconos/agua.png"),
    },
    {
      id: "3",
      nombre: "Servicio de internet",
      descripcion: "Registra un presupuesto",
      imagen: require("../assets/iconos/internet.png"),
    },
  ]);

  const abrirDetalle = (item) => {
    navigation.navigate("DetallePresupuesto", { servicio: item });
  };

  const guardarTema = () => {
    if (!nombreTema.trim()) {
      Alert.alert("Error", "Escribe un nombre para el tema.");
      return;
    }

    Alert.alert("Confirmación", `¿Crear el tema "${nombreTema}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Crear",
        onPress: () => {
          const nuevoTema = {
            id: Date.now().toString(),
            nombre: nombreTema,
            descripcion: "Registra un presupuesto",
            imagen: require("../assets/iconos/internet.png"),
          };

          setServicios((prev) => [...prev, nuevoTema]);
          setNombreTema("");
          setModalVisible(false);
        },
      },
    ]);
  };

  const eliminarTema = (id) => {
    Alert.alert("Eliminar tema", "¿Estás seguro de eliminar este tema?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          setServicios((prev) => prev.filter((s) => s.id !== id));
        },
      },
    ]);
  };

  const guardarPresupuesto = () => {
    const numero = Number(valorPresupuesto);

    // ⛔ Validación agregada: evitar negativos, 0 y valores no numéricos
    if (!valorPresupuesto.trim() || isNaN(numero)) {
      Alert.alert("Error", "Ingresa un valor numérico válido.");
      return;
    }

    if (numero <= 0) {
      Alert.alert("Error", "El presupuesto debe ser mayor a 0.");
      return;
    }

    setPresupuestoTotal(numero);
    setPresupuestoModal(false);
    setValorPresupuesto("");
  };

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

            {/* ----- BLOQUE PRESUPUESTO ----- */}
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
                  <View style={[styles.progressRelleno, { width: "0%" }]} />
                </View>

                <Text style={styles.restanteTexto}>
                  Restante: ${presupuestoTotal}
                </Text>
              </View>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.tarjeta}>
            <TouchableOpacity onPress={() => abrirDetalle(item)}>
              <View>
                <Text style={styles.nombre}>{item.nombre}</Text>
                <Text style={styles.descripcion}>{item.descripcion}</Text>
              </View>
            </TouchableOpacity>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image source={item.imagen} style={styles.imagenServicio} />

              <TouchableOpacity
                onPress={() => eliminarTema(item.id)}
                style={styles.botonEliminar}
              >
                <Text style={{ color: "#fff", fontSize: 12 }}>X</Text>
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
    backgroundColor: "#36A15B",
  },
  restanteTexto: {
    marginTop: 5,
    fontSize: 13,
    color: "#555",
  },

  tarjeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 18,
    marginBottom: 15,
    elevation: 3,
  },
  nombre: { fontSize: 16, fontWeight: "700" },
  descripcion: { fontSize: 13, color: "#888", marginTop: 4 },
  imagenServicio: { width: 90, height: 90, resizeMode: "contain" },

  botonEliminar: {
    backgroundColor: "#E53935",
    padding: 8,
    borderRadius: 10,
    marginLeft: 10,
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