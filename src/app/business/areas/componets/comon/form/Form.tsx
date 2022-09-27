import { yupResolver } from '@hookform/resolvers/yup';
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
import { toast } from 'react-toastify';
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
    const router=useRouter()
    const {idBusiness}=router.query;
    const {idComercio}=router.query;

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
                toast('Puntos no seleccionados');

                return;
            }

            if (context?.points && context.points.length < 3) {
                toast('El area no valida debe tener al menos 3 puntos');

                return;
            }
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
        <div className='card-body flex justify-between align-items-center'>

            <form
                id='area_form'
                className='align-items-end'
                onSubmit={handleSubmit(onSubmit)}
                autoComplete={'off'}>
                <div className='flex'>
                    <div className='form-floating  mb-md-0 me-md-2'>
                        <input
                            id='name'
                            type='text'
                            placeholder='Nombre'
                            className='form-control'
                            {...register('name_area')}
                        />
                        <label htmlFor='name'>Nombre</label>
                    </div>

                    <div className='form-floating mb-3 mb-md-0 me-md-2'>
                        <input
                            id='price'
                            type='number'
                            placeholder='Precio'
                            className='form-control'
                            {...register('price_area')}
                            step='0.01'
                        />
                        <label htmlFor='price'>Precio</label>
                    </div>

                    <div className='form-floating mb-3  mb-md-0 me-md-2'>
                        <input
                            id='ta'
                            step='1'
                            type='number'
                            placeholder='Tiempo de atención'
                            className='form-control'
                            {...register('time_area')}
                        />
                        <label htmlFor='ta'>Tiempo de atencion</label>
                    </div>

                    <div className='me-md-2 mb-3 mb-md-0 d-flex align-items-center'>
                        {loading ? (
                            <div className='spinner-border' role='status'>
                                <span className='visually-hidden'>Loading...</span>
                            </div>
                        ) : (
                            <>
                                <button type='submit' className='btn btn-success  me-2'>
                                    Guardar
                                </button>

                                {context?.idArea && (
                                    <button
                                        type='button'
                                        className='btn btn-danger mb-3 mb-md-0 me-md-2'
                                        onClick={() => deleteArea(context.idArea)}>
                                        Eliminar area
                                    </button>
                                )}

                                <button
                                    type='button'
                                    className='btn btn-secondary text-white'
                                    onClick={hiddenForm}>
                                    Cancelar
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </form>
        </div>

    );
};
