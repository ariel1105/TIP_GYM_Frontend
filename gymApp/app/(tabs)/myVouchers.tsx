import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import useColors from '@/theme/useColors';
import { useAuth } from '@/context/AuthContext';
import Api from '@/services/Api';
import { Voucher } from '@/types/types';
import AlertModal from '@/components/AlertModal';
import ReservationModal from '@/components/ReservationModal';
import { router } from 'expo-router';
import { Routes } from '../constants/routes';

export default function MyVouchers() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  const colors = useColors();
  const { member, token } = useAuth();

   useEffect(() => {
    if (!member) return;

    const fetchVouchers = async () => {
      try {
        const response = await Api.getVouchers(token!);
        setVouchers(response.data);
      } catch (error: any) {
        Alert.alert('Error al obtener vouchers', JSON.stringify(error.message));
      }
    };
    fetchVouchers();
  }, [member]);

  const handleVoucherPress = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
    setAlertVisible(true);
  };

  const handleConfirmUseVoucher = () => {
    setAlertVisible(false);
    router.push({ pathname: Routes.Activities, params: { activityId: selectedVoucher?.activityId } });

  };

  const formatDate = (date?: string | Date) => {
    if (!date) return '';
    const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
    const [year, month, day] = dateStr.split('-');
    return `${day} de ${getSpanishMonth(Number(month))} de ${year}`;
  };


  const getSpanishMonth = (month: number) => {
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return months[month - 1];
  };


  const groupedVouchers = useMemo(() => {
    const groups: Record<string, Voucher & { totalClasses: number }> = {};

    vouchers.forEach(v => {
      const key = `${v.activityId}-${v.acquisitionWay}-${v.acquisitionDate}`;
      if (!groups[key]) {
        groups[key] = {
          ...v,
          totalClasses: v.remainingClasses ?? 0,
          remainingClasses: v.remainingClasses ?? 0, 
        };
      } else {
        groups[key].totalClasses += v.remainingClasses ?? 0;
        groups[key].remainingClasses = groups[key].totalClasses;
      }
    });

  return Object.values(groups);
}, [vouchers]);


  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      padding: 16,
      alignItems: 'center',
      paddingBottom: 40,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 20,
    },
    ticketWrapper: {
      width: '90%',
      marginBottom: 20,
      alignItems: 'center',
    },
    ticket: {
      backgroundColor: colors.cardBackground,
      borderRadius: 20,
      width: '100%',
      paddingVertical: 20,
      paddingHorizontal: 16,
      shadowColor: colors.black,
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 4,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    activity: {
      fontSize: 20,
      fontWeight: 'bold',
      backgroundColor: colors.primary,
      color: colors.black,
      padding: 4,
      borderRadius: 4,
    },
    reason: {
      fontSize: 16,
      color: colors.black,
      marginTop: 4,
    },
    remaining: {
      fontSize: 14,
      color: colors.black,
    },
    voucherDate: {
      fontSize: 14,
      color: colors.black,
      marginBottom: 8,
    },
    dashedLineContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 10,
    },
    dashedCircle: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.background,
    },
    dashedLine: {
      flex: 1,
      borderStyle: 'dashed',
      borderWidth: 1,
      borderColor: colors.grayDark,
      marginHorizontal: 8,
    },
  });

  return (
     <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Mis Vouchers</Text>

        {groupedVouchers.length === 0 ? (
          <Text style={{ color: colors.text, fontSize: 16, marginTop: 20 }}>
            Aún no tienes ningún voucher adquirido.
          </Text>
        ) : (
          groupedVouchers.map((voucher, index) => (
            <TouchableOpacity
              key={index}
              style={styles.ticketWrapper}
              onPress={() => handleVoucherPress(voucher)}
            >
              <View style={styles.ticket}>
                <Text style={styles.voucherDate}>
                  Adquirido: {formatDate(voucher.acquisitionDate) || 'No disponible'}
                </Text>
                <Text style={styles.activity}>{voucher.activityName}</Text>
                <Text style={styles.reason}>
                  Motivo: {voucher.acquisitionWay || 'Desconocido'}
                </Text>
                <View style={styles.dashedLineContainer}>
                  <View style={styles.dashedCircle} />
                  <View style={styles.dashedLine} />
                  <View style={styles.dashedCircle} />
                </View>
                <View style={styles.row}>
                  <Text style={styles.remaining}>
                    Clases restantes: {voucher.remainingClasses}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <AlertModal
        visible={alertVisible}
        title="¿Quieres usar este voucher?"
        mensaje={`Actividad: ${selectedVoucher?.activityName}\nFecha: ${formatDate(selectedVoucher?.acquisitionDate)}`}
        onClose={() => setAlertVisible(false)}
        closeButton="Cancelar"
        action={handleConfirmUseVoucher}
        actionButton="Confirmar"
      />

    </View>
  );
}
