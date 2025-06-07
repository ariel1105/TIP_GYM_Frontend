import React from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import { AlertModalProps } from "@/types/types";
import useColors from "@/theme/useColors";
import Icon from 'react-native-vector-icons/FontAwesome5';

const AlertModal = ({ visible, title, mensaje, onClose, closeButton, action, actionButton, linkText, linkAction, showSubscribe = false, onSubscribePress}: AlertModalProps) => {

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
    link: {
      color: colors.black, 
      marginTop: 10, 
      textDecorationLine: "underline" 
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: actionButton ? "space-between" : "center" ,
      width: "100%",
      marginTop: 20,
    },
    button: {
      paddingVertical: 10,
      paddingHorizontal: 30,
      borderRadius: 10,
      backgroundColor: colors.primary,
      marginHorizontal: actionButton ? 5 : 0,
    },
    buttonText: {
      fontWeight: "bold",
      color: colors.onPrimary,
      textAlign: "center",
      flexWrap: "wrap",
      width: "100%"
    },
    bellContainer: {
      position: "absolute",
      top: 10,
      right: 10,
      zIndex: 1,
    },

    bellBackground: {
      backgroundColor: colors.primary,
      borderRadius: 20,
      padding: 6,
      alignItems: "center",
      justifyContent: "center",
    },

  });
  
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {showSubscribe && 
            <TouchableOpacity
              style={styles.bellContainer}
              onPress={onSubscribePress}
            >
              <View style={styles.bellBackground}>
                <Icon name="bell" size={16} color="black" />
              </View>
            </TouchableOpacity>

          }
          
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{mensaje}</Text>
          {linkText && linkAction && (
            <Pressable onPress={linkAction}>
              <Text style={styles.link}>
                {linkText}
              </Text>
            </Pressable>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>{closeButton}</Text>
            </TouchableOpacity>
            {actionButton && (
              <TouchableOpacity style={styles.button} onPress={action}>
                <Text style={styles.buttonText}>{actionButton}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AlertModal;