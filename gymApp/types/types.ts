export type DiaSemana = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export interface Activity {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: any;
}

export interface Turn {
  id: number;
  datetime: string;
  capacity: number;
  enrolled: number;
  activityName: string;
}

export interface Registration {
  activityName: string;
  startTime: string; 
}


export interface ActivityCardProps {
    item: Activity;
    onPress: (activity: Activity) => void;
}

export interface CheckboxDiasProps {
  diasSemana: DiaSemana[];           
  diasHabilitados: DiaSemana[];      
  fijados: DiaSemana[];              
  toggleDia: (dia: DiaSemana) => void; 
}

export interface ReservationModalProps {
    visible: boolean;
    onClose: () => void;
    selectedActivity: Activity | null;
    selectedDates: string[];
    selectedHorario: string | null;
    setSelectedHorario: (horario: string | null) => void;
    handleDateChange: (date: Date) => void;
    getCustomDatesStyles: () => {
      date: Date;
      style: object;
      textStyle?: object;
    }[];
    diasSemana: DiaSemana[];
    diasHabilitados: DiaSemana[];
    fijados: DiaSemana[];
    toggleDia: (dia: DiaSemana) => void;
    handleConfirmPress: () => void;
    getTurnosByActivity: (activityName: string) => Turn[];
}

export interface ScheduleSelectorProps {
    selectedActivity: Activity;
    selectedDates: string[];
    selectedHorario: string | null;
    setSelectedHorario: (hora: string) => void;
    getTurnosByActivity: (activityName: string) => Turn[];
}

export interface ConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  mensaje?: string;
}