import { DocumentReference, GeoPoint, Timestamp } from 'firebase/firestore';
export interface Users {
    dni: string;
    email: string;
    username: string;
    reference_rol: DocumentReference;

}
