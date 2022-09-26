import { doc, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/router';
import { Children, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from '../../../components/spinner/Spinner';
import { db_client } from '../../../firebase/client';

const days = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
    'Sabado',
];

interface Timers {
    startTime: number;
    endTime: number;
}

interface Day {
    name: string;
    timers: Timers[];
}

function formatTimer(timer: number) {
    const response = timer / 60000 / 60;
    let hours = Math.floor(response);

    let min = response - hours;

    min = Math.round(min * 60);

    return `${hours}:${`${min}`.length === 1 ? `${min}0` : min}`;
}

const Horarys = () => {

    const [horary, setHorary] = useState<Day[]>();
    const [loading, setLoading] = useState<boolean>(true);
    const [name, setName] = useState<string>();
    const router = useRouter();
    const { idBusiness } = router.query;
    const { idComercio } = router.query;
    console.log(idBusiness)
    console.log(idComercio)

    useEffect(() => {
        const unSubscribre = onSnapshot(
            doc(db_client, `/empresas/${idBusiness}/comercios/${idComercio}`),
            (snap) => {
                if (snap.exists()) {
                    const data = snap.data();
                    let horary: Day[] = [];

                    if (data?.daysAtention) {
                        days.forEach((day, index) => {
                            if (data?.daysAtention[index + 1]) {
                                horary.push({
                                    name: day,
                                    timers: data.daysAtention[index + 1],
                                });
                            }
                        });
                    }

                    setName(data.nombre);
                    setHorary(horary);

                }

                setLoading(false);
            }

        );


        return unSubscribre;
    }, []);

    return (


        <div className='card'>
            {loading ? (
                <Spinner />
            ) : (
                horary && (
                    <>
                        <div className='card border bg-slate-50 '>
                            <div className='card-header border-b'>
                                <h1 className='card-title text-md text-medium ml-[2rem] py-1'> Horario del comercio {name} </h1>
                            </div>
                            <div className='card-body mt-1 pt-0'>
                                <div className='flex  justify-between'>
                                    <div>
                                        <h2 className='text-xl text-medium'>Días</h2>
                                        <div className='block'>
                                            {Children.toArray(
                                                horary.map((column: Day) => (
                                                    <div className='py-4'>
                                                        <h4 className='text-medium my-0'>{column.name}</h4>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className='text-xl text-medium'>Hora de inicio</h2>
                                        <div className='block'>
                                            {Children.toArray(
                                                horary.map((column: Day) =>
                                                    column.timers.map((timmer) => (
                                                        <div className='py-4'>
                                                            <p className='text-medium'>
                                                                {formatTimer(timmer.startTime)}
                                                            </p>
                                                        </div>
                                                    ))
                                                )
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h2 className='text-xl text-medium'>Hora de cierre</h2>
                                        <div className='block'>
                                            {Children.toArray(
                                                horary.map((column: Day) =>
                                                    column.timers.map((timmer) => (
                                                        <div className='py-4'>
                                                            <p className='text-medium'>
                                                                {formatTimer(timmer.endTime)}
                                                            </p>
                                                        </div>
                                                    ))
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )
            )}
        </div>

    );
};
export default Horarys;
