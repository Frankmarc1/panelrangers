import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FaPenAlt, FaSave, FaTimesCircle } from 'react-icons/fa';

interface Props {
  value: string;
  onSave: (a: string, ...b: any) => Promise<any>;
}

export const InlineInput = ({ value, onSave }: Props) => {
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    setLoading(true);
    const value = ref.current?.value;

    if (!value) {
      toast.error('Valor no referenciado.');

      return;
    }

    await onSave(value);

    setLoading(false);
    setEdit(false);
  };

  return (
    <div className='w-auto'>
      {!edit ? (
        <p className='grid grid-cols-2'>
          {' '}
          {value}{' '}
          <FaPenAlt
            className='text-green-500 mx-2'
            onClick={() => setEdit(true)}
          />{' '}
        </p>
      ) : (
        <div className='flex items-center'>
          <input
            type='text'
            className='input input-bordered w-1/5 mr-2 input-sm'
            defaultValue={value}
            ref={ref}
          />
          <div className='flex'>
            {loading ? (
              <button className='btn btn-sm btn-ghost loading'></button>
            ) : (
              <>
                <FaSave className='text-primary mr-2' onClick={handleSave} />
                <FaTimesCircle
                  className='text-error'
                  onClick={() => setEdit(false)}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
