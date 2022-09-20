import {
    collection,
    CollectionReference,
    doc,
    DocumentReference,
    setDoc,
    updateDoc,
} from 'firebase/firestore';
import { UnpackNestedValue } from 'react-hook-form';
import { db_client } from '../../../firebase/client';
import { capitalize } from '../../../common/utils/formatStrings';
import { Inputs } from '../../../pages/sectores-economicos';

const collectionRef: CollectionReference = collection(db_client, 'sector_economicos');

export const handleForm = async (
    data: UnpackNestedValue<Inputs>,
    idSector: string | undefined
) => {
    const name = capitalize(data.name_sector);

    const reference: DocumentReference = idSector
        ? doc(db_client, `sector_economicos/${idSector}`)
        : doc(collectionRef);

    if (idSector) {
        await updateDoc(reference, {
            name,
        });
    } else {
        await setDoc(reference, {
            id: reference.id,
            name: name.trim(),
            status: true,
        });
    }
};
