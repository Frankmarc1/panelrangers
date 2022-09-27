import { faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Dispatch, memo, SetStateAction } from 'react';
import { currencyFormat } from "../../../../../../components/Utils/formatNumbers";
import { useMap } from '../../stateManagement/mapContext';
import styles from "../../../../../../../styles/index.module.css";

interface Props {
  handleShow: Dispatch<SetStateAction<boolean>>;
}

export const ListAreas = memo(({ handleShow }: Props) => {
  const ctx = useMap();

  return (
    <div className='card border rounded-md'>
      <div className='card-header border-b flex'>
        <div className='flex justify-start w-[90%]'>
          <h2 className='card-title font-medium '>Mis areas</h2>
        </div>
        <div className='flex justify-end '>
          <button
            className='btn btn-sm bg-slate-50 text-black text-xl border-white hover:bg-slate-400 hover:border-white'
            onClick={() => handleShow(false)}>
            <FontAwesomeIcon icon={faXmark} className="text-black " />
          </button>
        </div>
      </div>

      <div className=' '>
        <ul className={`overflow-auto max-h-[28rem] ${styles.scroll}`}>
          {ctx?.areas
            .sort((a, b) => a.deliveryPrice - b.deliveryPrice)
            .map((area) => (
              <li
                onClick={() => ctx.selectArea(area.id)}
                key={area.id}
                className={` border w-full py-2 px-1 ${area.id === ctx.idArea && 'border border-primary bg-slate-300 rounded '
                  }`}>
                <div className='flex justify-between w-[100%]'>
                  <div className='w-[33.3%]'>
                    <p className='mb-0'> {area.name} </p>
                  </div>
                  <div className='w-[33.3%]'>
                    <span> {currencyFormat(area.deliveryPrice)} </span>
                  </div>
                  <div className='w-[33.3%]'>
                    <span> {area.timeAtention} min. </span>
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
});
