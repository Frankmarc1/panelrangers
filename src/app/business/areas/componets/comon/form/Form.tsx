import { FaSave } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { MdDeleteForever, MdCancel } from "react-icons/md";
import { FloatingInput } from '../../../../../../components/Inputs/FloatingInput';
import {
    arrayUnion,
    doc,
    GeoPoint,
    getDoc,
    updateDoc,
} from 'firebase/firestore';
import { useRouter } from 'next/router';
import { MouseEventHandler, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

import { db_client } from '../../../../../../firebase/client';

import { Area, useMap } from '../../stateManagement/mapContext';
export type Inputs = {
    name_area: string;
    price_area: number;
    time_area: number;
};

type ls = { latitude: number; longitude: number };

type Props = {
    hiddenForm: MouseEventHandler;
};

export const Form = ({ hiddenForm }: Props): JSX.Element => {
    const [loading, setLoading] = useState(false);
    const [nameArea, setNameArea] = useState<string>('');
    const { register, setValue, handleSubmit, reset } = useForm<Inputs>();
    const context = useMap();
    const router = useRouter()
    const { idBusiness } = router.query;
    const { idComercio } = router.query;

    useEffect(() => {
        if (context?.idArea) {
            let actualArea = context?.areas.find(
                (area) => area.id === context.idArea
            );

            let actualIndex = context?.areas.findIndex(
                (area) => area.id === context.idArea
            );

            if (actualArea) {
                const { deliveryPrice, name, timeAtention } = actualArea;

                setValue('name_area', name);
                setValue('price_area', deliveryPrice);
                setValue('time_area', timeAtention);

                if (typeof actualIndex === 'number') {
                    setNameArea(`${actualIndex + 1}. ${name}`);
                }
            }
        }
    }, [context?.idArea]);

    const deleteArea = async (id: number | undefined) => {
        let filterArea = context?.areas.filter((area) => area.id !== id);

        Swal.fire({
            icon: 'question',
            title: `Esta seguro de eliminar el area ${nameArea}, esta accion es irreversible`,
            showCancelButton: true,
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Si, eliminar',
        }).then(async (res) => {
            if (res.isConfirmed) {
                await updateDoc(
                    doc(db_client, `/empresas/${idBusiness}/comercios/${idComercio}`),
                    {
                        areas: filterArea,
                    }
                );

                (hiddenForm as Function)();
            }
        });
    };

    const onSubmit: SubmitHandler<Inputs> = async (fields) => {
        const upload = {
            deliveryPrice: fields.price_area,
            name: fields.name_area,
            status: true,
            timeAtention: fields.time_area,
            id: Date.now(),
        };
        let msg = '';
        const docRef = doc(db_client, `/empresas/${idBusiness}/comercios/${idComercio}`);

        if (!context?.idArea) {
            if (context?.points.length === 0) {
                toast.error('Puntos no seleccionados');
                return;
            }

            if (context?.points && context.points.length < 3) {
                toast.error('El area no valida debe tener al menos 3 puntos');
                return;
            }
        }
        if (!fields.name_area) {
            toast.error("Ingrese Nombre de Area.")
            document.getElementById("nombre")?.focus();
            return;

        }
      
        if (fields.name_area.trim().length < 3) {
            toast.error("Area No Valida.")
            document.getElementById('nombre')?.focus();
            return;
        }
        if (!fields.price_area) {
            toast.error("Ingrese Precio.")
            document.getElementById("precio")?.focus();
            return;

        }
        //|| fields.name_area.match(/[0-9]/)
        if (fields.price_area <= 0) {
            toast.error("Precio No Valida.")
            document.getElementById('precio')?.focus();
            return;
        }
        if (!fields.time_area) {
            toast.error("Ingrese Tiempo de Atencion.")
            document.getElementById("tiempo")?.focus();
            return;
        }
        if (fields.time_area <= 0) {    
            toast.error("Tiempo No Valido.")
            document.getElementById('tiempo')?.focus();
            return;
        }

        try {
            setLoading(true);

            if (context?.idArea) {
                const points = localStorage.getItem(context.idArea + '');
                const snap = await getDoc(docRef);
                const data = snap.data();
                let areas = data?.areas || [];
                let newArea: GeoPoint[] = [];
                let newAreas = [];

                if (points) {
                    newArea = JSON.parse(points).map(
                        (point: ls) => new GeoPoint(point.latitude, point.longitude)
                    );
                }

                if (areas) {
                    if (newArea.length !== 0) {
                        newAreas = areas.map((area: Area) => {
                            if (area.id === context.idArea) {
                                return {
                                    ...upload,
                                    distributionArea: newArea,
                                };
                            }
                            return area;
                        });
                    } else {
                        newAreas = areas.map((area: Area) => {
                            if (area.id === context.idArea) {
                                return {
                                    ...upload,
                                    distributionArea: area.distributionArea,
                                };
                            }
                            return area;
                        });
                    }
                }

                if (newArea) {
                    await updateDoc(docRef, {
                        areas: newAreas,
                    });
                }

                msg = 'Area actualizada correctamente.';

                localStorage.removeItem(context.idArea + '');
            } else {
                const area = context?.points.map(
                    ({ coors }) => new GeoPoint(coors.lat(), coors.lng())
                );

                await updateDoc(docRef, {
                    areas: arrayUnion({
                        ...upload,
                        distributionArea: area,
                    }),
                });

                msg = 'Area creada con exito';
            }

            reset();
            context?.clearPoints();

            (hiddenForm as Function)();

            toast(msg);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='card-body flex justify-between align-items-center mt-[-2rem]'>
            <form
                id='area_form'
                className='align-items-end'
                onSubmit={handleSubmit(onSubmit)}
                autoComplete={'off'}>
                <div className='flex  ml-[-4rem] '>
                    <div className='mr-2'>
                        <FloatingInput
                            placeholder='Nombre'
                            type={'text'}
                            id="nombre"
                            {...register('name_area')}
                        />

                    </div>

                    <div className='mr-2'>
                        <FloatingInput
                            type='number'
                            placeholder='Precio'
                            {...register('price_area')}
                            step='0.01'
                            id='precio'
                        />

                    </div>

                    <div className='mr-2'>
                        <FloatingInput
                            step='1'
                            type='number'
                            id='tiempo'
                            placeholder='Tiempo de atención'
                            {...register('time_area')}
                        />
                    </div>

                    <div className='flex '>
                        {loading ? (
                            <div className='spinner-border' role='status'>
                                <span className='visually-hidden'>Loading...</span>
                            </div>
                        ) : (
                            <>
                                <button type='submit' className='btn btn-md btn-success mb-2 text-xl text-primary mr-2'>
                                    <FaSave />
                                </button>

                                {context?.idArea && (
                                    <button
                                        type='button'
                                        className='btn btn-md btn-error mb-3  text-xl  text-black mr-2'
                                        onClick={() => deleteArea(context.idArea)}>
                                        <MdDeleteForever />
                                    </button>
                                )}

                                <button
                                    type='button'
                                    className='btn  btn-md btn-secondary text-sm text-xl text-white'
                                    onClick={hiddenForm}>
                                    <MdCancel />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </form>
        </div>

    );
};
