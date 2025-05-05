import { ScheduleSelectorProps, Turn } from "@/types/types";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Api from "@/services/Api";
import useColors from "@/theme/useColors";
import { useAuth } from "@/context/AuthContext";

const ScheduleSelector: React.FC<ScheduleSelectorProps> = ({
  selectedActivity,
  selectedDates,
  selectedHorario,
  setSelectedHorario,
  getTurnosByActivity,
}) => {
  const colors = useColors();
  const { member, token } = useAuth();
  const fechaSeleccionada = selectedDates[selectedDates.length - 1];
  const [memberTurns, setMemberTurns] = useState<number[]>([]);

  useEffect(() => {
    const fetchMemberTurns = async () => {
      try {
        if (!member?.id) return

        const response = await Api.getMember(member.id, token!);
        setMemberTurns(response.data.turns || []);
      } catch (error) {
        console.error("Error al obtener los turnos del miembro:", error);
      }
    };

    fetchMemberTurns();
  }, [member?.id]);

  const horarios = getTurnosByActivity(selectedActivity.nombre)
    .filter((turno) =>
      moment(turno.datetime).format("YYYY-MM-DD") === fechaSeleccionada
    );

  const isFull = (turn: Turn) => {
    return turn.capacity - turn.enrolled === 0;
  };

  const isSuscribed = (turnId: number) => {
    return memberTurns.includes(turnId);
  };

  const styles = StyleSheet.create({
    scheduleBox: {
      marginTop: 10,
      padding: 10,
      borderRadius: 10,
      borderColor: colors.black,
    },
    scheduleTitle: {
      color: colors.text,
      textAlign: "center",
      marginBottom: 5,
      fontWeight: "bold",
    },
    scheduleItemContainer: {
      backgroundColor: colors.secondary,
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 8,
      marginVertical: 4,
    },
    scheduleItemSelected: {
      backgroundColor: colors.primary,
      borderWidth: 2,
      borderColor: colors.black,
    },
    scheduleItemText: {
      color: colors.black,
      fontWeight: "bold",
      textAlign: "center",
    },
    scheduleItemTextSelected: {
      color: colors.black,
      textDecorationLine: "underline",
    },
    disabledItemContainer: {
      backgroundColor: colors.disabledGray,
      borderColor: colors.grayMedium,
      borderWidth: 1,
    },
    disabledItemText: {
      color: colors.disabledText,
      fontStyle: "italic",
    },
  });

  return (
    <View style={styles.scheduleBox}>
      <Text style={styles.scheduleTitle}>HORARIOS</Text>
      {horarios.map((turn) => {
        const hour = moment(turn.datetime).add(3, 'hours').format("HH:mm");
        const isSelected = selectedHorario === hour;
        const full = isFull(turn);
        const alreadySuscribed = isSuscribed(turn.id);

        return (
          <TouchableOpacity
            key={turn.id}
            onPress={() => setSelectedHorario(hour)}
            disabled={full || alreadySuscribed}
            style={[
              styles.scheduleItemContainer,
              isSelected && styles.scheduleItemSelected,
              full && styles.disabledItemContainer,
            ]}
          >
            <Text style={[
              styles.scheduleItemText,
              isSelected && styles.scheduleItemTextSelected,
              (full || alreadySuscribed) && styles.disabledItemText,
            ]}>
              {hour} {alreadySuscribed
                ? "(Ya estás inscripto en este turno)"
                : `(Cupos disponibles: ${turn.capacity - turn.enrolled})`}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default ScheduleSelector;
