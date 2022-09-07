import { DocumentReference, GeoPoint, Timestamp } from 'firebase/firestore';

export interface Product{
    availability: string
    descripcion: string;
    id: string;
    categoria: String;
    img: string;
    name: string;
    tipos: type[];
    
}
