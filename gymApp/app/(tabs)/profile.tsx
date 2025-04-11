import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Routes } from '../constants/routes';
import colors from '@/theme/colors';
import Api from '@/services/Api';
import { useEffect, useState } from 'react';

export default function Profile() {
  const router = useRouter();
  const member_id = 1

  const [memberName, setMemberName] = useState<string | null>(null);

  useEffect(() => {
    const fetchName = async () => {
      try {
        const response = await Api.getMember(member_id);
        setMemberName(response.data.name);
      } catch (error) {
        console.error("Error al obtener el nombre del miembro:", error);
      }
    };

    fetchName();
  }, []);


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

      <TouchableOpacity style={styles.button} onPress={() => router.push(Routes.Enrollments)}>
        <Text style={styles.buttonText}>Mis inscripciones</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.disabledButton} disabled>
        <Text style={styles.disabledText}>Editar perfil (próximamente)</Text>
      </TouchableOpacity>
    </View>
  );
}

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
    color: colors.white,
    fontWeight: '600',
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 20,
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
});


