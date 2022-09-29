import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { collection, getDocs, query, where } from 'firebase/firestore';
import {
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  FormEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/router';
import { useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { db_client } from '../../../../firebase/client';
import { Company } from '../../../../components/types/Company';
import { validateRuc } from './utils/validateRuc';
import { cloneStore } from './helpers/cloneStore';
import { FloatingInput } from "../../../../components/Inputs/FloatingInput"

type Props = {
  isVisible: Boolean;
  onClose: Boolean;
  children?: JSX.Element | JSX.Element[];
};
export const CloneStore = ({ isVisible, onClose, children }: Props) => {

  const [loading, setLoading] = useState(false);
  const [loadingClone, setLoadingClone] = useState(false);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const router = useRouter();
  const { idBusiness } = router.query;
  const { idCompany } = useParams();
  const ref = useRef<HTMLInputElement>(null);

  if (!isVisible) return null;
  const handleClose = (e) => {
    if (e.target.id === "modalClone") onClose();
  }

  //logica
  const handleSubmit: FormEventHandler = async (e: FormEvent) => {
    e.preventDefault();

    if (!ref.current?.value) {
      toast.error('Valor no valido');
      document.getElementById("clone")?.focus();
      return;
    }
    const colRef = collection(db_client, 'empresas');
    let finalQuery = null;
    let value = ref.current?.value;
    let isRuc = value?.length === 11 && /^\d+$/.test(value);

    if (isRuc && !validateRuc(value)) {
      toast.error('R.U.C no es valido');

      return;
    }

    setLoading(true);

    if (isRuc) {
      finalQuery = query(colRef, where('dataSunat.ruc', '==', value));
    } else {
      finalQuery = query(
        colRef,
        where('contentProfile.nameComercial', '==', value.toUpperCase())
      );
    }

    if (finalQuery) {
      const snap = await getDocs(finalQuery);

      setCompanies(snap.docs.map((doc) => doc.data() as Company));

      setLoading(false);
    }
  }

  const handleSelect: ChangeEventHandler<HTMLInputElement> = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedCompanies((actualSelectedCompanies) => [
      ...actualSelectedCompanies,
      e.target.value,
    ]);
  };

  const handleClone = async () => {
    const el = document.getElementById('modalClone');
    console.log(el)
    if (selectedCompanies.length === 0) {
      toast.error('Selecione una empresa, para empezar a clonar');

      return;
    }

    if (!el) {
      toast.error('Ocurrio un problema al obtener los datos');
      return;
    }

    const idCommerce = el.dataset.id;

    setLoadingClone(true);

    const arrayPromises = selectedCompanies.map(async (id) => {
      const pathToStore = `empresas/${idCompany}/comercios/${idCommerce}`;

      return await cloneStore(id, pathToStore);
    });

    await Promise.all(arrayPromises);

    setLoadingClone(false);

    toast.error('Se clono el comercio correctamente');
  };

  return (

    <div
      className={`fixed inset-0 bg-black bg-opacity-10  flex justify-center`}
      id="modalClone"
      onClick={handleClose}
    >
      <div className='card bg-white w-2/5 rounded-md h-[35%] shadow-sm border mt-4'>
        <div className='card-header boder-b border-b border-slate-100 mx-2 my-2 flex w-[100%]'>
          <h5 className='flex w-[80%] ml-2 card-title text-medium'>Clonar Empresa</h5>
          <button className='flex justify-end btn btn-primary'
            onClick={() => onClose()}
          >
            cerrar
          </button>

        </div>
        <div className='card-body'>
          <form
            onSubmit={handleSubmit}
            autoComplete="off"

          >

            <div className='flex mr-3'>
              <div>
                <FloatingInput
                  type={"text"}
                  id="clone"
                  ref={ref}
                  placeholder='Buscar R.U.P o Nombre'
                />
              </div>
              <div>
                <button className='btn btn-primary'
                  type='submit'
                >
                  buscar
                </button>
              </div>


            </div>

          </form>

          <div>
            {loading ? (
              <p className='text-center fs-6'> Buscando... </p>
            ) : companies.length === 0 ? (
              <p className='text-center fs-6'> Sin resultados </p>
            ) : (
              <ul className='list-unstyled'>
                {companies.map((company) => (
                  <li key={company.id}>
                    <div className='form-check'>
                      <input
                        className='form-check-input'
                        type='checkbox'
                        value={company.id}
                        id='company-item'
                        onChange={handleSelect}
                      />
                      <label
                        className='form-check-label'
                        htmlFor='company-item'>
                        {company.contentProfile.nameComercial}
                      </label>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button
            className='btn btn-success w-full'
            onClick={handleClone}
            type='button'
            disabled={loadingClone}
          > {loadingClone ? 'Clonando...' : 'Clonar comercio'}</button>
        </div>

      </div>

      {children}
    </div>
  );
}
