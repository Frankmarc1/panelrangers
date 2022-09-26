import { DocumentReference, GeoPoint, Timestamp } from 'firebase/firestore';

export interface Commerce {
    abierto: boolean;
    address: {
      address: string;
      location: GeoPoint;
    };
    areas?: Area[];
    banner: string;
    bannerHome: string;
    city: {
      admin: string;
      countryCode: string;
      locality: string;
      subadmin: string;
    };
    daysAtention?: DaysAtention;
    id: string;
    idSectorEconomico: string;
    logo: string;
    nickName: string;
    nombre: string;
    phone: string;
    referenceEmpresa: DocumentReference;
    score: number;
    sectorEconomico: DocumentReference;
    status: boolean;
    timeUp: Timestamp;
    typeBussines: 'ALIADO' | 'COLABORADOR';
    views?: number;
  }
  

