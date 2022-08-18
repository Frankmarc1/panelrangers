import styled from '../FirebaseDataTable/styles/index.module.css';
export const Spinner = () => {
    return (
        <div className='flex justify-center'>
            <div className={`${styled.spinner}`}></div>
        </div>
    );
}