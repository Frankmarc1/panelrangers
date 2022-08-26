import { DocumentReference, GeoPoint, Timestamp } from 'firebase/firestore';

export interface Sanction {
    detalle: string;
    detalle2: string;
    estado: boolean;
    fecha_fin: number;
    fecha_inicio: number;
    fecha_registro: Timestamp;
    id: string;
    puntos: number;
    tipo: string;
    titulo: string;
}
