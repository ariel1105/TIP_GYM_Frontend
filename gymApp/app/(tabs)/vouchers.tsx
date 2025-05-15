import ActivityCard from "@/components/ActivityCard";
import Api from "@/services/Api";
import { Activity, AppColors } from "@/types/types";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Alert, Switch, TouchableOpacity } from "react-native";
import getLocalImage from "../utils/getImages";
import useColors from "@/theme/useColors";
import VoucherCounter from "@/components/VoucherCounter";

export default function VouchersScreen () {

    const [activities, setActivities] = useState<Activity[]>([]);
    const [selectedVouchers, setSelectedVouchers] = useState<{ [key: number]: number }>({});
    const colors : AppColors = useColors()

    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await Api.getActivities()
                const ActivityesConImagen: Activity[] = response.data.map((Activity: any) => ({
                    id: Activity.id,
                    nombre: Activity.name,
                    descripcion: Activity.description,
                    imagen: getLocalImage(Activity.name),
                }));
                
                setActivities(ActivityesConImagen);
            } catch (error: any){
                Alert.alert("Error al obtener actividades", JSON.stringify(error.message));
            }
        }
        fetchActivities()
    }, []);

    const handleVoucherChange = (id: number, amount: number) => {
        setSelectedVouchers((prev) => ({
        ...prev,
        [id]: Math.max((prev[id] || 0) + amount, 0),
        }));
    };

    const handleConfirm = () => {
        const vouchersArray = Object.entries(selectedVouchers)
            .filter(([_, amount]) => amount > 0) // Filtrar los que tienen al menos 1 voucher seleccionado
            .map(([activityId, amount]) => ({
                activityId: parseInt(activityId),
                amount,
            }));

        console.log("Vouchers seleccionados:", vouchersArray);
    };

    const styles = StyleSheet.create({
        containerList: {
            padding: 10,
            backgroundColor: colors.background,
            flex: 1,
            justifyContent: "center",
            alignItems:"center"
        },
        title: {
            marginTop: 10,
            fontSize: 20,
            marginBottom: 20,
            color: colors.text,
            textAlign: "center",
            alignSelf: "center",
        },
        listContent: {
            paddingBottom: 20,
        },
        footer: {
            width: "120%",
            padding: 16,
            backgroundColor: colors.primary,
            justifyContent: "center",
            alignItems: "center",
            position: "absolute",
            bottom: 0,
        },
        confirmButtonText: {
            color: colors.onPrimary,
            fontSize: 18,
            fontWeight: "bold",
        },
    });

    return (
        <View style={styles.containerList}>
            <Text style={styles.title}>Sumá todos los vouchers que quieras adquirir</Text>
            <FlatList
                data={activities}
                keyExtractor={(item) => item.nombre}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                        <ActivityCard item={item} onPress={() => {}} width={250} />
                        <VoucherCounter 
                            count={selectedVouchers[item.id] || 0} 
                            onIncrease={() => handleVoucherChange(item.id, 1)} 
                            onDecrease={() => handleVoucherChange(item.id, -1)} 
                        />
                    </View>
                )}
            />
            <View style={styles.footer}>
                <TouchableOpacity onPress={handleConfirm}>
                    <Text style={styles.confirmButtonText}>Confirmar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}