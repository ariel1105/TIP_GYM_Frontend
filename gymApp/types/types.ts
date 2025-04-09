export type DiaSemana = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export interface Activity {
  id: number;
  nombre: string;
  descripcion: string;
  imagen: any;
}

export interface Turn {
  id: number;
  datetime: string; // en formato ISO, ej. "2025-04-01T09:00:00"
  capacity: number;
  enrolled: number;
  activityName: string;
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

export interface ReservaModalProps {
    visible: boolean;
    onClose: () => void;
    selectedActivity: Activity | null;
    selectedDates: string[]; // formato "YYYY-MM-DD"
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
    selectedDates: string[]; // Formato "YYYY-MM-DD"
    selectedHorario: string | null;
    setSelectedHorario: (hora: string) => void;
    getTurnosByActivity: (activityName: string) => Turn[];
}