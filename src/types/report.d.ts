import { DocumentReference, Timestamp } from 'firebase/firestore';

export interface Pay {
  cantidad: number;
  create_at: Timestamp;
  created_by: DocumentReference;
  id: number;
  paymentMethods: string;
}

export interface Hours {
  estado: boolean;
  hora_fin: string;
  hora_inicio: string;
  horas: number;
}

export interface Report {
  cantidad_pedidos: number;
  descuentos: number;
  deuda: number;
  estado: string;
  fecha_registro: Timestamp;
  fecha_verificado: Timestamp;
  horas: number;
  idReporte: string;
  multiplicador: number;
  nombreReporte: string;
  observacion: string;
  pago: number;
  pagos: Pay[];
  porcentaje: number;
  ref_mes: DocumentReference;
  reference_master: DocumentReference;
  registro_horas: Hours[];
  totalReporte: number;
}
