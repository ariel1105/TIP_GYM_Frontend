import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function HomeScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');

  return (
    <ImageBackground
      source={require("../../assets/images/fondo.jpg")} // fondo de gimnasio
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.greeting}>Hola, {userName || "Invitado"}!</Text>
        <Text style={styles.question}>¿Qué querés entrenar hoy?</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={() => router.push("/activities")}>
            <Icon name="running" size={40} color="#000" />
            <Text style={styles.buttonText}>Actividades</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => router.push("/machines")}>
            <Icon name="dumbbell" size={40} color="#000" />
            <Text style={styles.buttonText}>Máquinas</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // oscurece la imagen de fondo
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#F8CC2B",
    marginBottom: 10,
    textAlign: "center",
  },
  question: {
    fontSize: 20,
    color: "#FFFFFF",
    marginBottom: 40,
    textAlign: "center",
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: "#F8CC2B",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "45%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
});