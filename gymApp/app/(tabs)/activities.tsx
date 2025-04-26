import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Alert } from "react-native";
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

export default function ActivitiesScreen() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [fijados, setFijados] = useState<DiaSemana[]>([]);
  const [selectedHorario, setSelectedHorario] = useState<string | null>(null);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  const colors : AppColors = useColors()

  const { token, member } = useAuth();

  const [loginModalVisible, setLoginModalVisible] = useState(false);

  const router = useRouter();


  const getTurnosByActivity = (activityName: string) => {
    return turns.filter(turn => turn.activityName === activityName);
  };
  
  const diasSemana: DiaSemana[] = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ];

  useEffect(() => {
    Api.getActivities()
      .then((response) => {
        const ActivityesConImagen: Activity[] = response.data.map((Activity: any) => ({
          id: Activity.id,
          nombre: Activity.name,
          descripcion: Activity.description,
          imagen: getLocalImage(Activity.name),
        }));
        
        setActivities(ActivityesConImagen);
      })
      .catch((error) => {
        console.error("Error al traer Activityes:", error);
      });
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
      const turnosFormateados: Turn[] = response.data.map((turno: any) => ({
        id: turno.id,
        datetime: turno.datetime,
        capacity: turno.capacity,
        enrolled: turno.enrolled,
        activityName: turno.activity.name
      }));
      setTurns(turnosFormateados);
    } catch (error) {
      console.error("Error al traer turnos:", error);
    }
    setModalVisible(true);
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
      await Api.suscribe(member.id, suscriptionBody, token);
      setConfirmModalVisible(true);
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
    setModalVisible(false)
  }

  const closeConfirmationModal = () => {
    setConfirmModalVisible(false)
    closeModal()
  }

  const closeLoginModal = () => {
    setLoginModalVisible(false)
    closeModal()
    router.push("/login")
  }


  const styles = StyleSheet.create({
    container: {
      paddingTop: 40,
      backgroundColor: colors.background,
      flex: 1,
      justifyContent: "center",
      alignItems:"center"
    },
    title: {
      marginTop: 20,
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 20,
      color: colors.text,
      textAlign: "center",
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecciona una Actividad</Text>
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
          visible={modalVisible}
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
          visible={confirmModalVisible}
          onClose={closeConfirmationModal}
          mensaje="¡Ya tenés tu turno reservado!"
        />

        <AlertModal
          visible={loginModalVisible}
          onClose={closeLoginModal}
          mensaje="Para esta acción necesitás estar logueado."
        />


      </View>
  );
}

