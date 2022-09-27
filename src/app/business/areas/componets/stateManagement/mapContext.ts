import { GeoPoint } from 'firebase/firestore';
import React, { createContext, useContext } from 'react';

export interface Area {
  deliveryPrice: number;
  distributionArea: GeoPoint[];
  id: number;
  name: string;
  status: boolean;
  timeAtention: number;
}

export interface Point {
  coors: google.maps.LatLng;
  id: number;
}

export interface Map {
  areas: Area[];
  points: Point[];
  savePoint: (point: google.maps.LatLng) => void;
  store: {
    lat: number;
    lng: number;
  };
  clearPoints: () => void;
  handleDelete: (id: number) => void;
  selectArea: (id: number) => void;
  deselectArea: () => void;
  idArea: number | undefined;
}

export const mapContext = createContext<Map | null>(null);
export const useMap = () => useContext(mapContext);
