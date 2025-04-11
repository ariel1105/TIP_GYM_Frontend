import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Routes } from "../constants/routes";
import colors from "@/theme/colors";

export default function HomeScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');

  return (
    <ImageBackground
      source={require("../../assets/images/fondo.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.greeting}>Hola, {userName || "Invitado"}!</Text>
        <Text style={styles.question}>¿Qué querés entrenar hoy?</Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button} onPress={() => router.push(Routes.Activities)}>
            <Icon name="running" size={40} color="#000" />
            <Text style={styles.buttonText}>Actividades</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => router.push(Routes.Machines)}>
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
    backgroundColor: colors.overlay,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
    textAlign: "center",
  },
  question: {
    fontSize: 20,
    color: colors.white,
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
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "45%",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  buttonText: {
    color: colors.black,
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
});