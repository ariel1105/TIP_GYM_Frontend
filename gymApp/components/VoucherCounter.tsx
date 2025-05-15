import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import useColors from "@/theme/useColors";

interface VoucherCounterProps {
  count: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

const VoucherCounter: React.FC<VoucherCounterProps> = ({ count, onIncrease, onDecrease }) => {
  const colors = useColors();

  const styles = StyleSheet.create({
     container: {
        flexDirection: "row",
        marginLeft: 25,
        alignItems: "center",
        minWidth: 100,
        justifyContent: "space-between",
    },
    button: {
      width: 30,
      height: 30,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.primary,
      borderRadius: 6,
      marginHorizontal: 5,
    },
    buttonText: {
      color: colors.onPrimary,
      fontSize: 18,
      fontWeight: "bold",
    },
    countText: {
      fontSize: 16,
      color: colors.text,
    },
  });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onDecrease}>
        <Text style={styles.buttonText}>-</Text>
      </TouchableOpacity>
      <Text style={styles.countText}>{count}</Text>
      <TouchableOpacity style={styles.button} onPress={onIncrease}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VoucherCounter;
