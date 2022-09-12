import { DocumentReference, GeoPoint, Timestamp } from 'firebase/firestore';
export interface MainCategory {
    id: string;
    img: string;
    name: string;
    sectoresEconomicos: []    
    status: boolean
}
