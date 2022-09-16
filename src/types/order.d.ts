import { DocumentReference, Timestamp } from 'firebase/firestore';

export interface Order {
  datoPedido: string;
  deliveryPagadoTienda: string;
  estado: string;
  fechaFinalizacion: Timestamp;
  fechaModificacion: null | Timestamp;
  fechaRegistro: Timestamp;
  id: string;
  idEmpresa: DocumentReference;
  idEmpresaPedido: DocumentReference;
  idRanger: DocumentReference;
  idReporte: DocumentReference;
  incentivo: number;
  logoEmpresa: string;
  nombreEmpresa: string;
  observacion: string;
  pedidoPagado: boolean;
  porcentaje: number;
  totalACobrar: number;
  valorDelivery: number;
  valorPedido: number;
  valorDescuento: number;
}
