import { useRef, useState } from 'react';
import { FaPenAlt, FaSave, FaTimesCircle } from 'react-icons/fa';

interface Props {
  value: string;
}

export const InlineInput = ({ value }: Props) => {
  const [edit, setEdit] = useState(false);
  const ref = useRef();

  return (
    <div className='w-auto'>
      {!edit ? (
        <p className='flex items-center'>
          {' '}
          {value}{' '}
          <FaPenAlt
            className='text-green-500 mx-2'
            onClick={() => setEdit(true)}
          />{' '}
        </p>
      ) : (
        <div className='flex w-auto items-center'>
          <input
            type='text'
            className='input input-bordered w-5/12 mr-2 input-sm'
            defaultValue={value}
          />
          <div className='flex'>
            <FaSave className='text-primary mr-2' />
            <FaTimesCircle
              className='text-error'
              onClick={() => setEdit(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
