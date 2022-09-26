import {
    collection,
    doc,
    getDocs,
    query,
    updateDoc,
    where,
  } from 'firebase/firestore';
  import { toast } from 'react-hot-toast';
  
  import { db_client } from '../../firebase/client';
 
  export const checkingCommerce = async (path: string, status: boolean) => {
    const collectionRef = collection(db_client, `${path}/productos`);
  
    try {
      const snap = await getDocs(collectionRef);
      const snapVerified = await getDocs(
        query(collectionRef, where('status', '==', true))
      );
  
      // verificar que todos los productos esten verificados
      if (snap.size === snapVerified.size) {
        await updateDoc(doc(db_client, path), {
          status,
        });
  
        toast.error(`Tienda ${status ? 'verificada' : 'no verificada'} correctamente`);
      } else {
        toast.error('ERROR verifique antes los productos');
      }
    } catch (err) {
      console.error(err);
    }
  };
  