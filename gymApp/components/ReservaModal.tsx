
import React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet} from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import ScheduleSelector from "./ScheduleSelector";
import CheckboxDias from "./CheckboxDias";
import { ReservaModalProps } from "@/app/types/types";
  
const ReservaModal: React.FC<ReservaModalProps> = ({
  visible,
  onClose,
  selectedActivity,
  selectedDates,
  selectedHorario,
  setSelectedHorario,
  handleDateChange,
  getCustomDatesStyles,
  diasSemana,
  diasHabilitados,
  fijados,
  toggleDia,
  handleConfirmPress,
  getTurnosByActivity,
}) => (
  <Modal visible={visible} animationType="slide">
    <View style={styles.modalContainer}>
      <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
        <Text style={styles.closeIconText}>✕</Text>
      </TouchableOpacity>
      <Text style={styles.modalTitle}>Reserva tu Activity</Text>
      <Text style={styles.modalTitle}>{selectedActivity?.nombre}</Text>

      <CalendarPicker
        minDate={new Date()}
        key={selectedDates.join(",")}
        onDateChange={handleDateChange}
        customDatesStyles={getCustomDatesStyles()}
        todayBackgroundColor="#EED096"
        selectedDayColor="#FFC90E"
        selectedDayTextColor="#000"
      />

      {selectedActivity && selectedDates.length > 0 && (
        <ScheduleSelector
          selectedActivity={selectedActivity}
          selectedDates={selectedDates}
          selectedHorario={selectedHorario}
          setSelectedHorario={setSelectedHorario}
          getTurnosByActivity={getTurnosByActivity}
        />
      )}

      <Text style={styles.checkboxTitle}>Fijar días</Text>
      <CheckboxDias
        diasSemana={diasSemana}
        diasHabilitados={diasHabilitados}
        fijados={fijados}
        toggleDia={toggleDia}
      />

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirmPress}
      >
        <Text style={styles.confirmButtonText}>Confirmar</Text>
      </TouchableOpacity>
    </View>
  </Modal>
);

export default ReservaModal
  
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "#D3D3D3",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  closeIcon: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
    borderRadius: 20,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  closeIconText: {
    color: "#000",
    fontSize: 22,
    fontWeight: "bold",
  },
  checkboxTitle: {
    color: "black",
    textAlign: "center",
    marginTop: 5,
    marginBottom: 5,
    fontWeight: "bold",
  },
  checkboxButton: {
    padding: 10,
    backgroundColor: "black",
    borderRadius: 6,
  },
  confirmButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold"
  },
})