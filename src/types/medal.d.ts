import { DocumentReference, GeoPoint, Timestamp } from 'firebase/firestore';

export interface Medal {
    beneficio: number;
    descripcion: string;
    estado: boolean;
    id: string;
    imagen: string;
    nombre: string;
}
