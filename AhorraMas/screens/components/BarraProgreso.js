import { View, Text, StyleSheet } from "react-native";
import React from "react";

export default function BarraProgreso({ gasto = 3200, presupuesto = 5000 }) {
  const progreso = Math.min(gasto / presupuesto, 1);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Presupuesto del mes</Text>
        <Text style={styles.label}>
          ${gasto} / ${presupuesto}
        </Text>
      </View>

      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${progreso * 100}%` }]} />
      </View>

      <Text style={styles.subtext}>
        Te quedan ${presupuesto - gasto} disponibles
      </Text>
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
    backgroundColor: "#358d15ff",
    borderRadius: 10
  },
  subtext: {
    marginTop: 6,
    fontSize: 13,
    color: "#4B4B4B",
    fontWeight: "500"
  }
});
