'use client';
import React, { useState, useEffect } from 'react';
import LoadingScreen from '@/components/other/loading';
import CreateFinancialManagementComponent from './createFinancialManagement';
import { BiFilterAlt } from 'react-icons/bi';
import { IoClose } from 'react-icons/io5';
import { RxPlusCircled, RxTriangleRight } from 'react-icons/rx';
import ListFinancialComponent from './listFinancialManagement';
import { toast, ToastContainer } from 'react-toastify';
import { getAPI } from '@/services/fetchAPI';
import TestFinancialComponent from './testFinancialManagement';
import EditFinancialManagementComponent from './editFinancialManagement';

const FinancialManagementComponent = () => {
  // Veritabanındaki verileri bir state'de tutuyoruz.
  const [financialManagements, setFinancialManagements] = useState([]);
  // özel işlemler verisini ise bu state'de tutuyoruz.
  const [financialManagementsSpecial, setFinancialManagementsSpecial] =
    useState([]);
  // İşlem sırasını tutuyoruz.
  const [orderLength, setOrderLength] = useState(0);
  const [isloading, setIsloading] = useState(false);
  // Filter
  const [filterEnabled, setFilterEnabled] = useState(false);
  const [filterOperationName, setFilterOperationName] = useState('');
  const [filterPriceType, setFilterPriceType] = useState('');
  const [filterConditionStatus, setFilterConditionStatus] = useState('');
  const [filterConditionType, setFilterConditionType] = useState('');
  const [filterConditionValue, setFilterConditionValue] = useState('');
  const [filterConditionValue2, setFilterConditionValue2] = useState('');
  const [filterMathOperator, setFilterMathOperator] = useState('');
  const [filterFinalPrice, setFilterFinalPrice] = useState('');

  // Ekleme butonu
  const [createFinancialManagement, setCreateFinancialManagement] =
    useState(false);
  // Verileri listeleme butonu
  const [listFinancialManagementEnabled, setListFinancialManagementEnabled] =
    useState(true);
  // Düzenleme butonu
  const [editFinancialManagement, setEditFinancialManagement] = useState(false);
  // Düzenlemek istediğimiz veriyi tutuyoruz.
  const [editFinancialManagementData, setEditFinancialManagementData] =
    useState([]);
  // Test veri ekleme butonu
  const [testEnabled, setTestEnabled] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      setIsloading(true);
      const response = await getAPI('/createProduct/financialManagement');
      // İşlem sırasına göre düzeltiyoruz. Veritabanında sırasız bir şekilde tutuluyor.
      response.data.sort((a, b) => a.orderValue - b.orderValue);
      const responseSpecial = await getAPI(
        '/createProduct/financialManagementSpecial'
      );
      setFinancialManagementsSpecial(responseSpecial.data);
      if (!response || !responseSpecial) {
        throw new Error('Veri çekilemedi 2');
      }

      if (response.status !== 'success') {
        throw new Error('Veri çekilemedi');
      }

      // Özel işlemler hariç tüm verileri tutuyoruz.
      setFinancialManagements(response.data);
      setIsloading(false);

      // Veritabanından gelen maksimum işlem sırasını alıyoruz
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

        // Bu daha sonra ekleme ve güncelleme işlemlerinde işlem sırası belirlemek için kullanılacak.
        setOrderLength(maxOrder);
      }
    } catch (error) {
      setIsloading(false);
      toast.error(error.message);
    }
  };

  return (
    <>
      {isloading && <LoadingScreen isloading={isloading} />}
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='dark'
      />
      {editFinancialManagement ? (
        <div className='p-0 lg:p-2 w-full flex flex-col xl:flex-row justify-center lg:justify-between items-center shadow-lg lg:px-10 bg-gray-100 gap-2'>
          <div className='flex justify-center item-center flex-col lg:flex-row gap-2'>
            <button
              type='button'
              className='bg-red-600 rounded text-white p-4 flex flex-row gap-2 flex-nowrap justify-center items-center hover:cursor-pointer hover:scale-105 transition-all'
              onClick={() => {
                setEditFinancialManagement(false);
              }}
            >
              <IoClose size={25} /> Düzenlemeyi İptal Et
            </button>
          </div>
        </div>
      ) : (
        <div className='p-0 lg:p-2 w-full flex flex-col xl:flex-row justify-center lg:justify-between items-center shadow-lg lg:px-10 bg-gray-100 gap-2'>
          {
            // Filtreleme butonu
            listFinancialManagementEnabled && (
              <div className='flex justify-center item-center flex-col lg:flex-row gap-2'>
                {!testEnabled ? (
                  <button
                    onClick={() => {
                      setTestEnabled(!testEnabled);
                      setFilterEnabled(false);
                      setCreateFinancialManagement(false);
                    }}
                    type='button'
                    className='bg-purple-500 p-4 text-white rounded text-lg flex flex-row gap-2 flex-nowrap hover:cursor-pointer hover:scale-105 transition-all mt-2 lg:mt-0'
                  >
                    Verileri Test Et
                  </button>
                ) : (
                  <button
                    type='button'
                    className='bg-red-600 rounded text-white p-4 flex flex-row gap-2 flex-nowrap justify-center items-center hover:cursor-pointer hover:scale-105 transition-all'
                    onClick={() => {
                      setTestEnabled(false);
                    }}
                  >
                    <IoClose size={25} /> İptal Et
                  </button>
                )}

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
            {listFinancialManagementEnabled && !createFinancialManagement ? (
              <div className='flex flex-col lg:flex-row flex-wrap gap-2 lg:gap-4 justify-center items-center'>
                <button
                  type='button'
                  onClick={() => {
                    setCreateFinancialManagement(true);
                    setFilterEnabled(false);
                    setTestEnabled(false);
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
      )}
      {testEnabled && (
        <div className='mx-4 my-4'>
          <TestFinancialComponent
            financialManagements={financialManagements}
            isloading={isloading}
            setIsloading={setIsloading}
            getData={getData}
            toast={toast}
            testEnabled={testEnabled}
          />
        </div>
      )}
      {createFinancialManagement && (
        <div className='mx-4 my-4'>
          <CreateFinancialManagementComponent
            setOrderLength={setOrderLength}
            orderLength={orderLength}
            isloading={isloading}
            setIsloading={setIsloading}
            getData={getData}
            toast={toast}
            setCreateFinancialManagement={setCreateFinancialManagement}
          />
        </div>
      )}
      {editFinancialManagement ? (
        <EditFinancialManagementComponent
          setEditFinancialManagement={setEditFinancialManagement}
          editFinancialManagementData={editFinancialManagementData}
          orderLength={orderLength}
          toast={toast}
          financialManagementsSpecial={financialManagementsSpecial}
          setIsloading={setIsloading}
          getData={getData}
        />
      ) : (
        <ListFinancialComponent
          filterOperationName={filterOperationName}
          filterPriceType={filterPriceType}
          filterConditionStatus={filterConditionStatus}
          filterConditionType={filterConditionType}
          filterConditionValue={filterConditionValue}
          filterConditionValue2={filterConditionValue2}
          filterMathOperator={filterMathOperator}
          filterFinalPrice={filterFinalPrice}
          financialManagements={financialManagements}
          setFinancialManagements={setFinancialManagements}
          isloading={isloading}
          setIsloading={setIsloading}
          getData={getData}
          toast={toast}
          setEditFinancialManagement={setEditFinancialManagement}
          setEditFinancialManagementData={setEditFinancialManagementData}
          setCreateFinancialManagement={setCreateFinancialManagement}
          setFilterEnabled={setFilterEnabled}
          setTestEnabled={setTestEnabled}
        />
      )}
    </>
  );
};

export default FinancialManagementComponent;
