import {
    collection,
    CollectionReference,
    doc,
    getDoc,
    getDocs,
    setDoc,
  } from 'firebase/firestore';
import { db_client } from '../../../../../firebase/client';
  
  const cloneDocuments = async (colRef: CollectionReference, path: string) => {
    const snap = await getDocs(colRef);
  
    snap.docs.forEach(async (docu) => {
      await setDoc(doc(db_client, `${path}/${docu.id}`), {
        ...docu.data(),
      });
    });
  };


  export const cloneStore = async (idBusiness: string, pathToStore: string) => {

    const colExtras = collection(db_client, `${pathToStore}/adicionales`);
    const colCategories = collection(db_client, `${pathToStore}/categorias`);
    const colProducts = collection(db_client, `${pathToStore}/productos`);
    const newStore = doc(collection(db_client, `empresas/${idBusiness}/comercios`));
    const routePrincipal = `empresas/${idBusiness}/comercios/${newStore.id}`;
  
    try {
      // clone commerce
      const storeData = (await getDoc(doc(db_client, pathToStore))).data();
  
      await setDoc(newStore, {
        ...storeData,
        id: newStore.id,
        referenceEmpresa: doc(db_client, `empresas/${idBusiness}`),
      });
  
      await cloneDocuments(colExtras, `${routePrincipal}/adicionales`);
      await cloneDocuments(colCategories, `${routePrincipal}/categorias`);
      await cloneDocuments(colProducts, `${routePrincipal}/productos`);
  
      const snap = await getDocs(colProducts);
  
      snap.docs.forEach(async (docu) => {
        await setDoc(doc(db_client, `${routePrincipal}/productos/${docu.id}`), {
          ...docu.data(),
          referenceComercio: newStore,
        });
      });
    } catch (err) {
      throw err;
    }
  };
  