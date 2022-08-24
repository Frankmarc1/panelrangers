import { Timestamp } from 'firebase/firestore';

export interface Agency {
  id: string;
  nombre: string;
  departamento: string;
  direccion: string;
  estado: boolean;
  fecha_registro: Timestamp;
}
