import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Switch, TouchableOpacity } from "react-native";
import moment from "moment";
import { useEffect } from "react";
import Api from "../../services/Api";
import getLocalImage from "../utils/getImages";
import ActivityCard from "../../components/ActivityCard";
import ReservationModal from "../../components/ReservationModal";
import { Activity, DiaSemana, Suscriptions, Turn, AppColors } from "../../types/types";
import AlertModal from "../../components/AlertModal";
import useColors from "../../theme/useColors";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import WeeklyCalendarView from "../../components/WeeklyCalendarView";
import { Routes } from "../constants/routes";
import { useLocalSearchParams } from "expo-router";
import { useModal } from "../../hooks/useModal";

export default function ActivitiesScreen() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const [reservationModalVisible, setReservationModalVisible] = useState(false);
  const [fijados, setFijados] = useState<DiaSemana[]>([]);
  const [selectedHorario, setSelectedHorario] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [remainingVouchersActivity, setRemainingVouchersActivity] = useState(0)

  const [showWeeklyView, setShowWeeklyView] = useState(false);

  const { modalVisible, setModalVisible, modalProps, openModal } = useModal();

  const params = useLocalSearchParams();
  const activityIdFromParams = params.activityId as string | undefined;

  const colors : AppColors = useColors()

  const { token, member, setMember } = useAuth();

  const router = useRouter();

  const getTurnosByActivity = (activityName: string) => {
    return turns.filter(turn => turn.activityName === activityName);
  };
  
  const diasSemana: DiaSemana[] = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];

  const updateRemainingVouchers = () => {
    const activityVouchers = selectedActivity && member
                      ? member.vouchers.filter(v => v.activityId === selectedActivity.id)
                      : [];
    const remainingVoucher = activityVouchers.reduce(
                          (sum, voucher) => sum + voucher.remainingClasses!!
                          ,0);
    setRemainingVouchersActivity(remainingVoucher)
  }

  useEffect(()=> {
    updateRemainingVouchers()
  },[member, params])

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await Api.getActivities()
        const ActivityesConImagen: Activity[] = response.data.map((activity: Activity) => ({
          id: activity.id,
          name: activity.name,
          descripcion: activity.description,
          image: getLocalImage(activity.name),
        }));
        
        setActivities(ActivityesConImagen);
      } catch (error: any){
        openModal(
          "Error al obtener actividades",
          error.message,
          () => setModalVisible(false),
          "Entendido"
        );
      }
    }
    fetchActivities()
  }, []);

  useEffect(() => {
    if (activityIdFromParams && activities.length > 0) {
      const matchedActivity = activities.find(act => act.id.toString() === activityIdFromParams);
      if (matchedActivity) {
        handleActivitySelect(matchedActivity);
      }
    }
  }, [activityIdFromParams, activities]);


  const toggleDia = (dia: DiaSemana) => {
    const estaFijado = fijados.includes(dia);
    const nuevaLista = estaFijado
      ? fijados.filter(d => d !== dia)
      : [...fijados, dia];
    const turnosActivity = getTurnosByActivity(selectedActivity?.name || "");
    const nuevasFechas: string[] = turnosActivity
      .filter(turn => {
        const diaTurno = moment(turn.datetime).format("dddd") as DiaSemana;
        return diaTurno === dia;
      })
      .map(turn => moment(turn.datetime).format("YYYY-MM-DD"))
      .filter(dateStr => {
        if (!estaFijado && !selectedDates.includes(dateStr)) {
          return true;
        }
        if (estaFijado && selectedDates.includes(dateStr)) {
          return true;
        }
        return false;
      });
    setFijados(nuevaLista);
    setSelectedDates((prev) => {
      if (!estaFijado) {
        return [...prev, ...nuevasFechas];
      } else {
        return prev.filter(d => !nuevasFechas.includes(d));
      }
    });
  };

  const getActivityDays = () => {
    if (!selectedActivity) return [];
    const turnosActivity = getTurnosByActivity(selectedActivity.name);
    return turnosActivity.map(turno => {
      const fecha = moment(turno.datetime).format("YYYY-MM-DD");
      return {
        date: moment(fecha).toDate(),
        style: {
          backgroundColor: colors.secondary
        },
        textStyle: { color: colors.black },
      };
    });
  };
  
  const getCustomDatesStyles = () => {
    const activityDays = getActivityDays();
    const selectedStyles = selectedDates.map(dateStr => ({
      date: moment(dateStr).toDate(),
      style: {
        backgroundColor: colors.primary
      },
      textStyle: { color: colors.black },
    }));
    const filteredActivityDays = activityDays.filter(ad => {
      return !selectedDates.some(sd => moment(sd).isSame(ad.date, "day"));
    });
    return [...filteredActivityDays, ...selectedStyles];
  };

  const handleActivitySelect = async (activity: Activity) => {
    setSelectedActivity(activity);
    updateRemainingVouchers()
    setReservationModalVisible(true);
    try {
      const response = await Api.getTurn(activity.id);
      setTurns(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        openModal(
          "Sin turnos disponibles",
          "No hay turnos disponibles para esta actividad.",
          () => setModalVisible(false),
          "Entendido"
        );
      }
    }

  };


  const enabledDateStrings = new Set(
    getTurnosByActivity(selectedActivity?.name || "").map(turn =>
      moment(turn.datetime).format("YYYY-MM-DD")
    )
  );

  const disabledDates = (date: Date): boolean => {
    const today = moment().startOf("day");
    const targetStr = moment(date).format("YYYY-MM-DD");
    return moment(date).isBefore(today, 'day') || !enabledDateStrings.has(targetStr);
  };

  const diasHabilitados: DiaSemana[] = selectedActivity
  ? Array.from(new Set(
      getTurnosByActivity(selectedActivity.name)
        .map(t => moment(t.datetime).format("dddd") as DiaSemana)
    ))
  : [];

  const handleDateChange = (date: Date) => {
    const formatted = moment(date).format("YYYY-MM-DD");
    if (!enabledDates().includes(formatted)) {
      return; // No hacer nada si no está habilitada
    }
    setSelectedDates(prev => {
      if (prev.includes(formatted)) {
        return prev.filter(d => d !== formatted);
      } else {
        return [...prev, formatted];
      }
    });
  };

  const enabledDates = () => {
    if (!selectedActivity) return [];
    const turnosActivity = getTurnosByActivity(selectedActivity.name);

    return Array.from(new Set(
      turnosActivity.map(turno => moment(turno.datetime).format("YYYY-MM-DD"))
    ));
  };

  const handleConfirmPress = async () => {
    if (!member || !token) {
      openModal(
        "Iniciá sesión",
        "Necesitás iniciar sesión para suscribirte.",
        goToLogin,
        "Iniciar sesión",
        "Cancelar"
      );
      return;
    }
    const selectedTurnIds = turns
      .filter(turn => {
        const fecha = moment(turn.datetime).format("YYYY-MM-DD");
        return selectedDates.includes(fecha) && turn.activityName === selectedActivity?.name;
      })
      .map(turn => turn.id);
    const suscriptionBody : Suscriptions = {
      turnIds: selectedTurnIds
    };
    if (selectedDates.length === 0) {
      openModal(
        "Sin turnos",
        "No seleccionaste ningún turno.",
        () => setModalVisible(false),
      );
      return;
    }
    try {
      await Api.subscribe(suscriptionBody, token);
      const updatedVouchers = [...member.vouchers];
      const voucherToUpdate = updatedVouchers.find(v => v.activityId === selectedActivity!!.id && (v.remainingClasses ?? 0) > 0);
      if (voucherToUpdate) voucherToUpdate.remainingClasses = (voucherToUpdate.remainingClasses ?? 1) - 1;
      setMember({
        ...member,
        turns: [...member.turns, ...selectedTurnIds],
        vouchers: updatedVouchers
      });
      openModal(
        "Suscripción exitosa",
        "Te has suscripto exitosamente a la actividad.",
        goToInscriptions,
        "Ver inscripcion",
      );
    } catch (error: any) {
      const errorMessage = error?.response?.data || error?.message || "";
      if (errorMessage.includes("No hay voucher válido para la actividad")) {
        openModal("Sin voucher", "No tenés un voucher válido para esta actividad.", () => setModalVisible(false));
      } else {
        openModal("Error", "Error al suscribirse", () => setModalVisible(false));
      }
    }
  };
  
  const closeModal = () => {
    setFijados([]);
    setSelectedHorario(null);
    setSelectedDates([]);
    setTurns([])
    setSelectedActivity(null)
    setReservationModalVisible(false)
  }

  const goToInscriptions = () => {
    closeModal()
    router.push(Routes.Enrollments)
  }

  const goToLogin = () => {
    closeModal()
    router.push(Routes.Login)
  }

  const handleNotificationSubscription = async (activity: Activity) => {
    if (!token || !member) {
      openModal(
        "Atención",
        "Necesitás estar logueado para suscribirte a notificaciones.",
        () => router.push(Routes.Login),
        "Loguearme"
      );
      return;
    }
    const isSubscribed = member.activitiesToNotify?.includes(activity.id);
    try {
      const response = await Api.subscribeToNotifications(activity.id, token);
      const updatedActivitiesToNotify = isSubscribed
        ? member.activitiesToNotify.filter(id => id !== activity.id) // desuscripción
        : [...(member.activitiesToNotify || []), activity.id];       // suscripción
      setMember({
        ...member,
        activitiesToNotify: updatedActivitiesToNotify,
      });
      openModal(
        isSubscribed ? "Desuscripción exitosa" : "Suscripción exitosa",
        isSubscribed
          ? `Ya no recibirás notificaciones de: ${activity.name}`
          : `Te suscribiste a notificaciones de: ${activity.name}`,
        () => setModalVisible(false)
      );
    } catch (error: any) {
      console.log(error);
      openModal("Error", "No se pudo actualizar la suscripción", () => setModalVisible(false));
    }
  };

  const styles = StyleSheet.create({
    containerList: {
      padding: 10,
      backgroundColor: colors.background,
      flex: 1,
      justifyContent: "center",
      alignItems:"center"
    },
    containerCalendar: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 10,
    },
    title: {
      marginTop: 10,
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      color: colors.text,
      textAlign: "center",
    },
    switchContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    switchText: {
      color: colors.text,
      marginRight: 10,
    },
  });

  return (
    <View style={showWeeklyView ? styles.containerCalendar : styles.containerList}>
      <Text style={styles.title}>Selecciona una Actividad</Text>
      {/* Toggle */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>Vista semanal</Text>
        <Switch
          value={showWeeklyView}
          onValueChange={() => setShowWeeklyView(prev => !prev)}
          trackColor={{ false: colors.grayLight, true: colors.primary }}
          thumbColor={showWeeklyView ? colors.secondary : colors.white}
        />
      </View>
      
      {showWeeklyView ? (
        <WeeklyCalendarView />
      ) : (
        <>
          <FlatList
            data={activities}
            keyExtractor={(activity) => activity.name}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item: activity }) => (
                <ActivityCard 
                  activity={activity} 
                  onPress={handleActivitySelect}
                  onSubscribePress={handleNotificationSubscription}
                  isSubscribed={member?.activitiesToNotify?.includes(activity.id)}
                />
            )}
          />
          <ReservationModal
            visible={reservationModalVisible}
            onClose={() => closeModal()}
            selectedActivity={selectedActivity}
            selectedDates={selectedDates}
            selectedHorario={selectedHorario}
            setSelectedHorario={setSelectedHorario}
            handleDateChange={handleDateChange}
            getCustomDatesStyles={getCustomDatesStyles}
            diasSemana={diasSemana}
            diasHabilitados={diasHabilitados}
            fijados={fijados}
            toggleDia={toggleDia}
            handleConfirmPress={handleConfirmPress}
            getTurnosByActivity={getTurnosByActivity}
            remainingVouchers={remainingVouchersActivity}
            disabledDates={disabledDates}
          />
          <AlertModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            title={modalProps.title}
            mensaje={modalProps.mensaje}
            action={modalProps.action}
            actionButton={modalProps.actionButton}
            closeButton={modalProps.closeButton || "Cerrar"}
            linkText={modalProps.linkText}
            linkAction={modalProps.linkAction}
          />
        </>
      )}
    </View>
  );
}