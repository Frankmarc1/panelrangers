import { DocumentReference, GeoPoint, Timestamp } from 'firebase/firestore';

export interface Business {
    contentProfile:{
        descripcion: string;
        lema: string;
        logo:string;
        nameComercial: string;
    },
    dataSunat:{
        departamento: null;
        dirrecion: null;
        distrito: null;
        razonSocial: string;
        ruc: string;
    }
    id: string;
    status: boolean;
    timeUp: Timestamp;
    verified: boolean;


}
