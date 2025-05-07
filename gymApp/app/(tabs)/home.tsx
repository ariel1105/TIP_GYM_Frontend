import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from "react-native";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Routes } from "../constants/routes";
import useColors from "@/theme/useColors";
import Api from "@/services/Api";
import { AppColors } from "@/types/types";
import { useAuth } from "@/context/AuthContext";

export default function HomeScreen() {
  const router = useRouter()
  const { member } = useAuth()
  const colors : AppColors = useColors()

  return (
    <ImageBackground
      source={require("../../assets/images/fondo.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      {!member && (
        <TouchableOpacity
          style={[styles.loginButton, { backgroundColor: colors.primary }]}
          onPress={() => router.push(Routes.Login)}
        >
          <Text style={[styles.loginButtonText, { color: colors.onPrimary }]}>Login</Text>
        </TouchableOpacity>
      )}

      <View style={[styles.overlay, { backgroundColor: colors.overlay }]}>
        <Text style={[styles.greeting, { color: colors.text }]}>
          Hola, {member?.name || "Invitado"}!
        </Text>
        <Text style={[styles.question, { color: colors.text }]}>
          ¿Qué querés entrenar hoy?
        </Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary, shadowColor: colors.black }]}
            onPress={() => router.push(Routes.Activities)}
          >
            <Icon name="running" size={40} color={colors.onPrimary} />
            <Text style={[styles.buttonText, { color: colors.onPrimary }]}>Actividades</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary, shadowColor: colors.black }]}
            onPress={() => router.push(Routes.Machines)}
          >
            <Icon name="dumbbell" size={40} color={colors.onPrimary} />
            <Text style={[styles.buttonText, { color: colors.onPrimary }]}>Máquinas</Text>
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
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  question: {
    fontSize: 20,
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
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    width: "45%",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  loginButton: {
    position: "absolute",
    top: 40,
    right: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    zIndex: 10,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  
});