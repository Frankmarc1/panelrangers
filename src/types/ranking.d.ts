import { DocumentReference, GeoPoint, Timestamp } from 'firebase/firestore';

export interface Ranking {
    beneficio_porcentaje: number;
    calificador: number;
    id: string;
    imagen: string;
    nombre: string;
    puntos:number;
    variacion:number;
}
