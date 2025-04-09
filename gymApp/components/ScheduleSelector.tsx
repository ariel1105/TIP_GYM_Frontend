import { ScheduleSelectorProps } from "@/types/types";
import moment from "moment";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
  
  const ScheduleSelector: React.FC<ScheduleSelectorProps> = ({
    selectedActivity,
    selectedDates,
    selectedHorario,
    setSelectedHorario,
    getTurnosByActivity,
  }) => {
    const fechaSeleccionada = selectedDates[selectedDates.length - 1];
  
    const horarios = getTurnosByActivity(selectedActivity.nombre)
      .filter((turno) =>
        moment(turno.datetime).format("YYYY-MM-DD") === fechaSeleccionada
      );
  
    return (
      <View style={styles.scheduleBox}>
        <Text style={styles.scheduleTitle}>HORARIOS</Text>
        {horarios.map((turno) => {
          const hora = moment(turno.datetime).format("HH:mm");
          const isSelected = selectedHorario === hora;
          return (
            <TouchableOpacity
              key={turno.id}
              onPress={() => setSelectedHorario(hora)}
              style={[
                styles.scheduleItemContainer,
                isSelected && styles.scheduleItemSelected
              ]}
            >
              <Text style={[
                styles.scheduleItemText,
                isSelected && styles.scheduleItemTextSelected
              ]}>
                {hora} (Cupo: {turno.capacity - turno.enrolled})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  export default ScheduleSelector

  const styles = StyleSheet.create({
    scheduleBox: {
        marginTop: 10,
        padding: 10,
        borderRadius: 10,
        borderColor: "#000"
      },
  scheduleTitle: {
    color: "black",
    textAlign: "center",
    marginBottom: 5,
    fontWeight: "bold",
  },
  scheduleItemContainer: {
    backgroundColor: "#FF9833",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginVertical: 4,
  },
  scheduleItemSelected: {
    backgroundColor: "#FCCB0D",
    borderWidth: 2,
    borderColor: "#000",
  },
  scheduleItemText: {
    color: "#000",
    fontWeight: "bold",
    textAlign: "center",
  },
  scheduleItemTextSelected: {
    color: "#000",
    textDecorationLine: "underline",
  },
})