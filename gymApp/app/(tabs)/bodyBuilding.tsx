import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import Api from "@/services/Api";
import AlertModal from "@/components/AlertModal";
import useColors from "@/theme/useColors";
import { lightColors } from "@/theme/colors";

export default function BodyBuilding() {
  const { token } = useAuth();
  const colors = useColors();
  const isLightMode = colors.background === lightColors.background;

  const [daysPerWeek, setDaysPerWeek] = useState(3);
  const [errorVisible, setErrorVisible] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubscribe = async () => {
    try {
      await Api.subscribeToBodyBuilding(daysPerWeek, token!!);
      setSuccessMessage(
        `Te suscribiste a musculación ${
          daysPerWeek === 7 ? "sin límite de días" : `${daysPerWeek} días/semana`
        }`
      );
      setSuccessVisible(true);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data ||
        error?.message ||
        "No se pudo completar la suscripción.";
      setErrorMessage(msg);
      setErrorVisible(true);
    }
  };

  const handlePrev = () => {
    setDaysPerWeek((prev) => (prev === 1 ? 7 : prev - 1));
  };

  const handleNext = () => {
    setDaysPerWeek((prev) => (prev === 7 ? 1 : prev + 1));
  };

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
      color: colors.text,
      marginBottom: 30,
      textAlign: "center",
      ...(isLightMode && {
        backgroundColor: colors.overlay,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
      }),
    },
    counterContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 20,
      marginBottom: 40,
    },
    counterButton: {
      backgroundColor: colors.primary,
      padding: 15,
      borderRadius: 10,
    },
    counterText: {
      fontSize: 22,
      fontWeight: "700",
      color: colors.black,
    },
    counterValue: {
      fontSize: 22,
      fontWeight: "600",
      color: colors.text,
      minWidth: 130,
      textAlign: "center",
      ...(isLightMode && {
        backgroundColor: colors.overlay,
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 6,
      }),
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

  return (
    <ImageBackground
      source={require("../../assets/images/machines.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>Musculación</Text>

        <View style={styles.counterContainer}>
          <TouchableOpacity style={styles.counterButton} onPress={handlePrev}>
            <Text style={styles.counterText}>←</Text>
          </TouchableOpacity>

          <Text style={styles.counterValue}>
            {daysPerWeek === 7 ? "Libre" : `${daysPerWeek} días/sem`}
          </Text>

          <TouchableOpacity style={styles.counterButton} onPress={handleNext}>
            <Text style={styles.counterText}>→</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.optionButton} onPress={handleSubscribe}>
          <Text style={styles.buttonText}>Confirmar suscripción</Text>
        </TouchableOpacity>
      </View>

      <AlertModal
        visible={errorVisible}
        title="Error"
        mensaje={errorMessage}
        onClose={() => setErrorVisible(false)}
        closeButton="Aceptar"
      />

      <AlertModal
        visible={successVisible}
        title="¡Suscripción exitosa!"
        mensaje={successMessage}
        onClose={() => setSuccessVisible(false)}
        closeButton="Cerrar"
      />
    </ImageBackground>
  );
}
