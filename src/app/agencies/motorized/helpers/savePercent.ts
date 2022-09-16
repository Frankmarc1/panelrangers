import { collection, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db_client } from '../../../../firebase/client';
import { Order } from '../../../../types/order';

export const savePercent = async (
  percent: number,
  idMotorized: string,
  idReporte: string
) => {
  try {
    const snap = await getDocs(
      collection(
        db_client,
        `users_motorizados/${idMotorized}/agencia_reporte_pedidos/${idReporte}/agencia_pedidos_reportados/`
      )
    );
    const orders = snap.docs.map((doc) => doc.data() as Order);
    const filterOrders = orders.filter((order) => order.estado != 'ELIMINADO');
    let totalDebt = 0;

    const taskOrders = filterOrders.map(async (order) => {
      const debt = order.valorDelivery * percent;

      totalDebt += debt;

      await updateDoc(
        doc(
          db_client,
          `users_motorizados/${idMotorized}/agencia_reporte_pedidos/${idReporte}/agencia_pedidos_reportados/${order.id}`
        ),
        {
          porcentaje: percent,
          deuda: debt,
        }
      );
    });

    await Promise.all(taskOrders);

    await updateDoc(
      doc(
        db_client,
        `users_motorizados/${idMotorized}/agencia_reporte_pedidos/${idReporte}`
      ),
      {
        porcentaje: percent,
        deuda: totalDebt,
      }
    );
  } catch (err) {
    throw err;
  }
};
