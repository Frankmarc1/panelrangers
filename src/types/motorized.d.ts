import { DocumentReference, GeoPoint, Timestamp } from 'firebase/firestore';

interface Points {
  cantidad: number;
  create_at: Timestamp;
  create_by: DocumentReference;
  detalle: string;
}

interface Medal {
  fecha_registro: Timestamp;
  image: string;
  reference: DocumentReference;
}

export interface Motorized {
  activo: boolean;
  address: {
    label: null;
    location: GeoPoint;
    name: string;
  };
  city: {
    admin: string;
    countryCode: string;
    locality: string;
    subadmin: string;
  };
  fcm: string;
  historial_puntos: Points[];
  medallas: Medal[];
  movilidad: {
    color: string;
    expiracionBrevete: string;
    marca: string;
    placa: string;
  };
  phone: string;
  porcentaje: number;
  profile: {
    dni: string;
    img: string;
    lastName: string;
    name: string;
  };
  puntos_acumulados: number;
  puntos_permanentes: number;
  ranking_agencia: DocumentReference;
  ranking_imagen_agencia: string;
  ref_temporada: DocumentReference;
  reference_agencia: DocumentReference;
  reference_fase: DocumentReference;
  reference_master: DocumentReference;
  status: boolean;
  timeUp: Timestamp;
  timeUpdate: Timestamp;
  tipo_ranger: string;
}
