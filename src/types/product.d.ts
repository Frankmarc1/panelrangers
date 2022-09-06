import { DocumentReference, GeoPoint, Timestamp } from 'firebase/firestore';

export interface Product{
    availability: string
    categoria: string;
    descripcion: string;
    id: string;
    img: string;
    name: string;
    tipos: type[];
    
}
