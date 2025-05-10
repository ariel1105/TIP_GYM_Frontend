import { darkColors } from "@/theme/colors";

export type DiaSemana = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
export type AppColors = typeof darkColors;

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
  turnId: number;
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

export interface Event {
  id?: number;
  title: string;
  start: Date;
  end: Date;
  disabled?:boolean
}

export interface AlertModalProps {
  visible: boolean;
  onClose: () => void;
  closeButton: string;
  title: string;
  mensaje?: string;
  action? : () => void;
  actionButton?: string;
}

export interface Suscriptions {
  turnIds: number[];
}

export interface Member {
  id: number;
  name: string;
  username: string;
  registrations: Registration
}

export interface UserLogin {
  username: string;
  password: string
}

export interface UserRegister {
  name: string;
  username: string;
  password: string
}