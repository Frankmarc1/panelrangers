import { Timestamp } from 'firebase/firestore';
export interface Profile {
  nameComercial: string;
  logo: string;
  lema: string;
  descripcion: string;
}

export interface Company {
  contentProfile: Profile;
  dataSunat: {
    departamento: null | string;
    dirrecion: null | string;
    distrito: null | string;
    razonSocial: string;
    ruc: string;
  };
  id: string;
  status: boolean;
  timeUp: Timestamp;
  verified: boolean;
}
