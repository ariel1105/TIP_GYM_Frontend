import React, { useEffect, useState } from "react";
import { View, Text, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { Calendar } from "react-native-big-calendar";
import moment from "moment";
import Api from "@/services/Api";
import { useAuth } from "@/context/AuthContext";
import useColors from "@/theme/useColors";
import { Turn, Event } from "@/types/types";
import AlertModal from "./AlertModal";
import { router } from "expo-router";
import { Routes } from "@/app/constants/routes";
import { useModal } from "@/hooks/useModal";

const WeeklyCalendarView: React.FC = () => {
  const [weekStart, setWeekStart] = useState(moment().startOf("isoWeek"));
  const [events, setEvents] = useState<Event[]>([]);
  const { setMember, member, token } = useAuth();
  const colors = useColors();
  const [turnsToShow, setTurnsToShow] = useState<Turn[]>([]);

  const { modalVisible, setModalVisible, modalProps, openModal } = useModal();

  useEffect(() => {
    fetchWeeklyTurns();
  }, [weekStart]);

  useEffect(() => {
    formatTurnsToEvents();
  }, [member, weekStart, turnsToShow])

  const formatTurnsToEvents = () => {
    const formattedEvents: Event[] = turnsToShow.map((turn: Turn) => {
    const start = new Date(turn.datetime);
    start.setHours(start.getHours() + 3);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const isPast = start < new Date();
    const isUserSubscribed = member?.turns.includes(turn.id);
    const isFull = turn.enrolled >= turn.capacity;
    return {
      id: turn.id,
      title: turn.activityName,
      start,
      end,
      disabled: isPast || isUserSubscribed || isFull,
      activityId: turn.activityId, 
    };
    });      
    setEvents(formattedEvents);
  };

  const fetchWeeklyTurns = async () => {
    try {
      const response = await Api.getWeekTurns(weekStart.format("YYYY-MM-DD"));
      setTurnsToShow(response.data)
    } catch (error: any) {
      Alert.alert("Error al obtener turnos semanales", JSON.stringify(error.message));
    }
  };

  const handleSubscribe = async (turnId: number, event: Event) => {
    if (!member || !token) {
      openModal("Atención", "Necesitás estar logueado para inscribirte.", () => router.push(Routes.Login), "Loguearme");
      return;
    }
    if (member.turns.includes(turnId)) {
      openModal("Atención", "Ya estás inscrito en este turno", () => setModalVisible(false));
      return;
    }
    try {
      await Api.suscribe({ turnIds: [turnId] }, token);
      const updatedVouchers = [...member.vouchers];
      const voucherToUpdate = updatedVouchers.find(v => v.activityId === event.activityId && (v.remainingClasses ?? 0) > 0);
      if (voucherToUpdate) voucherToUpdate.remainingClasses = (voucherToUpdate.remainingClasses ?? 1) - 1;
      setMember({
        ...member,
        turns: [...member.turns, turnId],
        vouchers: updatedVouchers
      });
      openModal("Éxito", "¡Te inscribiste con éxito!", () => setModalVisible(false));
    } catch (error: any) {
      const errorMessage = error?.response?.data || error?.message || "";
      if (errorMessage.includes("No hay voucher válido para la actividad")) {
        openModal("Sin voucher", "No tenés un voucher válido para esta actividad.", () => setModalVisible(false));
      } else {
        openModal("Error", "Error al suscribirse", () => setModalVisible(false));
      }
    }
  };

  const getRemainingClasses = (activityId: number): number => {
  if (!member?.vouchers) return 0;
  return member.vouchers
    .filter((voucher) => voucher.activityId === activityId)
    .reduce((sum, voucher) => sum + (voucher.remainingClasses || 0), 0);
  };

  const handleEventPress = (event: Event & { disabled?: boolean }) => {
    if (event.disabled) {
      openModal("Turno no disponible", "Este turno no está disponible.", () => setModalVisible(false));
      return;
    }
    const remaining = getRemainingClasses(event.activityId);
    const mensaje = `${event.title} - ${moment(event.start).format("dddd HH:mm")}\nVouchers restantes: ${remaining}`;
    openModal(
      "Inscripción",
      mensaje,
      () => handleSubscribe(Number(event.id), event),
      "Confirmar",
      "Cerrar",
      "Adquirir vouchers",
      () => router.push(Routes.Vouchers) 
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
        minHour={7}
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
            nowIndicator: colors.nowLineIndicator,
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
        closeButton={modalProps.closeButton || "Cerrar"}
        linkText={modalProps.linkText}
        linkAction={modalProps.linkAction}
      />
    </View>
  );
};

export default WeeklyCalendarView;