import { doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import toast from 'react-hot-toast';
import { db_client, storage_client } from '../../../firebase/client';
import { MotorizedFields } from '../../../pages/motorizados/[idMotorized]/editar';
import { Motorized } from '../../../types/motorized';

export const editMotorized = async (
  motorized: MotorizedFields,
  uid: string,
  initialValues: Motorized
) => {
  let referenceAgency = initialValues.reference_agencia;
  let referencePhase = initialValues.reference_fase;
  let photo = initialValues.profile.img;

  // define agency
  if (motorized.agency != initialValues.reference_agencia.id) {
    const docRef = doc(db_client, 'empresas_agencia/' + motorized.agency);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      toast.error('La agencia selecionada no existe.');

      return;
    }

    referenceAgency = docRef;
  }

  if (motorized.phase != initialValues.reference_fase.id) {
    const docRef = doc(db_client, 'fases/' + motorized.phase);
    const snap = await getDoc(docRef);

    if (!snap.exists()) {
      toast.error('La fase selecionada no existe.');

      return;
    }

    referencePhase = docRef;
  }

  // save new photo
  if (motorized.photo instanceof FileList) {
    const storageRef = ref(
      storage_client,
      `users_motorizados/${initialValues.id}/fotos/${initialValues.id}`
    );

    await uploadBytes(storageRef, motorized.photo[0]);

    photo = await getDownloadURL(storageRef);
  }

  let data = {
    activo: motorized.data_app === 'true',
    movilidad: {
      color: motorized.color.trim(),
      expiracionBrevete: motorized.date_exp_license,
      expiracionSoat: motorized.date_exp_soat,
      marca: motorized.brand.trim(),
      placa: motorized.license_plate.trim(),
      reference_tipo: doc(db_client, '/tipo_movilidad/MOTOCICLETA'),
    },
    reference_master: doc(db_client, 'rangers_masters/' + uid),
    reference_fase: referencePhase,
    phone: motorized.phone.trim(),
    'profile.dni': motorized.dni.trim(),
    'profile.lastName': motorized.lastName.toUpperCase().trim(),
    'profile.name': motorized.name.toUpperCase().trim(),
    'profile.img': photo,
    timeUpdate: serverTimestamp(),
    tipo_ranger: motorized.type_contract,
    reference_agencia: referenceAgency,
    porcentaje: motorized.percent,
  };

  try {
    const docSnap = doc(db_client, `users_motorizados/${initialValues.id}`);

    updateDoc(docSnap, data);

    toast.success('Actualizado correctmente.');
  } catch (err) {
    console.log(err);

    toast.error('Error en el servidor');
  }
};
