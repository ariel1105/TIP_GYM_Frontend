import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Calendar } from 'react-native-big-calendar';
import Api from '@/services/Api';
import { Registration } from '@/types/types';
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
        setMember({ ...member, registrations: response.data });
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
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Inscripciones</Text>
      <View style={styles.calendarContainer}>
        <Calendar
          events={events}
          height={600}
          mode="week"
          locale="es-AR"
          weekStartsOn={1}
          swipeEnabled={true}
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
              nowIndicator: '#FF0000',
              moreLabel: colors.black,
            },
          }}
          onPressEvent={handleEventPress}
        />
      </View>
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
        visible={errorModalVisible}
        onClose={handleCloseErrorModal}
        closeButton='Cerrar'
        title="Error"
        mensaje="Ya pasó el tiempo límite para la cancelación del turno."
      />

    </View>
  );
}