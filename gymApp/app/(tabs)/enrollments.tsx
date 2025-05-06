import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-big-calendar';
import Api from '@/services/Api';
import { Registration } from '@/types/types';
import {darkColors} from '@/theme/colors';
import useColors from '@/theme/useColors';
import { useAuth } from '@/context/AuthContext';
import { Event } from '@/types/types';

export default function Enrollments() {
  const [events, setEvents] = useState<Event[]>([])

  const colors = useColors()

  const { member, token } = useAuth();

  useEffect(() => {
    if (!member) return;

    Api.getRegistrations(token!)
      .then((response: any) => {
        const formattedEvents: Event[] = response.data.map((item: Registration) => {
          const start = new Date(item.startTime);
          start.setHours(start.getHours() + 3);
          const end = new Date(start.getTime() + 60 * 60 * 1000); // Suponemos duracion de una hora
          return {
            title: item.activityName,
            start,
            end,
          };
        });
        setEvents(formattedEvents);
      })
      .catch((error: any) => {
        console.error('Error al obtener inscripciones:', error);
      });
  }, [member]);

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
        />
      </View>
    </View>
  );
}