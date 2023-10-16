'use client';
import React, { useState, useEffect } from 'react';
import LoadingScreen from '@/components/other/loading';
import CreateFinancialManagementComponent from './createFinancialManagement';
import { BiFilterAlt } from 'react-icons/bi';
import { IoClose } from 'react-icons/io5';
import { RxPlusCircled, RxTriangleRight } from 'react-icons/rx';
import ListFinancialComponent from './listFinancialManagement';
import { toast } from 'react-toastify';
import { getAPI } from '@/services/fetchAPI';

const FinancialManagementComponent = () => {
  const [isloading, setIsloading] = useState(false);
  const [filterEnabled, setFilterEnabled] = useState(false);
  const [listProductsEnabled, setListProductsEnabled] = useState(true);
  // Filter
  const [filterProductName, setFilterProductName] = useState('');
  const [filterProductCode, setFilterProductCode] = useState('');
  const [filterProductType, setFilterProductType] = useState('');
  const [filterProductCategory, setFilterProductCategory] = useState('');

  const [createFinancialManagement, setCreateFinancialManagement] =
    useState(false);
  const [financialManagements, setFinancialManagements] = useState([]);
  const [orderLength, setOrderLength] = useState(0);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const response = await getAPI('/createProduct/financialManagement');
      console.log('response:', response);
      const responseSpecial = await getAPI(
        '/createProduct/financialManagementSpecial'
      );
      console.log('responseSpecial: ', responseSpecial);
      setIsloading(false);
      if (response.status !== 'success') {
        throw new Error('Veri çekilemedi');
      }
      setFinancialManagements(response.data);
      if (response.data.length > 0) {
        let maxOrder = await response.data.reduce((max, item) => {
          const orderValue = item.orderValue;
          if (!isNaN(orderValue) && orderValue > max) {
            return orderValue;
          } else {
            return max;
          }
        }, 0);
        maxOrder = maxOrder + 1;
        setOrderLength(maxOrder);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  return (
    <>
      {isloading && <LoadingScreen isloading={isloading} />}
      <div className='p-0 lg:p-2 w-full flex flex-col xl:flex-row justify-center lg:justify-between items-center shadow-lg lg:px-10 bg-gray-100 gap-2'>
        {
          // Filtreleme butonu
          listProductsEnabled && (
            <div className='flex justify-center item-center flex-col lg:flex-row gap-2'>
              <div
                className={`${
                  filterEnabled ? 'bg-green-500' : 'bg-green-500'
                } p-4 text-white rounded text-lg flex flex-row gap-2 flex-nowrap hover:cursor-pointer hover:scale-105 transition-all mt-2 lg:mt-0`}
                onClick={() => setFilterEnabled(!filterEnabled)}
              >
                <div
                  className={`transition-all flex justify-center items-center gap-2 w-full h-full`}
                >
                  <BiFilterAlt size={25} />
                  {!filterEnabled && 'Filtre'}
                </div>
              </div>
              {filterEnabled && (
                <div className='rounded text-white flex justify-center items-center flex-col lg:flex-row gap-2 '>
                  <div className='flex justify-center items-center flex-col'>
                    <h3 className='text-black'>Ürün Kodu</h3>
                    <div className='border-2 border-gray-400 rounded-md'>
                      <input
                        type='text'
                        className=' outline-none border-none text-lg text-black bg-white p-2 rounded max-w-[200px]'
                        onChange={(e) => setFilterProductCode(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className='flex justify-center items-center flex-col'>
                    <h3 className='text-black'>Ürün Adı</h3>
                    <div className='border-2 border-gray-400 rounded-md'>
                      <input
                        type='text'
                        className=' outline-none border-none text-lg text-black bg-white p-2 rounded max-w-[200px]'
                        onChange={(e) => setFilterProductName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className='flex justify-center items-center flex-col'>
                    <h3 className='text-black'>Ürün Tipi</h3>
                    <div className='border-2 border-gray-400 rounded-md'>
                      <input
                        type='text'
                        className=' outline-none border-none text-lg text-black bg-white p-2 rounded max-w-[200px]'
                        onChange={(e) => setFilterProductType(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className='flex justify-center items-center flex-col'>
                    <h3 className='text-black'>Ürün Kategorisi</h3>
                    <div className='border-2 border-gray-400 rounded-md'>
                      <input
                        type='text'
                        className=' outline-none border-none text-lg text-black bg-white p-2 rounded max-w-[200px]'
                        onChange={(e) =>
                          setFilterProductCategory(e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        }
        {/*koleksiyon paneli - listesi - oluşturması işlemleri buradan yapılıyor. */}
        <div className='flex flex-col lg:flex-row flex-wrap justify-center items-center lg:gap-2'>
          {listProductsEnabled && !createFinancialManagement ? (
            <div className='flex flex-col lg:flex-row flex-wrap gap-2 lg:gap-4 justify-center items-center'>
              <button
                type='button'
                onClick={() => {
                  setCreateFinancialManagement(true);
                }}
                className={`bg-blue-500 text-white text-lg hover:cursor-pointer hover:scale-105 transition-all rounded p-4 flex flex-row gap-2 flex-nowrap justify-center items-center`}
              >
                <RxPlusCircled size={25} /> Yeni Finansal İşlem Ekle{' '}
                <RxTriangleRight size={25} className='rotate-90' />
              </button>
            </div>
          ) : (
            <button
              type='button'
              className='bg-red-600 rounded text-white p-4 flex flex-row gap-2 flex-nowrap justify-center items-center hover:cursor-pointer hover:scale-105 transition-all'
              onClick={() => {
                setCreateFinancialManagement(false);
              }}
            >
              <IoClose size={25} /> İptal Et
            </button>
          )}
        </div>
      </div>
      {createFinancialManagement && (
        <div className='mx-4 my-4'>
          <CreateFinancialManagementComponent orderLength={orderLength} />
        </div>
      )}
      <ListFinancialComponent
        financialManagements={financialManagements}
        setFinancialManagements={setFinancialManagements}
      />
    </>
  );
};

export default FinancialManagementComponent;
