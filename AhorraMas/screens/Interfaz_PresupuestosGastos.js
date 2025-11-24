import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image,Modal,TextInput,Alert } from "react-native";
import { useEffect } from "react";

export default function Interfaz_PresupuestosGastos({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [nombreTema, setNombreTema] = useState("");

   useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: { display: "none" }
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
        }
      });
    };
  }, []);
  const [servicios, setServicios] = useState([
    { id: "1", nombre: "Servicio eléctrico", descripcion: "Registra un presupuesto", imagen: require("../assets/iconos/electricidad.png") },
    { id: "2", nombre: "Servicio de agua", descripcion: "Registra un presupuesto", imagen: require("../assets/iconos/agua.png") },
    { id: "3", nombre: "Servicio de internet", descripcion: "Registra un presupuesto", imagen: require("../assets/iconos/internet.png") },
  ]);

  const abrirDetalle = (item) => {
    navigation.navigate("DetallePresupuesto", { servicio: item });
  };

  const guardarTema = () => {
  if (!nombreTema.trim()) {
    Alert.alert("Error", "Escribe un nombre para el tema.");
    return;
  }

  Alert.alert(
    "Confirmación",
    `¿Crear el tema "${nombreTema}"?`,
    [
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

          setServicios(prev => [...prev, nuevoTema]);
          setNombreTema("");
          setModalVisible(false);
        }
      }
    ]
  );
};

const eliminarTema = (id) => {
  Alert.alert(
    "Eliminar tema",
    "¿Estás seguro de eliminar este tema?",
    [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          setServicios(prev => prev.filter(s => s.id !== id));
        }
      }
    ]
  );
};


  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <FlatList
        data={servicios}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20 }}
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
      >
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

              <TouchableOpacity
                onPress={guardarTema}
                style={styles.botonModal}
              >
                <Text style={styles.textoBotonModal}>Guardar</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
      <TouchableOpacity style={styles.botonOtroTema} onPress={() => setModalVisible(true)}>
        <Text style={styles.textoBotonOtroTema}>Designar presupuesto a otro tema</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", padding: 20, borderRadius: 18, marginBottom: 15, elevation: 3 },
  nombre: { fontSize: 16, fontWeight: "700" },
  descripcion: { fontSize: 13, color: "#888", marginTop: 4 },
  imagenServicio: { width: 90, height: 90, resizeMode: "contain" },
  botonOtroTema: { backgroundColor: "#2196F3", marginHorizontal: 20, borderRadius: 15, paddingVertical: 14, alignItems: "center", marginBottom: 50 },
  textoBotonOtroTema: { color: "#fff", fontSize: 16, fontWeight: "700" },
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
  elevation: 5,
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
  backgroundColor: "#2196F3",
  padding: 12,
  borderRadius: 10,
  width: "48%",
  alignItems: "center",
},
textoBotonModal: {
  color: "#fff",
  fontWeight: "700",
},
botonEliminar: {
  backgroundColor: "#E53935",
  padding: 8,
  borderRadius: 10,
  marginLeft: 10
},

});
