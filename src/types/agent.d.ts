import { DocumentReference, GeoPoint, Timestamp } from 'firebase/firestore';

export interface Agent {
  agencia: DocumentReference;
  direccion: string;
  estado: boolean;
  fecha_registro: Timestamp;
  id: string;
  logo: string;
  nombre: string;
  reference_agencia: DocumentReference;
}
