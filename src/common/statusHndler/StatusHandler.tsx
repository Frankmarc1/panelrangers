import { doc, DocumentData, updateDoc } from 'firebase/firestore';
import { ChangeEvent, FC,useState } from 'react';
import { toast } from 'react-hot-toast';
import { db_client } from '../../firebase/client';

type Props = {
    collectionName: string;
    data: DocumentData;
   
};

export const StatusHandler: FC<Props> = ({
    collectionName,
    data,
  
}: Props): JSX.Element => {
    const [loadingStatus, setLoadingStatus] = useState<boolean>(false);
    const handleClick=()=>{
        (data.status===true)
         ?  toast.success("Desactivado")
         :  toast.success("Activado")
    }
    const handleStatus = (e: ChangeEvent<HTMLInputElement>, id: string): void => {
        setLoadingStatus(true);
        updateDoc(doc(db_client, `${collectionName}/${id}`), {
            status: e.target.checked,
            
        })

            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoadingStatus(false);
            });
    };
    return (
        <div className='d-flex align-items-center'>
            {loadingStatus ? (
                <div
                    className='spinner-border text-light spinner-border-sm'
                    role='status'>
                    <span className='visually-hidden'>Loading...</span>
                </div>
            ) : (
                <div className='form-check form-switch d-flex ms-4'>
                    <input
                        type="checkbox"
                        className="toggle toggle-accent h-[1.2rem]"
                        checked={data.status}
                        onClick={()=>handleClick()}
                        onChange={(e) => handleStatus(e, data.id)}
                    />
                </div>
            )}
        </div>
    );
};
