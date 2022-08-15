import { DocumentReference, GeoPoint, Timestamp } from 'firebase/firestore';

interface Points {
    cantidad: number;
    create_at: Timestamp;
    reference_rol: DocumentReference;
    detalle: string;
}

interface Medal {
    fecha_registro: Timestamp;
    image: string;
    reference: DocumentReference;
}

export interface Users {
    dni: string;
    email: string;
    username: string;
    reference_rol: DocumentReference;
    roles:{
        name: string;
    }






}
