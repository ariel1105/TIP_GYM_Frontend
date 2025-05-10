import React, { useEffect, useState, useCallback  } from "react";
import { View, Text, Alert, Button, StyleSheet, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-big-calendar";
import moment from "moment";
import Api from "@/services/Api";
import { useAuth } from "@/context/AuthContext";
import useColors from "@/theme/useColors";
import { Turn, Event } from "@/types/types";
import AlertModal from "./AlertModal";
import { router } from "expo-router";
import { Routes } from "@/app/constants/routes";
import { useFocusEffect } from '@react-navigation/native';

const WeeklyCalendarView: React.FC = () => {
  const [weekStart, setWeekStart] = useState(moment().startOf("isoWeek"));
  const [events, setEvents] = useState<Event[]>([]);
  const { setMember, member, token } = useAuth();
  const colors = useColors();
  const [userTurns, setUserTurns] = useState<number[]>([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [render, setRender] = useState(false);
  const [modalProps, setModalProps] = useState({
    title: "",
    mensaje: "",
    action: () => {},
    actionButton: "",
    closeButton: "Cerrar",
  });

      const runSequentially = async () => {
      
      await fetchUserTurns();   
      await fetchWeeklyTurns(); 
    };

  useFocusEffect(
    useCallback(() => {
      runSequentially()
      return () => {

      };
    }, [weekStart, member, userTurns])
  );
  const fetchWeeklyTurns = async () => {
    try {
      const response = await Api.getWeekTurns(weekStart.format("YYYY-MM-DD"));
      const formattedEvents: Event[] = response.data.map((turn: Turn) => {
        const start = new Date(turn.datetime);
        start.setHours(start.getHours() + 3);
        const end = new Date(start.getTime() + 60 * 60 * 1000);
      
        const isPast = start < new Date();
        const isUserSubscribed = userTurns.includes(turn.id);
        const isFull = turn.enrolled >= turn.capacity;
        
        return {
          id: turn.id.toString(),
          title: turn.activityName,
          start,
          end,
          disabled: isPast || isUserSubscribed || isFull,
        };
      });      
      setEvents(formattedEvents);
    } catch (error: any) {
      Alert.alert("Error al obtener turnos semanales", JSON.stringify(error.message));
    }
  };

  const fetchUserTurns = async () => {
    if(member) {setUserTurns(member.turns)}
  };

  const handleSubscribe = async (turnId: number) => {
    if (!member || !token) {
      openModal("Atención", "Necesitás estar logueado para inscribirte.", () => router.push(Routes.Login), "Loguearme");
      return;
    }
    if (userTurns.includes(turnId)) {
      openModal("Atención", "Ya estás inscrito en este turno", () => setModalVisible(false));
      return;
    }
    try {
      await Api.suscribe({ turnIds: [turnId] }, token);
      setMember({ ...member, turns: [...member.turns, turnId], });
      setUserTurns((prev) => [...prev, turnId]);
      openModal("Éxito", "¡Te inscribiste con éxito!", () => setModalVisible(false));
    } catch (error) {
      openModal("Error", "Error al suscribirse", () => setModalVisible(false));
    }
  };

  const handleEventPress = (event: Event & { disabled?: boolean }) => {
    if (event.disabled) {
      openModal("Turno no disponible", "Este turno no está disponible.", () => setModalVisible(false));
      return;
    }
    openModal(
      "Inscripción",
      `${event.title} - ${moment(event.start).format("dddd HH:mm")}`,
      () => handleSubscribe(Number(event.id)),
      "Confirmar"
    );
  };
  
  const openModal = (
    title: string,
    mensaje: string,
    action: () => void,
    actionButton: string = "",
    closeButton: string = "Cerrar"
  ) => {
    setModalProps({ title, mensaje, action, actionButton, closeButton });
    setModalVisible(true);
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
        eventCellStyle={(event) => ({
          backgroundColor: event.disabled ? colors.disabledGray : colors.primary,
          borderRadius: 5,
          opacity: event.disabled ? 0.6 : 1,
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
      <AlertModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={modalProps.title}
        mensaje={modalProps.mensaje}
        action={modalProps.action}
        actionButton={modalProps.actionButton}
        closeButton={modalProps.closeButton}
      />
    </View>
  );
};

export default WeeklyCalendarView;
