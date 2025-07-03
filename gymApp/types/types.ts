import { darkColors } from "@/theme/colors";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

export type DiaSemana = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";
export type AppColors = typeof darkColors;

export interface Activity {
  id: number;
  name: string;
  description: string;
  image: any;
}

export interface Registration {
  turnId: number;
  activityName: string;
  startTime: string; 
}

export interface Suscriptions {
  turnIds: number[];
}

export interface Voucher {
  activityId: number;
  amount: number;
  remainingClasses?: number;
  activityName?: string;
  acquisitionDate?: Date,
  acquisitionWay?: String
  price?: Float
}

export interface BodyBuildingSubscription {
  member: string;
  acquisitionDate: string;
  dueDate: string;
  daysPerWeek: number;
}

export interface Member {
  id: number;
  name: string;
  username: string;
  registrations: Registration[];
  turns: number[]
  vouchers: Voucher[];
  activitiesToNotify: number[];
  bodyBuildingSubscription?: BodyBuildingSubscription;
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

export interface Turn {
  id: number;
  datetime: string;
  capacity: number;
  enrolled: number;
  activityName: string;
  activityId: number; 
}

export interface Event {
  id?: number;
  title: string;
  start: Date;
  end: Date;
  disabled?:boolean,
  activityId?: number; 
}

export interface BodyBuildingEntryLog {
  id: number;
  memberId: number;
  accessTime: string; // ISO 8601 date
}

export interface ActivityCardProps {
  activity: Activity;
  onPress: (activity: Activity) => void;
  width?: number;
  onSubscribePress?: (activity: Activity) => void;
  isSubscribed?: boolean
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
    remainingVouchers: number,
    disabledDates: any
}

export interface ScheduleSelectorProps {
    selectedActivity: Activity;
    selectedDates: string[];
    selectedHorario: string | null;
    setSelectedHorario: (hora: string) => void;
    getTurnosByActivity: (activityName: string) => Turn[];
}

export interface AlertModalProps {
  visible: boolean;
  onClose: () => void;
  closeButton: string;
  title: string;
  mensaje?: string;
  action? : () => void;
  actionButton?: string;
  linkText?: string;
  linkAction?: () => void;
  showSubscribe?: boolean;
  activityId?:number;
  onSubscribePress?: (activityId: number) => void;
  isSubscribed?: boolean
}
