import ActivityCard from "@/components/ActivityCard";
import Api from "@/services/Api";
import { Activity, AppColors, Voucher } from "@/types/types";
import { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Alert, Switch, TouchableOpacity } from "react-native";
import getLocalImage from "../utils/getImages";
import useColors from "@/theme/useColors";
import VoucherCounter from "@/components/VoucherCounter";
import { useAuth } from "@/context/AuthContext";
import AlertModal from "@/components/AlertModal";
import { router, useFocusEffect } from "expo-router";
import { Routes } from "../constants/routes";


export default function VouchersScreen () {

    const [activities, setActivities] = useState<Activity[]>([]);
    const [selectedVouchers, setSelectedVouchers] = useState<{ [key: number]: number }>({});
    const [loginModalVisible, setLoginModalVisible] = useState(false);
    const [acquirementSuccessModalVisible, setAcquirementSuccessModalVisible] = useState(false);
    
    const colors : AppColors = useColors()
    const { member, setMember, token } = useAuth();

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

    useFocusEffect(
        useCallback(() => {
            return () => {
            setSelectedVouchers({});
            };
        }, [])
    );

    const handleVoucherChange = (id: number, amount: number) => {
        setSelectedVouchers((prev) => ({
        ...prev,
        [id]: Math.max((prev[id] || 0) + amount, 0),
        }));
    };

    const handleConfirm = async () => {
        if (!member || !token) {
            setLoginModalVisible(true);
            return;
        }
        const vouchersArray: Voucher[] = Object.entries(selectedVouchers)
            .filter(([_, amount]) => amount > 0)
            .map(([activityId, amount]) => ({
                activityId: parseInt(activityId),
                remainingClasses: amount,
                amount,
            }));

        try {
            await Api.acquire(vouchersArray, token!!);
            const updatedVouchers = [...(member.vouchers || []), ...vouchersArray];
            setMember({ ...member, vouchers: updatedVouchers });
            setAcquirementSuccessModalVisible(true)
        } catch (error: any) {
            Alert.alert("Error al adquirir vouchers", error.message || "Ocurrió un error inesperado.");
        }
    };

    const goToLogin = () => {
        setLoginModalVisible(false)
        router.push(Routes.Login)
    }

    const closeLoginModal = () => {
        setLoginModalVisible(false)
    }

    const goToVouchers = () => {
        setAcquirementSuccessModalVisible(false)
        router.push(Routes.MyVouchers)
    }

    const closeAcquirementSuccessModal = () => {
        setAcquirementSuccessModalVisible(false)
    }


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

            <AlertModal
                visible={acquirementSuccessModalVisible}
                onClose={closeAcquirementSuccessModal}
                closeButton="Cerrar"
                title={"¡Listo!"}
                mensaje="¡Ya tenés tus vouchers!"
                actionButton="Ver vouchers"
                action={goToVouchers}
            />
            
            <AlertModal
                visible={loginModalVisible}
                onClose={closeLoginModal}
                closeButton="Cerrar"
                title={"¡Atencion!"}
                mensaje="Para esta acción necesitás estar logueado."
                actionButton="Loguearme"
                action={goToLogin}
            />
        </View>
    );
}