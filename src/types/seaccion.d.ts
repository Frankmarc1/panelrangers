import { DocumentReference, GeoPoint, Timestamp } from 'firebase/firestore';

export interface Seaccion {
    banner: string;
    detalle: string;
    estado: boolean;
    fecha_registro: Timestamp;
    id: string;
    imagen_insignia: string;
    imagen_top: string;
    musica: {
        id: string;
        nombre: string;
        url: string;
    }
    nombre: string;
    nombre_insignia: string;
}
