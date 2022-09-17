import { useForm, SubmitHandler } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { collection, getDoc, doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';

import { db_client, storage_client } from '../../../firebase/client';
import { FloatingInput } from "../../../components/Inputs/FloatingInput";
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
type Inputs = {
    benefic: number;
    description: String;
    status: boolean;
    id: string;
    img: FileList;
    name: string;
}
interface Medalll {
    beneficio: number;
    descripcion: String;
    estado: boolean;
    id: string;
    imagen: FileList;
    nombre: string;
}
export const FormMedal = () => {
    const [urlImg, setUrlImg] = useState('');
    const router = useRouter()
    const { idAgency } = router.query;

    const { register, setValue, reset, handleSubmit } = useForm<Inputs>();
    /*/useEffect(() => {
        if (idAgency) {
            getDoc(doc(db_client, `/empresas_agencia/${idAgency}/medallas/`))
                .then((snap) => {
                    if (snap.exists()) {
                        const {
                            beneficio,
                            descripcion,
                            estado,
                            id,
                            imagen,
                            nombre,
                        } = snap.data();
                       
                        setValue('benefic', beneficio);
                        setValue('description', descripcion);
                        setValue('name', estado);
                        setValue('image', imagen);
                    
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, []);*/
    const renderImage = (evt: any) => {
        const blob = evt.target.files[0];
        const urlImg = URL.createObjectURL(blob);
        setUrlImg(urlImg);

    };
    const onSubmit: SubmitHandler<Inputs> = async (data) => {

        const docRef = doc(collection(db_client, `empresas_agencia/${idAgency}/medallas`));

        const imgRef = ref(
            storage_client,
            `empresas_agencia/${idAgency}/medallas/${docRef.id}/${Date.now()}`
        );
        if (!data.name) {
            toast.error("imgrese Nombre Porfavor...!")
            return;
        }

        let img: string = '';
        if (data.img instanceof FileList) {
            await uploadBytes(imgRef, data.img[0]);
            img = await getDownloadURL(imgRef);
        } else {
            img = data.img;
        }

        let obj: Medalll = {
            id: docRef.id,
            beneficio: data.benefic,
            descripcion: data.description,
            estado: true,
            imagen: data.img,
            nombre: data.name,

        };
        await setDoc(docRef, obj);
        alert("medalla creada")

    }
    return (
        <div className="card bg-white pb-3  border">
            <div className="card-header border-b ">
                <h3 className="ml-[2rem] font-bold my-2 card-title">Crear Medallas</h3>
            </div>
            <div className="card-body">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    autoComplete='off'
                >
                    <div className="container mx-auto grid grid-cols-1">
                        <div className='mb-5 grid grid-cols-1'>
                            <div className='flex items-center'>
                                <label className='block'>
                                    <span className='sr-only'>Selecionar foto</span>
                                    <input
                                        type='file'
                                        className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100'
                                        {...register('img', {
                                            onChange: renderImage,
                                        })}

                                    />
                                </label>
                            </div>
                        </div>

                        <div className='mb-5 grid grid-cols-1'>
                            <div>
                                <FloatingInput
                                    placeholder='Nombres'
                                    type={'text'}
                                    {...register('name')}
                                />
                            </div>
                        </div>

                        <div className='mb-5 grid grid-cols-1 w-full'>
                            <div>
                                <FloatingInput
                                    placeholder='Descripcion'
                                    type={'text'}
                                    {...register('description')}
                                />
                            </div>
                        </div>

                        <div className='mb-[2rem] grid grid-cols-1'>
                            <div>
                                <FloatingInput
                                    placeholder='Beneficio'
                                    type={'number'}
                                    {...register('benefic')}
                                />
                            </div>
                        </div>

                    </div>
                    <button type="submit" className="btn btn-primary btn-md">Guardar Medalla</button>
                </form>
            </div>
        </div>
    );
}
