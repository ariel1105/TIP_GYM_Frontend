import React, { useEffect, useState } from "react";
import { View, Text, Alert, Button, StyleSheet, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-big-calendar";
import moment from "moment";
import Api from "@/services/Api";
import { useAuth } from "@/context/AuthContext";
import useColors from "@/theme/useColors";
import { Turn, Event } from "@/types/types";

const WeeklyCalendarView: React.FC = () => {
  const [weekStart, setWeekStart] = useState(moment().startOf("isoWeek"));
  const [events, setEvents] = useState<Event[]>([]);
  const [userTurns, setUserTurns] = useState<number[]>([]);
  const { member, token } = useAuth();
  const colors = useColors();

  useEffect(() => {
    fetchWeeklyTurns();
    fetchUserTurns();
  }, [weekStart]);

  const fetchWeeklyTurns = async () => {
    try {
      const response = await Api.getWeekTurns(weekStart.format("YYYY-MM-DD"));
      const formattedEvents: Event[] = response.data.map((turno: Turn) => {
        const start = new Date(turno.datetime);
        start.setHours(start.getHours() + 3);
        const end = new Date(start.getTime() + 60 * 60 * 1000);

        return {
          id: turno.id.toString(),
          title: turno.activityName,
          start,
          end,
        };
      });
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error al traer turnos semanales:", error);
    }
  };

  const fetchUserTurns = async () => {
    if (!member || !token) return;
    try {
      const response = await Api.getMember(token);
      const turns = response.data.turns
      setUserTurns(turns);
    } catch (error) {
      console.error("Error al obtener los turnos del usuario:", error);
    }
  };

  const handleSubscribe = async (turnId: number) => {
    if (!member || !token) {
      Alert.alert("Necesitás estar logueado para inscribirte.");
      return;
    }
    if (userTurns.includes(turnId)) {
      Alert.alert("Ya estás inscrito en este turno");
      return;
    }

    try {
      await Api.suscribe({ turnIds: [turnId] }, token);
      setUserTurns((prev) => [...prev, turnId]);
      Alert.alert("¡Te inscribiste con éxito!");
    } catch (error) {
      Alert.alert("Error al suscribirse", JSON.stringify(error));
    }
  };

  const handleEventPress = (event: Event) => {
    Alert.alert(
      "¿Querés inscribirte?",
      `${event.title} - ${moment(event.start).format("dddd HH:mm")}`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Confirmar", onPress: () => handleSubscribe(Number(event.id)) },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 10,
    },
    header: {
      marginBottom: 10,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    button: {
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 5,
      alignItems: "center",
      justifyContent: "center",
    },
    buttonText: {
      fontWeight: "bold",
      fontSize: 18,
      color: colors.black,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => setWeekStart((prev) => moment(prev).subtract(1, "week"))}
        >
          <Text style={[styles.buttonText, { color: "black" }]}>←</Text>
        </TouchableOpacity>

        <Text style={{ alignSelf: "center", color: colors.text }}>
          Semana del {weekStart.format("DD/MM/YYYY")}
        </Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={() => setWeekStart((prev) => moment(prev).add(1, "week"))}
        >
          <Text style={[styles.buttonText, { color: "black" }]}>→</Text>
        </TouchableOpacity>
      </View>

      <Calendar
        date={weekStart.toDate()}
        events={events}
        height={600}
        mode="week"
        locale="es-AR"
        weekStartsOn={1}
        showTime={false}
        swipeEnabled={false}
        onPressEvent={handleEventPress}
        eventCellStyle={() => ({
          backgroundColor: colors.primary,
          borderRadius: 5,
        })}
        eventCellTextColor={colors.black}
        theme={{
          palette: {
            primary: {
              main: colors.primary,
              contrastText: colors.black,
            },
            gray: {
              "200": colors.text,
              "500": colors.text,
              "800": colors.text,
            },
            nowIndicator: "#FF0000",
            moreLabel: colors.black,
          },
        }}
      />
    </View>
  );
};

export default WeeklyCalendarView;
