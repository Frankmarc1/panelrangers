import { DocumentReference, GeoPoint, Timestamp } from 'firebase/firestore';
export interface Agencie {
    nombre:string;
    departamento: string;
    direccion: string;
    estado: boolean;
    fecha_registro: Timestamp;
   
}