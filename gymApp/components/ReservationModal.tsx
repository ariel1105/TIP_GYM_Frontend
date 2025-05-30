
import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet} from "react-native";
import CalendarPicker from "react-native-calendar-picker";
import ScheduleSelector from "./ScheduleSelector";
import CheckboxDias from "./CheckboxDias";
import { ReservationModalProps } from "@/types/types";
import useColors from "@/theme/useColors";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import Api from "@/services/Api";

  
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
  remainingVouchers,
  disabledDates
}) => {

  const colors= useColors()
  const {member, token, setMember} = useAuth()
  const router = useRouter();

  useEffect(() => {
    
  }, [token])

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      padding: 20,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: colors.background,
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 10,
      color: colors.text,
      textAlign: "center",
    },
    activityName: {
      fontSize: 20,
      fontWeight: "600",
      marginBottom: 20,
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
    },
    closeIconText: {
      fontSize: 22,
      fontWeight: "bold",
      color: colors.text,
    },
    checkboxTitle: {
      textAlign: "center",
      marginTop: 5,
      marginBottom: 5,
      fontWeight: "bold",
      color: colors.text,
    },
    confirmButton: {
      padding: 12,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 20,
      backgroundColor: colors.primary,
    },
    confirmButtonDisabled: {
      backgroundColor: colors.disabledGray,
      borderColor: colors.grayMedium,
      borderWidth: 1,
    },
    confirmButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.onPrimary,
    },
    confirmButtonTextDisabled: {
      color: colors.disabledText,
    },
  });

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
          <Text style={styles.closeIconText}>✕</Text>
        </TouchableOpacity>

        <Text style={styles.modalTitle}>Reserva tu Actividad</Text>
        <Text style={styles.activityName}>{selectedActivity?.nombre}</Text>

        <CalendarPicker
          minDate={new Date()}
          // key={selectedDates.join(",")}
          onDateChange={handleDateChange}
          customDatesStyles={getCustomDatesStyles()}
          textStyle={{ color: colors.text }}
          todayBackgroundColor={colors.today}
          selectedDayColor={colors.primary}
          selectedDayTextColor={colors.onPrimary}
          dayShape="circle"
          disabledDates={disabledDates}
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

        <View style={{ marginTop: 20, alignItems: "center" }}>
          <Text style={{ color: colors.text, fontWeight: "bold" }}>
            Vouchers disponibles: {remainingVouchers}
          </Text>

          <TouchableOpacity onPress={() => router.push("/vouchers")}>
            <Text style={{ color: colors.text, textDecorationLine: "underline", marginTop: 5 }}>
              Adquirir vouchers
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.confirmButton,
            !selectedHorario && styles.confirmButtonDisabled,
          ]}
          onPress={handleConfirmPress}
          disabled={!selectedHorario}
        >
          <Text
            style={[
              styles.confirmButtonText,
              !selectedHorario && styles.confirmButtonTextDisabled,
            ]}
          >
            Confirmar
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
  

export default ReservationModal


