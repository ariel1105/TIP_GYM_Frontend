import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-big-calendar';
import moment from 'moment';
import useColors from '@/theme/useColors';
import { useAuth } from '@/context/AuthContext';
import { Event } from '@/types/types';

interface MachineAccessLog {
  id: number;
  memberId: number;
  accessTime: string;
}

export default function MachineAccesses() {
  const [events, setEvents] = useState<Event[]>([]);
  const { token } = useAuth();
  const colors = useColors();
  const [monthDate, setMonthDate] = useState(moment().startOf('month'));

  useEffect(() => {
    fetchMachineAccesses();
  }, [monthDate]);

  const fetchMachineAccesses = async () => {
    try {
      // Accesos simulados para memberId 22 en el mes actual
      const simulatedLogs: MachineAccessLog[] = [
        {
          id: 1,
          memberId: 22,
          accessTime: moment(monthDate).date(3).hour(9).minute(0).toISOString(),
        },
        {
          id: 2,
          memberId: 22,
          accessTime: moment(monthDate).date(6).hour(18).minute(0).toISOString(),
        },
        {
          id: 3,
          memberId: 22,
          accessTime: moment(monthDate).date(11).hour(12).minute(0).toISOString(),
        },
        {
          id: 4,
          memberId: 22,
          accessTime: moment(monthDate).date(21).hour(7).minute(30).toISOString(),
        },
      ];

      const mappedEvents: Event[] = simulatedLogs.map((log) => {
        const start = new Date(log.accessTime);
        start.setHours(start.getHours() + 3); // Ajuste zona horaria
        const end = new Date(start.getTime() + 10 * 60 * 1000);
        return {
          id: log.id,
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
      />
    </View>
  );
}


//   const fetchMachineAccesses = async () => {
//     try {
//       const response = await Api.getMachineAccessLogs(token!);
//       const logs: MachineAccessLog[] = response.data;

//       const mappedEvents: Event[] = logs.map((log) => {
//         const start = new Date(log.accessTime);
//         start.setHours(start.getHours() + 3); // si hay que ajustar huso horario
//         const end = new Date(start.getTime() + 10 * 60 * 1000); // evento de 10 minutos

//         return {
//           id: log.id,
//           title: 'Ingreso a máquinas',
//           start,
//           end,
//         };
//       });

//       setEvents(mappedEvents);
//     } catch (error: any) {
//       Alert.alert("Error al obtener accesos", JSON.stringify(error.message));
//     }
//   };