import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import useColors from '@/theme/useColors';
import moment from 'moment';

export default function MyBodyBuildingPlan() {
    const { member } = useAuth();
    const colors = useColors();

    const { bodyBuildingSubscription } = member || {};

    const styles = StyleSheet.create({
        container: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 60,
        paddingHorizontal: 20,
        },
        title: {
        fontSize: 26,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 30,
        textAlign: 'center',
        },
        detailBox: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        padding: 20,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4,
        },
        detailText: {
        fontSize: 18,
        marginBottom: 12,
        color: colors.black,
        fontWeight: '500',
        },
        emptyText: {
        fontSize: 18,
        color: colors.textMuted,
        fontStyle: 'italic',
        textAlign: 'center',
        marginTop: 40,
        },
    });

    if (!bodyBuildingSubscription) {
        return (
        <View style={styles.container}>
            <Text style={styles.title}>Mi plan de musculación</Text>
            <Text style={styles.emptyText}>Aún no tenés un plan de musculación activo.</Text>
        </View>
        );
    }

    const { acquisitionDate, dueDate, daysPerWeek } = bodyBuildingSubscription;

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Mi plan de musculación</Text>

        <View style={styles.detailBox}>
            <Text style={styles.detailText}>
                Fecha de inicio: {moment(acquisitionDate).format('DD/MM/YYYY')}
            </Text>
            <Text style={styles.detailText}>
                Válido hasta: {moment(dueDate).format('DD/MM/YYYY')}
            </Text>
            <Text style={styles.detailText}>
                Frecuencia semanal: {daysPerWeek === 7 ? 'Libre' : `${daysPerWeek} días/semana`}
            </Text>
        </View>
        </View>
    );
}
