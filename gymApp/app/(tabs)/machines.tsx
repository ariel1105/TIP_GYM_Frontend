import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

export default function Machines() {
  const handleSelect = (pack: string) => {
    Toast.show({
      type: "success",
      text1: `Has seleccionado el ${pack}`,
      text2: "En un momento te redirigiremos al pago 🧾",
      position: "bottom",
    });

    // Lógica para redirigir al pago después
    // setTimeout(() => navigation.navigate("PagoScreen", { tipo: pack }), 3000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Espacio de máquinas</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.optionButton} onPress={() => handleSelect("Pack x2 días")}>
          <Text style={styles.buttonText}>Pack x2 días</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton} onPress={() => handleSelect("Pack x3 días")}>
          <Text style={styles.buttonText}>Pack x3 días</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton} onPress={() => handleSelect("Pack Libre")}>
          <Text style={styles.buttonText}>Libre</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#000", 
    alignItems: "center", 
    justifyContent: "center", 
    padding: 20 
  },
  title: { 
    fontSize: 28, 
    fontWeight: "700", 
    color: "#D3D3D3", 
    marginBottom: 30,
    textAlign: "center" 
  },
  buttonContainer: {
    gap: 20,
    width: "100%",
    alignItems: "center"
  },
  optionButton: {
    backgroundColor: "#6A0DAD",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: "80%",
    alignItems: "center"
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600"
  }
});
