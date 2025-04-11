import colors from "@/theme/colors";
import { ActivityCardProps } from "@/types/types";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";

const ActivityCard: React.FC<ActivityCardProps> = ({ item, onPress }) => (
  <TouchableOpacity onPress={() => onPress(item)} style={styles.card}>
    <Image source={item.imagen} style={styles.image} />
    <View style={styles.overlay}>
      <Text style={styles.cardTitle}>{item.nombre}</Text>
    </View>
  </TouchableOpacity>
);
  
export default ActivityCard;

const styles = StyleSheet.create({
  card: {
      marginBottom: 20,
      width: 350,
      borderRadius: 12,
      overflow: "hidden",
    },
  image: {
    width: 350,
    height: 100,
    resizeMode: "cover",
    borderRadius: 12,
  },
  overlay: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: colors.background,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  cardTitle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "bold",
  }
})