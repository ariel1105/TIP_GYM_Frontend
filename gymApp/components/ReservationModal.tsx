
import React from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet} from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import ScheduleSelector from "./ScheduleSelector";
import CheckboxDias from "./CheckboxDias";
import { ReservationModalProps } from "@/types/types";
import colors from "@/theme/colors";
  
const ReservationModal: React.FC<ReservationModalProps> = ({
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
      <Text style={styles.modalTitle}>Reserva tu Actividad</Text>
      <Text style={styles.modalTitle}>{selectedActivity?.nombre}</Text>

      <CalendarPicker
        minDate={new Date()}
        key={selectedDates.join(",")}
        onDateChange={handleDateChange}
        customDatesStyles={getCustomDatesStyles()}
        textStyle={{ color: colors.text }}
        todayBackgroundColor={'#FFFE91'}
        selectedDayColor={colors.primary}
        selectedDayTextColor={colors.onPrimary}
        dayShape="circle"
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
        style={[
          styles.confirmButton,
          !selectedHorario && styles.confirmButtonDisabled
        ]}
        onPress={handleConfirmPress}
        disabled={!selectedHorario}
      >
        <Text style={[styles.confirmButtonText,
                    !selectedHorario && styles.confirmTextDisabled]
        }>Confirmar</Text>
      </TouchableOpacity>
    </View>
  </Modal>
);

export default ReservationModal

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.text,
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
    backgroundColor: colors.surface,
  },
  closeIconText: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "bold",
  },
  checkboxTitle: {
    color: colors.text,
    textAlign: "center",
    marginTop: 5,
    marginBottom: 5,
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  confirmButtonText: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: "bold",
  },
  confirmButtonDisabled: {
    backgroundColor: colors.disabledGray,
    borderColor: colors.grayMedium,
    borderWidth: 1,
  },
  
  confirmTextDisabled: {
    color: colors.disabledText,
  },
});

