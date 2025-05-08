import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Alert, Switch } from "react-native";
import moment from "moment";
import { useEffect } from "react";
import Api from "@/services/Api";
import getLocalImage from "../utils/getImages";
import ActivityCard from "@/components/ActivityCard";
import ReservationModal from "@/components/ReservationModal";
import { Activity, DiaSemana, Suscriptions, Turn, AppColors } from "../../types/types";
import AlertModal from "@/components/AlertModal";
import useColors from "@/theme/useColors";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import WeeklyCalendarView from "@/components/WeeklyCalendarView";
import { Routes } from "../constants/routes";

export default function ActivitiesScreen() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const [reservationModalVisible, setReservationModalVisible] = useState(false);
  const [fijados, setFijados] = useState<DiaSemana[]>([]);
  const [selectedHorario, setSelectedHorario] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [inscriptionSuccessModalVisible, setInscriptionSuccessModalVisible] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [noTurnsModalVisible, setNoTurnsModalVisible] = useState(false);

  const [showWeeklyView, setShowWeeklyView] = useState(false);


  const colors : AppColors = useColors()

  const { token, member, setMember } = useAuth();

  const router = useRouter();


  const getTurnosByActivity = (activityName: string) => {
    return turns.filter(turn => turn.activityName === activityName);
  };
  
  const diasSemana: DiaSemana[] = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];

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
        console.error("Error al traer Activities:", error);
      }
    }
    fetchActivities()
  }, []);

  const toggleDia = (dia: DiaSemana) => {
    const estaFijado = fijados.includes(dia);
    const nuevaLista = estaFijado
      ? fijados.filter(d => d !== dia)
      : [...fijados, dia];
  
    const turnosActivity = getTurnosByActivity(selectedActivity?.nombre || "");
  
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
  
    const turnosActivity = getTurnosByActivity(selectedActivity.nombre);
  
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
    try {
      const response = await Api.getTurn(activity.id);
      setTurns(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setNoTurnsModalVisible(true);
      }
    }
    setReservationModalVisible(true);
  };
  

  const diasHabilitados: DiaSemana[] = selectedActivity
  ? Array.from(new Set(
      getTurnosByActivity(selectedActivity.nombre)
        .map(t => moment(t.datetime).format("dddd") as DiaSemana)
    ))
  : [];

  const handleDateChange = (date: Date) => {
    const dateStr = moment(date).format("YYYY-MM-DD");
    handleDateClick(dateStr);
  };
    
  const handleDateClick = (date: string) => {
    if (selectedDates.includes(date)) {
      setSelectedDates(prev => prev.filter(d => d !== date));
    } else {
      setSelectedDates(prev => [...prev, date]);
    }
  };

  const handleConfirmPress = async () => {
    if (!member || !token) {
      setLoginModalVisible(true);
      return;
    }
    const selectedTurnIds = turns
      .filter(turn => {
        const fecha = moment(turn.datetime).format("YYYY-MM-DD");
        return selectedDates.includes(fecha) && turn.activityName === selectedActivity?.nombre;
      })
      .map(turn => turn.id);

    const suscriptionBody : Suscriptions = {
      turnIds: selectedTurnIds
    };
    
    if (selectedDates.length === 0) {
      Alert.alert("No se seleccionaron turnos válidos.");
      return;
    }
    try {
      const response = await Api.suscribe(suscriptionBody, token);
      setMember({ ...member, registrations: response.data });
      setInscriptionSuccessModalVisible(true);
    } catch (error) {
      Alert.alert("Error al suscribirse", JSON.stringify(error));
      console.error("Error al suscribirse:", error);
    }
  };
  
  
  const closeModal = () => {
    setFijados([]);
    setSelectedHorario(null);
    setSelectedDates([]);
    setTurns([])
    setReservationModalVisible(false)
  }

  const closeInscriptionSuccessModal = () => {
    setInscriptionSuccessModalVisible(false)
    closeModal()
  }

  const goToInscriptions = () => {
      setInscriptionSuccessModalVisible(false)
      closeModal()
      router.push(Routes.Enrollments)
    }

  const goToLogin = () => {
    setLoginModalVisible(false)
    closeModal()
    router.push(Routes.Login)
  }

  const closeLoginModal = () => {
    setLoginModalVisible(false)
    closeModal()
  }

  const closeNoTurnsModal = () => {
    setNoTurnsModalVisible(false)
    closeModal()
  }

  

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
            keyExtractor={(item) => item.nombre}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            renderItem={({ item }) => (
              <ActivityCard item={item} onPress={handleActivitySelect} />
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
          />
          <AlertModal
            visible={inscriptionSuccessModalVisible}
            onClose={closeInscriptionSuccessModal}
            title={"¡Listo!"}
            mensaje="¡Ya tenés tu turno reservado!"
            actionButton="Ver inscripción"
            action={goToInscriptions}
          />

          <AlertModal
            visible={loginModalVisible}
            onClose={closeLoginModal}
            title={"¡Atencion!"}
            mensaje="Para esta acción necesitás estar logueado."
            actionButton="Loguearme"
            action={goToLogin}
          />

          <AlertModal
            visible={noTurnsModalVisible}
            onClose={closeNoTurnsModal}
            title="Sin turnos disponibles"
            mensaje="No hay turnos disponibles para esta actividad desde hoy en adelante."
          />
        </>
      )}
    </View>
  );
}