import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-big-calendar';
import moment from 'moment';
import useColors from '@/theme/useColors';
import { useAuth } from '@/context/AuthContext';
import { Event } from '@/types/types';
import Api from '@/services/Api';
import { useFocusEffect } from 'expo-router';
import AlertModal from '@/components/AlertModal';

export default function BodyBuildingEntry() {
  const [events, setEvents] = useState<Event[]>([]);
  const { token } = useAuth();
  const colors = useColors();
  const [monthDate, setMonthDate] = useState(moment().startOf('month'));
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);


  useFocusEffect(
    useCallback(() => {
      fetchBodyBuildingEntry();
    }, [monthDate])
  );

  const fetchBodyBuildingEntry = async () => {
    try {
      const response = await Api.getBodyBuildingEntries(monthDate.month() + 1, token!);
      const records: string[] = response.data;

      const mappedEvents: Event[] = records.map((accessTime, index) => {
        const start = new Date(accessTime);
        start.setHours(start.getHours() + 3);

        const end = new Date(start.getTime() + 10 * 60 * 1000); 
        return {
          id: index,
          title: "Ingreso a máquinas",
          start,
          end,
        };
      });

      setEvents(mappedEvents);
    } catch (error: any) {
      Alert.alert("Error al obtener accesos", JSON.stringify(error.message));
    }
  };


  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 10,
    },
    title: {
      color: colors.text,
      fontSize: 24,
      marginBottom: 10,
      textAlign: 'center',
    },
    header: {
      marginBottom: 10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    button: {
      paddingHorizontal: 15,
      paddingVertical: 5,
      borderRadius: 5,
      backgroundColor: colors.primary,
    },
    buttonText: {
      fontWeight: 'bold',
      fontSize: 18,
      color: colors.black,
    },
    monthLabel: {
      color: colors.text,
      fontSize: 16,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mis Ingresos a Máquinas</Text>

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setMonthDate(prev => moment(prev).subtract(1, 'month'))}
        >
          <Text style={styles.buttonText}>←</Text>
        </TouchableOpacity>

        <Text style={styles.monthLabel}>{monthDate.format('MMMM YYYY')}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => setMonthDate(prev => moment(prev).add(1, 'month'))}
        >
          <Text style={styles.buttonText}>→</Text>
        </TouchableOpacity>
      </View>

      <Calendar
        mode="month"
        events={events}
        height={600}
        date={monthDate.toDate()}
        eventCellStyle={{
          backgroundColor: colors.primary,
          borderRadius: 4,
          padding: 2,
        }}
        eventCellTextColor={colors.black}
        locale="es-AR"
        theme={{
          palette: {
            primary: {
              main: colors.primary,
              contrastText: colors.black,
            },
            gray: {
              '200': colors.text,
              '500': colors.text,
              '800': colors.text,
            },
            nowIndicator: colors.nowLineIndicator,
            moreLabel: colors.black,
          },
        }}
        onPressEvent={(event) => {
          setSelectedEvent(event);
          setModalVisible(true);
        }}
      />
      <AlertModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        closeButton="Cerrar"
        title="Registro de ingreso"
        mensaje={
          selectedEvent
            ? `Fecha: ${moment(selectedEvent.start).format('DD/MM/YYYY')}\nHora: ${moment(selectedEvent.start).format('HH:mm')}`
            : ''
        }
      />

    </View>
  );
}
