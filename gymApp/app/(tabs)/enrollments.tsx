import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-big-calendar';
import Api from '@/services/Api';
import { Registration } from '@/types/types';
import colors from '@/theme/colors';


interface Event {
  title: string;
  start: Date;
  end: Date;
}

export default function Enrollments() {
  const [events, setEvents] = useState<Event[]>([]);
  const member_id = 1;

  useEffect(() => {
    Api.getRegistrations(member_id)
      .then((response) => {
        const formattedEvents: Event[] = response.data.map((item: Registration) => {
          const start = new Date(item.startTime);
          start.setHours(start.getHours() + 3);
          const end = new Date(start.getTime() + 60 * 60 * 1000); // Suponemos duracion de 1 hora
          return {
            title: item.activityName,
            start,
            end,
          };
        });
        setEvents(formattedEvents);
      })
      .catch((error) => {
        console.error('Error al obtener inscripciones:', error);
      });
  }, []);

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
        eventCellTextColor= {colors.black}
        theme={{
          palette: {
            primary: {
              main: colors.primary,
              contrastText: colors.black,
            },
            gray: {
              '100': '#ffffff', //celdas
              '200': '#f7f7f7', // días de la semana
              '300': '#eaeaea', // líneas divisorias
              '500': '#cccccc',
              '800': '#999999', // texto en cabecera y horas
          },
            nowIndicator: '#FF0000',
            moreLabel: colors.black,
          },
        }}
      />
      </View>
    </View>
  );
}

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
    color: colors.primary,
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
});