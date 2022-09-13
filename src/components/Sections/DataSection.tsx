
import {
    doc,
    DocumentData,
    DocumentReference,
    getDoc,
} from 'firebase/firestore';
import { FaSave, FaPencilAlt } from "react-icons/fa";
import { useEffect, useState } from 'react';
import { Spinner } from '../spinner/Spinner';
import { db_client } from '../../firebase/client';

type Props = {
    name: string;
    desc: string;
    data: DocumentReference[];
};

export const DataSection = ({ name, desc, data}: Props) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [array, setArray] = useState<DocumentData[]>([]);

    useEffect(() => {
        const newData = data.map(async (d) => {
            const snap = await getDoc(doc(db_client, d.path));

            return snap.data();
        });

        Promise.allSettled(newData)
            .then((res) => {
                let info: DocumentData[] = [];
                res.forEach((re) => {
                    if (re.status === 'fulfilled') {
                        if (re.value) {
                            info.push(re.value);
                        }
                    }
                });

                setArray(info);
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <>
            {
                loading ? (
                    <Spinner />
                ) : (
                    <div>
                        <div className="p-6 flex flex-start" >
                            <div className="block">
                                <h3 className="flex flex-start card-title">{name}</h3>
                                <p className="flex flex-start">{desc}</p>

                            </div>

                        </div>
                        <div className='flex'>
                            {array.map((d: DocumentData) => (
                                <div className="card w-auto bg-base-100 shadow-sm border border-slate-300  ml-5 mb-4 " >
                                    <div className="card-body p-3">
                                        <h2 className="card-title" >
                                            {d.name}
                                        </h2>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                )

            }

        </>
    );
};
