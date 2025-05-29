import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-big-calendar';
import Api from '@/services/Api';
import { Registration, Voucher } from '@/types/types';
import useColors from '@/theme/useColors';
import { useAuth } from '@/context/AuthContext';
import { Event } from '@/types/types';
import AlertModal from '@/components/AlertModal';
import moment from 'moment';

export default function Enrollments() {
  const [events, setEvents] = useState<Event[]>([])
  const [modalVisible, setModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [weekStart, setWeekStart] = useState(moment().startOf("isoWeek"));
  const [voucherModalVisible, setVoucherModalVisible] = useState(false);
  const [voucherData, setVoucherData] = useState<Voucher | null>(null);

  const colors = useColors()
  const { member, setMember, token } = useAuth();

  useEffect(() => {
    if (!member) return;
    
    const fetchRegistrations = async () => {
      try {
        const response = await Api.getRegistrations(token!);
        const formattedEvents: Event[] = response.data.map((item: Registration) => {
          const start = new Date(item.startTime);
          start.setHours(start.getHours() + 3);
          const end = new Date(start.getTime() + 60 * 60 * 1000); // Duración de una hora
          return {
            id: item.turnId.toString(),
            title: item.activityName,
            start,
            end,
          };
        });
        setEvents(formattedEvents);
      } catch (error: any) {
        Alert.alert("Error al obtener inscripciones", JSON.stringify(error.message));
      }
    };
  
    fetchRegistrations();
  }, [member]);

  const handleEventPress = (event: Event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const handleCancelEnrollment = async () => {
    if (selectedEvent && selectedEvent.id) {
      try {
        const response = await Api.unsubscribe(selectedEvent.id, token!!);
        const updatedTurns = member!!.turns.filter(
          (item: number) => item != selectedEvent.id
        );
        await setMember({ ...member, turns: updatedTurns });
        setVoucherData(response.data);
        setVoucherModalVisible(true);
        setModalVisible(false);
      } catch (error) {
        setModalVisible(false)
        setSelectedEvent(null);
        setErrorModalVisible(true);
      }
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleCloseErrorModal = () => {
    setErrorModalVisible(false)
  };
  

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 10,
    },
    header: {
      marginBottom: 10,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    calendarContainer: {
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: 5,
    },
    title: {
      color: colors.text,
      fontSize: 24,
      marginBottom: 10,
      textAlign: 'center',
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
      <Text style={styles.title}>Mis Inscripciones</Text>
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
        swipeEnabled={false}
        showTime={false}
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
              '200': colors.text, // líneas divisorias
              '500': colors.text,    // texto cabecera / horas
              '800': colors.text, // números del día
            },
            nowIndicator: colors.nowLineIndicator,
            moreLabel: colors.black,
          },
        }}
        onPressEvent={handleEventPress}
      />
      <AlertModal
        visible={modalVisible}
        onClose={handleCloseModal}
        closeButton='Cerrar'
        title="Tu Turno"
        mensaje={`Actividad: ${selectedEvent?.title}\nFecha: ${moment(selectedEvent?.start).format('DD/MM/YYYY HH:mm')}`}
        action={handleCancelEnrollment}
        actionButton="Cancelar turno"
      />

      <AlertModal
        visible={voucherModalVisible}
        onClose={() => setVoucherModalVisible(false)}
        closeButton="Cerrar"
        title="Voucher generado"
        mensaje={
          voucherData
            ? `Actividad: ${voucherData.activityName}\n` +
              `Clases restantes: ${voucherData.remainingClasses}\n` +
              `Fecha de adquisición: ${moment(voucherData.acquisitionDate).format('DD/MM/YYYY')}`
            : ''
        }
      />

      <AlertModal
        visible={errorModalVisible}
        onClose={handleCloseErrorModal}
        closeButton='Cerrar'
        title="Error"
        mensaje="Ya pasó el tiempo límite para la cancelación del turno."
      />

    </View>
  );
}