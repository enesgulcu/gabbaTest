'use client';
import React, { useState, useEffect } from 'react';
import FinancialManagementCalculate from '@/functions/others/financialManagementCalculate';

function TestFinancialComponent({ financialManagements, toast }) {
  const [result, setResult] = useState(null);
  const [price, setPrice] = useState(null);
  const [stock, setStock] = useState(1);

  async function previewCalculation() {
    if (
      price === undefined ||
      price === null ||
      price === '' ||
      price <= 0 ||
      price === NaN
    ) {
      return toast.error('Fiyat alanı boş bırakılamaz veya 0 olamaz');
    }

    const result = await FinancialManagementCalculate(price, stock);
    setResult(result);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    previewCalculation();
  };

  useEffect(() => {
    setResult(null);
  }, []);

  return (
    <>
      <div className='flex justify-center'>
        <div className='bg-gray-100 p-3 rounded border-2 w-fit'>
          <h1 className='text-lg font-semibold text-center'>
            Verileri Test Et
          </h1>
          <form
            onSubmit={(e) => handleSubmit(e)}
            className='flex flex-col gap-3'
          >
            <div className='inputGroup'>
              <label htmlFor='price'>Fiyat: </label>
              <input
                id='price'
                onChange={(e) => setPrice(e.target.value)}
                className=' transition-all border border-gray-300 rounded-md p-2 w-[400px] m-2]'
                type='number'
                inputMode='decimal'
                step='any'
                placeholder='Fiyat'
              />
            </div>
            <div className='inputGroup'>
              <label htmlFor='stock'>Stok: </label>
              <input
                id='stock'
                onChange={(e) => setStock(e.target.value)}
                className=' transition-all border border-gray-300 rounded-md p-2 w-[400px] m-2]'
                type='number'
                min='0'
                placeholder='Stok'
              />
            </div>
            <div className='flex justify-center'>
              <button
                type='submit'
                onClick={() => previewCalculation()}
                className='bg-blue-500 text-white p-3 hover:scale-105 transition-all rounded-md w-fit'
              >
                Hesapla
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className='flex flex-col justify-center items-center'>
        {result && (
          <h1 className='font-semibold text-2xl mt-2'>Hesaplama Sonuçları</h1>
        )}
        {result &&
          financialManagements.map((item, index) => {
            return (
              <div
                className={`${
                  item.condition && result[index] == result[index - 1]
                    ? 'bg-red-100'
                    : 'bg-gray-100'
                } p-3 rounded border-2 flex flex-col gap-1 mt-2 w-1/2`}
                key={item.id}
              >
                <div className='flex justify-between'>
                  <span className='flex justify-center items-center w-[25px] h-[25px] rounded-full bg-black text-white'>
                    {index + 1}
                  </span>
                  <p>
                    {item.operationName} (
                    <span className='font-semibold '>
                      {index == 0 ? price : result[index - 1]}
                    </span>
                    )
                    {item.mathOperator == '+' && (
                      <span className='font-semibold text-green-500'>
                        {item.mathOperator}
                        {item.finalPrice}
                      </span>
                    )}
                    {item.mathOperator == '+%' && (
                      <span className='font-semibold text-green-500'>
                        {item.mathOperator}
                        {item.finalPrice}
                      </span>
                    )}
                    {item.mathOperator == '-' && (
                      <span className='font-semibold text-red-500'>
                        {item.mathOperator}
                        {item.finalPrice}
                      </span>
                    )}
                    {item.mathOperator == '-%' && (
                      <span className='font-semibold text-red-500'>
                        {item.mathOperator}
                        {item.finalPrice}
                      </span>
                    )}
                  </p>
                  <p className='font-semibold'>Sonuç: {result[index]}</p>
                </div>
                {item.condition && result[index] == result[index - 1] && (
                  <p className='text-center'>
                    {item.conditionValue2 != '' ? (
                      <p>
                        <span className='font-semibold'>{`${item.conditionValue} < ${result[index]} > ${item.conditionValue2} `}</span>{' '}
                        bu koşul sağlanamadığı için bu işlem yapılmadı. bu koşul
                        sağlanamadığı için bu işlem yapılmadı.
                      </p>
                    ) : (
                      <p>
                        <span className='font-semibold'>{`${result[index]} ${item.conditionType} ${item.conditionValue} `}</span>
                        bu koşul sağlanamadığı için bu işlem yapılmadı.
                      </p>
                    )}
                  </p>
                )}
              </div>
            );
          })}

        {result && result.length == 0 && (
          <p className='text-red-500 font-semibold text-lg'>
            Hesaplanacak Veri Bulunamadı!
          </p>
        )}
      </div>
    </>
  );
}

export default TestFinancialComponent;
