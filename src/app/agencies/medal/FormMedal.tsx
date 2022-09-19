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
    img: FileList | string;
    name: string;
}
interface Medalll {
    beneficio: Number;
    descripcion: String;
    estado: boolean;
    id: string;
    imagen: FileList | String;
    nombre: string;
}
export const FormMedal = (): JSX.Element => {
    const [urlImg, setUrlImg] = useState('');

    const router = useRouter()
    const { idAgency } = router.query;
    const {idMedal}=router.query;


    console.log(urlImg)

    const { register, setValue, reset, handleSubmit } = useForm<Inputs>();
    const renderImage = (evt: any) => {
        const blob = evt.target.files[0];
        const urlImg = URL.createObjectURL(blob);
        setUrlImg(urlImg);

    };
    const onSubmit: SubmitHandler<Inputs> = async (data) => {

        const docRef = idMedal
            ?  doc(db_client, `empresas_agencia/${idAgency}/medallas/${idMedal}`)
            : doc(collection(db_client, `empresas_agencia/${idAgency}/medallas`));

        const imgRef = ref(
            storage_client,
            `empresas_agencia/${idAgency}/medallas/${docRef.id}/${Date.now()}`
        );
        let imagen: string = '';

        if (!data.name) {
            toast.error("imgrese Nombre Porfavor...!")
            return;
        }


        if (data.img instanceof FileList) {
            await uploadBytes(imgRef, data.img[0]);
            imagen = await getDownloadURL(imgRef);
        } else {
            imagen = data.img;
        }

        console.log(typeof (data.benefic))

        let obj: Medalll = {
            id: docRef.id,
            beneficio: parseInt(data.benefic.toString()),
            descripcion: data.description,
            estado: true,
            imagen: imagen,
            nombre: data.name,

        };
        console.log(obj);
        await setDoc(docRef, obj);
        toast.success("Medalla Creada con Exito")

    }
     useEffect(() => {
        if (idAgency) {
            getDoc(doc(db_client, `/empresas_agencia/${idAgency}/medallas/${idMedal}`))
                .then((snap) => {
                    if (snap.exists()) {
                        const {
                            beneficio,
                            descripcion,
                            nombre,
                        } = snap.data();
                       
                        setValue('benefic', beneficio);
                        setValue('description', descripcion);
                        setValue('name', nombre);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, []);
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
