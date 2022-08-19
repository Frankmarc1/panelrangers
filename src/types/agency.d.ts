import { Timestamp } from 'firebase/firestore';

export interface Agency {
  nombre: string;
  departamento: string;
  direccion: string;
  estado: boolean;
  fecha_registro: Timestamp;
}
