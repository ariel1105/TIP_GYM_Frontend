import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import CalendarPicker from "react-native-calendar-picker";

type DiaSemana = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

interface Turno {
  dia: DiaSemana;
  hora: string;
  cupoMaximo: number;
}

interface Actividad {
  nombre: string;
  descripcion: string;
  turnos: Turno[];
}

const activities: Actividad[] = [
  {
    nombre: "Crossfit",
    descripcion: "Entrenamiento funcional de alta intensidad.",
    turnos: [
      { dia: "Monday", hora: "07:00 - 08:00", cupoMaximo: 20 },
      { dia: "Wednesday", hora: "18:00 - 19:00", cupoMaximo: 15 },
    ],
  },
  {
    nombre: "Funcional",
    descripcion: "Ejercicios funcionales para todo el cuerpo.",
    turnos: [
      { dia: "Tuesday", hora: "09:00 - 10:00", cupoMaximo: 10 },
      { dia: "Thursday", hora: "17:00 - 18:00", cupoMaximo: 12 },
    ],
  },
  {
    nombre: "Yoga",
    descripcion: "Yoga para estiramientos y relajacion",
    turnos: [
      { dia: "Friday", hora: "09:00 - 10:00", cupoMaximo: 10 },
      { dia: "Saturday", hora: "10:00 - 11:00", cupoMaximo: 10 },
    ],
  },
  {
    nombre: "Zumba",
    descripcion: "Ejercicio aerobico mezclado con danza",
    turnos: [
      { dia: "Tuesday", hora: "18:00 - 19:00", cupoMaximo: 20 },
      { dia: "Thursday", hora: "18:00 - 19:00", cupoMaximo: 20 },
    ],
  },
];

export default function ActivitiesScreen() {
  const [selectedActivity, setSelectedActivity] = useState<Actividad | null>(null);
  const [selectedDate, setSelectedDate] = useState<DiaSemana | "">("");
  const [modalVisible, setModalVisible] = useState(false);

  const handleActivitySelect = (activity: Actividad) => {
    setSelectedActivity(activity);
    setModalVisible(true);
  };

  // Convertir la fecha seleccionada en un día de la semana
  const handleDateChange = (date: Date) => {
    const dayMapping: { [key: string]: DiaSemana } = {
      Sun: "Sunday",
      Mon: "Monday",
      Tue: "Tuesday",
      Wed: "Wednesday",
      Thu: "Thursday",
      Fri: "Friday",
      Sat: "Saturday",
    };
    const dayCode = date.toString().split(" ")[0];
    setSelectedDate(dayMapping[dayCode] || "");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona una actividad</Text>
      <View style={styles.activitiesContainer}>
        {activities.map((activity) => (
          <TouchableOpacity
            key={activity.nombre}
            style={styles.activityButton}
            onPress={() => handleActivitySelect(activity)}
          >
            <Text style={styles.buttonText}>{activity.nombre}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>{selectedActivity?.nombre}</Text>
          <Text>{selectedActivity?.descripcion}</Text>
          <CalendarPicker onDateChange={handleDateChange} />

          {selectedActivity && selectedDate && (
            <View>
              {selectedActivity.turnos
                .filter((turno) => turno.dia === selectedDate)
                .map((turno, index) => (
                  <Text key={index}>{turno.hora} (Cupo: {turno.cupoMaximo})</Text>
                ))}
            </View>
          )}

          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.buttonText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { 
    padding: 20, 
    backgroundColor: "#000000",
    flex: 1,
    justifyContent: "center", 
    alignItems: "center"
  },
  title: { 
    fontSize: 28, 
    fontWeight: "700", 
    marginBottom: 20,
    color: "#D3D3D3",
    textAlign: "center"
  },
  activitiesContainer: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    justifyContent: "center", 
    gap: 15 
  },
  activityButton: { 
    backgroundColor: "#6A0DAD",
    paddingVertical: 15, 
    paddingHorizontal: 30, 
    borderRadius: 10, 
    minWidth: "45%",
    alignItems: "center"
  },
  buttonText: { 
    color: "#ffffff",
    textAlign: "center", 
    fontSize: 18, 
    fontWeight: "600"
  },
  modalContainer: { 
    flex: 1, 
    padding: 20, 
    justifyContent: "center", 
    alignItems: "center",
    backgroundColor: "#D3D3D3"
  },
  modalTitle: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 10, 
    color: "#D3D3D3"
  },
  closeButton: { 
    marginTop: 20, 
    backgroundColor: "#6A0DAD",
    padding: 12, 
    borderRadius: 8 
  }
});
