import {
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
  DocumentData,
  DocumentReference,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import toast from 'react-hot-toast';

import { db_client, storage_client } from '../../../firebase/client';
import { MotorizedFields } from '../../../pages/motorizados/[idMotorized]/editar';
import { Motorized } from '../../../types/motorized';
import { normalizePeruPhoneForSearch } from '../../../utils/phone';

export const editMotorized = async (
  motorized: MotorizedFields,
  uid: string,
  initialValues: Motorized
) => {
  try {
    if (!initialValues.id) {
      toast.error('No se encontró el ID del motorizado.');
      return;
    }

    let referenceAgency: DocumentReference<DocumentData> | null =
      initialValues.reference_agencia ?? null;

    let referencePhase: DocumentReference<DocumentData> | null =
      initialValues.reference_fase ?? null;

    let photo = initialValues.profile?.img ?? '';

    const currentAgencyId = initialValues.reference_agencia?.id ?? '';
    const currentPhaseId = initialValues.reference_fase?.id ?? '';

    const newAgencyId = motorized.agency ?? '';
    const newPhaseId = motorized.phase ?? '';

    if (newAgencyId && newAgencyId !== currentAgencyId) {
      const docRef = doc(db_client, 'empresas_agencia', newAgencyId);
      const snap = await getDoc(docRef);

      if (!snap.exists()) {
        toast.error('La agencia seleccionada no existe.');
        return;
      }

      referenceAgency = docRef;
    }

    if (!newAgencyId) {
      referenceAgency = null;
    }

    if (newPhaseId && newPhaseId !== currentPhaseId) {
      const docRef = doc(db_client, 'fases', newPhaseId);
      const snap = await getDoc(docRef);

      if (!snap.exists()) {
        toast.error('La fase seleccionada no existe.');
        return;
      }

      referencePhase = docRef;
    }

    if (!newPhaseId) {
      referencePhase = null;
    }

    if (motorized.photo instanceof FileList && motorized.photo.length > 0) {
      const storageRef = ref(
        storage_client,
        `users_motorizados/${initialValues.id}/fotos/${initialValues.id}`
      );

      await uploadBytes(storageRef, motorized.photo[0]);

      photo = await getDownloadURL(storageRef);
    }

    const cleanPhone = motorized.phone.trim();

    const data = {
      activo: motorized.data_app === 'true',

      movilidad: {
        color: motorized.color.trim(),
        expiracionBrevete: motorized.date_exp_license,
        expiracionSoat: motorized.date_exp_soat,
        marca: motorized.brand.trim(),
        placa: motorized.license_plate.trim(),
        reference_tipo: doc(db_client, 'tipo_movilidad', 'MOTOCICLETA'),
      },

      reference_master: doc(db_client, 'rangers_masters', uid),
      reference_fase: referencePhase,
      reference_agencia: referenceAgency,

      phone: cleanPhone,
      phoneSearch: normalizePeruPhoneForSearch(cleanPhone),

      'profile.dni': motorized.dni.trim(),
      'profile.lastName': motorized.lastName.toUpperCase().trim(),
      'profile.name': motorized.name.toUpperCase().trim(),
      'profile.img': photo,

      timeUpdate: serverTimestamp(),
      tipo_ranger: motorized.type_contract,
      porcentaje: Number(motorized.percent || 0),
    };

    const docSnap = doc(db_client, 'users_motorizados', initialValues.id);

    await updateDoc(docSnap, data);

    toast.success('Actualizado correctamente.');
  } catch (err) {
    console.error(err);
    toast.error('Error en el servidor.');
  }
};