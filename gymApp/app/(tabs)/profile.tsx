import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Routes } from '../constants/routes';
import { useAuth } from '@/context/AuthContext';
import useColors from '@/theme/useColors';
import { useEffect, useState } from 'react';
import AlertModal from '@/components/AlertModal';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

export default function Profile() {
  const router = useRouter();
  const colors = useColors();
  const { member } = useAuth();
  const { logout } = useAuth();

  const memberName = member?.name;

  const [showLoginModal, setShowLoginModal] = useState(false);
  
  useEffect(() => {
    if (!member) {
      setShowLoginModal(true);
    }
  }, [member]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingTop: 60,
    },
    avatarContainer: {
      alignItems: 'center',
      marginBottom: 40,
    },
    avatar: {
      backgroundColor: colors.avatarBackground,
      width: 100,
      height: 100,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarInitial: {
      fontSize: 36,
      color: colors.primary,
      fontWeight: 'bold',
    },
    userName: {
      fontSize: 20,
      marginTop: 10,
      color: colors.text,
      fontWeight: '600',
    },
    button: {
      backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      marginBottom: 20,
      marginTop: 20
    },
    buttonText: {
      color: colors.black,
      fontWeight: 'bold',
      fontSize: 16,
    },
    disabledButton: {
      backgroundColor: colors.grayDark,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
    },
    disabledText: {
      color: colors.textMuted,
      fontSize: 14,
      fontStyle: 'italic',
    },
    grid: {
      gap: 20,
      width: "100%",
      alignItems: "center",
    },

    row: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 20,
    },

    gridItem: {
      width: 140,
      height: 120,
      backgroundColor: colors.primary,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
    },

    icon: {
      fontSize: 32,
      marginBottom: 6,
    },

    gridText: {
      fontSize: 14,
      fontWeight: "bold",
      color: colors.black,
      textAlign: "center",
    },

    logoutButton: {
      marginTop: 30,
      backgroundColor: colors.primary,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
    },

  });

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarInitial}>
            {memberName ? memberName[0] : "?"}
          </Text>
        </View>
        <Text style={styles.userName}>{memberName || "Cargando..."}</Text>
      </View>

      <View style={styles.grid}>
        <View style={styles.row}>
          <TouchableOpacity style={styles.gridItem} onPress={() => router.push(Routes.Enrollments)}>
            <FontAwesome5Icon name="calendar-week" size={30} color={colors.black} style={styles.icon} />
            <Text style={styles.gridText}>Inscripciones a actividades</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => router.push(Routes.MyVouchers)}>
            <FontAwesome5Icon name="ticket-alt" size={30} color={colors.black} style={styles.icon} />
            <Text style={styles.gridText}>Vouchers</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={styles.gridItem} onPress={() => router.push(Routes.MyBodyBuildingPlan)}>
            <FontAwesome5Icon name="dumbbell" size={30} color={colors.black} style={styles.icon} />
            <Text style={styles.gridText}>Plan musculación</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.gridItem} onPress={() => router.push(Routes.MyBodyBuildingEntry)}>
            <FontAwesome5Icon name="calendar" size={30} color={colors.black} style={styles.icon} />
            <Text style={styles.gridText}>Mis ingresos a musculación</Text>
          </TouchableOpacity>
        </View>
      </View>


      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.buttonText}>Cerrar sesión</Text>
      </TouchableOpacity>


      <AlertModal
        visible={showLoginModal}
        onClose={() => router.replace('/login')}
        closeButton='Ir a login'
        title="No estás logueado"
        mensaje="Por favor, iniciá sesión para continuar."
      />
    </View>
  );
}
