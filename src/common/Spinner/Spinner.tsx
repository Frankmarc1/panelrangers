import styled from './styles.module.css';

export const Spinner = () => {
  return (
    <div className='flex flex-col justify-center items-center bg-200 w-screen h-screen'>
      <div className={styled['sk-chase']}>
        <div className={styled['sk-chase-dot']}></div>
        <div className={styled['sk-chase-dot']}></div>
        <div className={styled['sk-chase-dot']}></div>
        <div className={styled['sk-chase-dot']}></div>
        <div className={styled['sk-chase-dot']}></div>
        <div className={styled['sk-chase-dot']}></div>
      </div>
      <p className='text-2xl uppercase font-bold my-3'>Cargando...</p>
    </div>
  );
};
