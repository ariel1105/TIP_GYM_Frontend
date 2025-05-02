import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import { AlertModalProps } from "@/types/types";
import useColors from "@/theme/useColors";

const AlertModal = ({ visible, onClose, title, mensaje, action, pressableText, hideCloseButton}: AlertModalProps) => {

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
    button: {
      paddingVertical: 10,
      paddingHorizontal: 30,
      borderRadius: 10,
      backgroundColor: colors.primary,
    },
    buttonText: {
      fontWeight: "bold",
      color: colors.onPrimary,
    },
    pressableText: {
      marginTop: 20,
      textAlign: "center",
      color: colors.black,
    },
  });
  
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{mensaje}</Text>
          {!hideCloseButton && (
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          )}
          <Pressable  onPress={action}>
            <Text style={styles.pressableText}>
              {pressableText}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default AlertModal;