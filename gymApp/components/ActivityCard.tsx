import useColors from "@/theme/useColors";
import { ActivityCardProps } from "@/types/types";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

const ActivityCard: React.FC<ActivityCardProps> = ({ item, onPress, width = 350  }) => {
  const colors = useColors();

  const styles = StyleSheet.create({
    card: {
      marginBottom: 20,
      width: width,
      borderRadius: 12,
      overflow: "hidden",
    },
    image: {
      width: width,
      height: 100,
      resizeMode: "cover",
      borderRadius: 12,
    },
    overlay: {
      position: "absolute",
      top: 10,
      left: 10,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 6,
      backgroundColor: colors.primary,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.black,
    },
  });

  return (
    <TouchableOpacity onPress={() => onPress(item)} style={styles.card}>
      <Image source={item.imagen} style={styles.image} />
      <View style={styles.overlay}>
        <Text style={styles.cardTitle}>{item.nombre}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ActivityCard;
