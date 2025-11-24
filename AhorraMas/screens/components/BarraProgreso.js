import { View, Text, StyleSheet } from "react-native";
import React from "react";

export default function BarraProgreso({ gasto = 3200, presupuesto = 5000 }) {
  const porcentaje = gasto / presupuesto;
  const progreso = Math.min(porcentaje, 1);


  let colorBarra = "#2ecc71"; 
  let mensaje = "";
  let colorMensaje = "#444";

  if (porcentaje >= 0.7 && porcentaje < 1) {
    colorBarra = "#f1c40f";
    mensaje = "⚠ Ya estás cerca de tu límite de presupuesto";
    colorMensaje = "#e67e22";
  } else if (porcentaje >= 1) {
    colorBarra = "#e74c3c"; 
    mensaje = "❌ Has excedido tu presupuesto";
    colorMensaje = "#c0392b";
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Presupuesto del mes</Text>
        <Text style={styles.label}>
          ${gasto} / ${presupuesto}
        </Text>
      </View>

      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${progreso * 100}%`, backgroundColor: colorBarra }]} />
      </View>

      <Text style={styles.subtext}>
        Te quedan ${presupuesto - gasto} disponibles
      </Text>

      {mensaje !== "" && (
        <Text style={[styles.alertText, { color: colorMensaje }]}>
          {mensaje}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 25
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F64BF"
  },
  barBackground: {
    width: "100%",
    height: 14,
    backgroundColor: "#DCEBFF",
    borderRadius: 10,
    overflow: "hidden"
  },
  barFill: {
    height: "100%",
    borderRadius: 10
  },
  subtext: {
    marginTop: 6,
    fontSize: 13,
    color: "#4B4B4B",
    fontWeight: "500"
  },
  alertText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center"
  }
});
