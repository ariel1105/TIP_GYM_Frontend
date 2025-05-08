import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import { AlertModalProps } from "@/types/types";
import useColors from "@/theme/useColors";

const AlertModal = ({ visible, onClose, title, mensaje, action, actionButton, hideCloseButton}: AlertModalProps) => {

  const colors = useColors()

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.overlay,
    },
    container: {
      padding: 30,
      borderRadius: 20,
      alignItems: "center",
      width: "80%",
      backgroundColor: colors.white,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 8,
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 10,
      color: colors.black,
    },
    message: {
      fontSize: 16,
      textAlign: "center",
      marginBottom: 20,
      color: colors.black,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: hideCloseButton ? "center" : "space-between",
      width: "100%",
      marginTop: 20,
    },
    button: {
      paddingVertical: 10,
      paddingHorizontal: 30,
      borderRadius: 10,
      backgroundColor: colors.primary,
      marginHorizontal: hideCloseButton ? 0 : 5,
    },
    buttonText: {
      fontWeight: "bold",
      color: colors.onPrimary,
      textAlign: "center",
      flexWrap: "wrap",
      width: "100%"
    },
  });
  
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{mensaje}</Text>
          <View style={styles.buttonContainer}>
            {!hideCloseButton && (
              <TouchableOpacity style={styles.button} onPress={onClose}>
                <Text style={styles.buttonText}>Cerrar</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.button} onPress={action}>
              <Text style={styles.buttonText}>{actionButton}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AlertModal;