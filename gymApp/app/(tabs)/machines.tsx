import colors from "@/theme/colors";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
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
    <ImageBackground source={require("../../assets/images/machines.jpg")} 
      style={styles.background} 
      resizeMode="cover">
      <View style={styles.overlay}>
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.white,
    marginBottom: 30,
    textAlign: "center",
  },
  buttonContainer: {
    gap: 20,
    width: "100%",
    alignItems: "center",
  },
  optionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonText: {
    color: colors.black,
    fontSize: 18,
    fontWeight: "600",
  },
});
