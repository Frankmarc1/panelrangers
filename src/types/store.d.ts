import { DocumentReference, GeoPoint, Timestamp } from 'firebase/firestore';

export interface Store {
    abierto: boolean;
    banner: string;
    id: string;
    idSectorEconomico: string;
    logo: string;
    nombre: string;
    sectorEconomico: DocumentReference;
    status: boolean;
}
