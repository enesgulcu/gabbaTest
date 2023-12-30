import React from 'react';
import BasketAddCustomer from './BasketAddCustomer';
import BasketAddPersonel from './BasketAddPersonel';
import { IoIosSave } from 'react-icons/io';

const CustomerAndPersonel = ({ FormProps, ErrorMessage }) => {
  return (
    <>
      <button
        type='submit'
        className='hover:scale-105 transition-all flex justify-center items-center p-2 text-white font-semibold bg-purple-500 rounded
              '
      >
        Teklifi Oluştur
        <IoIosSave size={22} className='text-white ml-2' />
      </button>

      <div className='w-full lg:w-1/2 lg:grid-cols-2 p-3 grid grid-cols-1 my-4 gap-2'>
        <BasketAddCustomer FormProps={FormProps} ErrorMessage={ErrorMessage} />
        <BasketAddPersonel FormProps={FormProps} ErrorMessage={ErrorMessage} />
      </div>
      <div className='w-1/2'>
        <textarea
          id='orderNote'
          name='orderNote'
          value={FormProps.values.orderNote}
          onChange={FormProps.handleChange}
          className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-full mb-4`}
          placeholder='Sepetteki ürünleriniz için genel bir not bölümü ekleyin...'
        ></textarea>
      </div>
    </>
  );
};

export default CustomerAndPersonel;
