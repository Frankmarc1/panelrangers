import {
  CollectionReference,
  DocumentData,
  endAt,
  getDocs,
  limit,
  limitToLast,
  onSnapshot,
  orderBy,
  Query,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  startAfter,
  Unsubscribe,
} from 'firebase/firestore';
import { Spinner } from '../spinner/Spinner';
import React, { useEffect, useState } from 'react';

interface Props {
  qi: Query | CollectionReference;
  RowComponent: ({ values }: { values: any }) => JSX.Element;
  perPage?: number;
  headers: string[];
}

export const FirebaseDataTable = (props: Props) => {
  const [firstDoc, setFirstDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [lastDoc, setLastDoc] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [perPage, setPerPage] = useState<number>(props.perPage || 10);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  let unSubscribeNextPage: Unsubscribe | null = null;
  let unSubscribePrevPage: Unsubscribe | null = null;

  const fecthData = (snap: QuerySnapshot<DocumentData>) => {
    const data = snap.docs.map((doc) => doc.data());

    setFirstDoc(snap.docs[0] || null);
    setLastDoc(snap.docs[snap.docs.length - 1] || null);
    setData(data);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);

    const unSubscribe = onSnapshot(query(props.qi, limit(perPage)), fecthData);

    getDocs(props.qi).then((snap) => setTotal(snap.size));

    return () => {
      unSubscribe();
    };
  }, [perPage, props.qi]);

  const nextPage = () => {
    const q = query(
      props.qi,
      orderBy('id'),
      startAfter(lastDoc),
      limit(perPage)
    );

    if (unSubscribeNextPage) {
      unSubscribeNextPage();
    }

    unSubscribeNextPage = onSnapshot(q, fecthData);
    setPage((actualPage) => actualPage + 1);
  };

  const prevPage = () => {
    const q = query(
      props.qi,
      orderBy('id'),
      endAt(firstDoc),
      limitToLast(perPage)
    );

    if (unSubscribePrevPage) {
      unSubscribePrevPage();
    }

    unSubscribePrevPage = onSnapshot(q, fecthData);

    setPage((actualPage) => actualPage - 1);
  };

  return (
    <div className=''>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className={`overflow-auto`} style={{ height: '32.9rem' }}>
            <table className={`table w-full border text-sm mb-4 `}>
              <thead className='border'>
                <tr className='border'>
                  {React.Children.toArray(
                    props.headers.map((header) => <th>{header}</th>)
                  )}
                </tr>
              </thead>
              <tbody>
                {React.Children.toArray(
                  data.map((d) => <props.RowComponent values={d} />)
                )}
              </tbody>
            </table>
          </div>
          <div className='flex justify-end items-center'>
            <div className='flex items-center mr-3'>
              <p className='mr-2'>Numero de filas</p>
              <select
                className='select select-sm'
                onChange={(e) => setPerPage(parseInt(e.target.value))}
                defaultValue={perPage}
              >
                <option value='10'> 10 </option>
                <option value='15'> 15 </option>
                <option value='20'> 20 </option>
                <option value='40'> 40 </option>
              </select>
            </div>

            <p className='mr-3'>
              <span className='mr-2'>{page * perPage - (perPage - 1)}</span>
              <span className='mr-2'>-</span>
              <span className='mr-2'>{page * perPage}</span>
              <span className='mr-2'>de </span>
              <span>{Math.ceil(total / perPage)} </span>
            </p>

            <div className='btn-group'>
              <button
                className='btn btn-sm bg-white border-blue-200 text-slate-900 font-bold hover:bg-blue-500 hover:border-white'
                onClick={prevPage}
                disabled={page === 1}
              >
                «
              </button>
              <button className='btn btn-sm bg-white border-blue-200 text-slate-900 font-bold hover:bg-blue-500 hover:border-white'>
                {page}
              </button>
              <button
                className='btn btn-sm bg-white border-blue-200 text-slate-900 font-bold hover:bg-blue-500 hover:border-white'
                onClick={nextPage}
                disabled={page === Math.ceil(total / perPage)}
              >
                »
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
