import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function DetallePresupuesto({ route }) {
  const { servicio } = route.params;

  const [empresa, setEmpresa] = useState("");
  const [tipoMonto, setTipoMonto] = useState("");
  const [monto, setMonto] = useState("");
  const [presupuestos, setPresupuestos] = useState([]);
  const [editarId, setEditarId] = useState(null);

  const validarCampos = () => {
    if (!empresa) {
      Alert.alert("Falta empresa", "Selecciona una empresa.");
      return false;
    }
    if (!tipoMonto.trim()) {
      Alert.alert("Falta tipo de monto", "Debes ingresar el tipo de monto.");
      return false;
    }
    if (!monto.trim()) {
      Alert.alert("Falta monto", "Ingresa un monto válido.");
      return false;
    }
    const montoNum = Number(monto);
    if (isNaN(montoNum) || montoNum <= 0) {
      Alert.alert("Monto inválido", "El monto debe ser un número mayor a 0.");
      return false;
    }
    return true;
  };

  const agregarPresupuesto = () => {
    if (!validarCampos()) return;

    if (editarId) {
      Alert.alert("Confirmación", "¿Deseas actualizar el registro?", [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Actualizar",
          onPress: () => {
            setPresupuestos((prev) =>
              prev.map((p) =>
                p.id === editarId ? { ...p, empresa, tipoMonto, monto } : p
              )
            );
            limpiar();
          },
        },
      ]);
    } else {
      const nuevo = {
        id: Date.now().toString(),
        empresa,
        tipoMonto,
        monto,
      };
      setPresupuestos((prev) => [...prev, nuevo]);
      limpiar();
    }
  };

  const eliminarPresupuesto = (id) => {
    Alert.alert("Confirmación", "¿Eliminar este presupuesto?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          setPresupuestos((prev) => prev.filter((p) => p.id !== id));
        },
      },
    ]);
  };

  const editarPresupuesto = (item) => {
    setEmpresa(item.empresa);
    setTipoMonto(item.tipoMonto);
    setMonto(item.monto.toString());
    setEditarId(item.id);
  };

  const limpiar = () => {
    setEmpresa("");
    setTipoMonto("");
    setMonto("");
    setEditarId(null);
  };

return (
  <View style={{ flex: 1, backgroundColor: "#fff" }}>
    <FlatList
      data={presupuestos}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 20 }}
      ListHeaderComponent={
        <View>
          <Text style={styles.titulo}>{servicio.nombre}</Text>

          <Text style={{ marginBottom: 10, color: "#555" }}>
            Presupuestos del último mes y del año
          </Text>

          <View style={{ marginTop: -5 }}>
            <Text style={styles.label}>Elegir empresa</Text>
            <View style={styles.pickerContainer}>
              <Picker selectedValue={empresa} onValueChange={setEmpresa}>
                <Picker.Item label="Selecciona una empresa" value="" />
                <Picker.Item label="Empresa A" value="a" />
                <Picker.Item label="Empresa B" value="b" />
              </Picker>
            </View>

            <Text style={styles.label}>Tipo de monto</Text>
            <TextInput
              placeholder="Ejemplo: Mensual, Extra, Base..."
              value={tipoMonto}
              onChangeText={setTipoMonto}
              style={styles.input}
            />

            <Text style={styles.label}>Monto</Text>
            <TextInput
              placeholder="Monto"
              value={monto}
              onChangeText={setMonto}
              keyboardType="numeric"
              style={styles.input}
            />

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity
                onPress={agregarPresupuesto}
                style={styles.botonAgregar}
              >
                <Text style={{ color: "#fff" }}>
                  {editarId ? "Actualizar" : "Agregar"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={limpiar}
                style={[styles.botonAgregar, { backgroundColor: "#999" }]}
              >
                <Text style={{ color: "#fff" }}>Cancelar</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.titulo, { marginTop: 20 }]}>Registros</Text>
          </View>
        </View>
      }
      renderItem={({ item }) => (
        <View style={styles.item}>
          <View>
            <Text style={styles.itemNombre}>{item.empresa}</Text>
            <Text>{item.tipoMonto}</Text>
            <Text style={styles.itemMonto}>${item.monto}</Text>
          </View>

          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => editarPresupuesto(item)}
              style={styles.botonEditar}
            >
              <Text style={{ color: "#fff" }}>Editar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => eliminarPresupuesto(item.id)}
              style={styles.botonEliminar}
            >
              <Text style={{ color: "#fff" }}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      ListEmptyComponent={
        <Text style={{ textAlign: "center", marginTop: 20, color: "#777" }}>
          No hay presupuestos registrados
        </Text>
      }
    />
  </View>
);

}

const styles = StyleSheet.create({
  titulo: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 5,
    marginTop: 10,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  itemNombre: { fontSize: 16, fontWeight: "700" },
  itemMonto: { fontSize: 15, color: "#444" },
  botonEditar: {
    backgroundColor: "#2196F3",
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  botonEliminar: {
    backgroundColor: "#E53935",
    padding: 8,
    borderRadius: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#444",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  botonAgregar: {
    flex: 1,
    backgroundColor: "#1F64BF",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
  },
});
