import useColors from "@/theme/useColors";
import { ActivityCardProps } from "@/types/types";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';

const ActivityCard: React.FC<ActivityCardProps> = ({ item: activity, onPress, width = 350, onSubscribePress }) => {
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
    overlayContainer: {
      position: "absolute",
      top: 10,
      left: 10,
      right: 10,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    titleContainer: {
      backgroundColor: colors.primary,
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 8,
      maxWidth: "80%",
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.black,
    },
    subscribeButton: {
      backgroundColor: colors.primary,
      padding: 8,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    subscribeIcon: {
      color: colors.black,
      fontSize: 16,
    },
  });

  return (
    <TouchableOpacity onPress={() => onPress(activity)} style={styles.card}>
      <Image source={activity.imagen} style={styles.image} />
      <View style={styles.overlayContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.cardTitle} numberOfLines={1}>{activity.nombre}</Text>
        </View>

        {onSubscribePress && (
          <TouchableOpacity
            onPress={() => onSubscribePress(activity)}
            style={styles.subscribeButton}
            activeOpacity={0.7}
          >
            <Icon
              name={activity.subscribed ? "bell-slash" : "bell"}
              style={styles.subscribeIcon}
              solid
            />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ActivityCard;
