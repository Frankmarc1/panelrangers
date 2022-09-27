import { Dispatch, memo, SetStateAction } from 'react';
import { currencyFormat } from "../../../../../../components/Utils/formatNumbers";
import { useMap } from '../../stateManagement/mapContext';

interface Props {
  handleShow: Dispatch<SetStateAction<boolean>>;
}

export const ListAreas = memo(({ handleShow }: Props) => {
  const ctx = useMap();

  return (
    <div className='card'>
      <div className='card-header'>
        <h2 className='card-title'>Mis areas</h2>
        <div className='card-tools'>
          <button
            className='btn btn-close text-reset'
            onClick={() => handleShow(false)}></button>
        </div>
      </div>
      <div className='card-body'>
        <ul className='list-group'>
          {ctx?.areas
            .sort((a, b) => a.deliveryPrice - b.deliveryPrice)
            .map((area) => (
              <li
                onClick={() => ctx.selectArea(area.id)}
                key={area.id}
                className={`list-group-item cursor-pointer flex justify-content-between align-items-center ${
                  area.id === ctx.idArea && 'border border-primary'
                }`}>
                <p className='mb-0'> {area.name} </p>
                <span> {currencyFormat(area.deliveryPrice)} </span>
                <span> {area.timeAtention} min. </span>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
});
