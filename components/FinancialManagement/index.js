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
import TestFinancialComponent from './testFinancialManagement';
import EditFinancialManagementComponent from './editFinancialManagement';

const FinancialManagementComponent = () => {
  // Veritabanındaki verileri bir state'de tutuyoruz.
  const [financialManagements, setFinancialManagements] = useState([]);
  const [filteredFinancialManagements, setFilteredFinancialManagements] =
    useState([]);
  const [mergedFinancialManagements, setMergedFinancialManagements] = useState(
    []
  );

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
  const [filterMathOperator, setFilterMathOperator] = useState('');
  const [filterFinalPrice, setFilterFinalPrice] = useState('');
  const [filterOrderValue, setFilterOrderValue] = useState('');

  // Ekleme butonu
  const [createFinancialManagement, setCreateFinancialManagement] =
    useState(false);
  // Verileri listeleme butonu
  const [listFinancialManagementEnabled, setListFinancialManagementEnabled] =
    useState(true);
  // Özel İşlemler Listeleme butonu
  const [showSpecialFinancialManagement, setShowSpecialFinancialManagement] =
    useState(false);
  const [
    showSpecialFinancialManagementData,
    setShowSpecialFinancialManagementData,
  ] = useState([]);
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
      const response = await getAPI('/financialManagement');
      // İşlem sırasına göre düzeltiyoruz. Veritabanında sırasız bir şekilde tutuluyor.
      response.data.sort((a, b) => a.orderValue - b.orderValue);
      const responseSpecial = await getAPI('/financialManagementSpecial');
      setFinancialManagementsSpecial(responseSpecial.data);
      if (!response || !responseSpecial) {
        throw new Error('Veri çekilemedi 2');
      }

      if (response.status !== 'success') {
        throw new Error('Veri çekilemedi');
      }

      // Özel işlemler hariç tüm verileri tutuyoruz.
      setFinancialManagements(response.data);
      setFilteredFinancialManagements(response.data);

      responseSpecial.data.forEach((item) => {
        const specialId = item.financialManagementId;
        response.data.forEach((item2) => {
          if (item2.id === specialId) {
            // eşleşme sağlanırsa response.data içerisine eşleşen tüm verileri ekliyoruz.
            // birden fazla eşleşen olabilir.
            // item2 içine bir array oluştur ve eşleşen tüm verileri içine at.
            if (!item2.special) {
              item2.special = [];
            }
            item2.special.push(item);
          }
        });
      });

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

  const filterSpecialFinancialManagement = (id) => {
    const filteredData = financialManagementsSpecial.filter((item) => {
      return item.financialManagementId === id;
    });
    setShowSpecialFinancialManagementData(filteredData);
  };

  return (
    <>
      {isloading && <LoadingScreen isloading={isloading} />}
      {showSpecialFinancialManagement && (
        <div
          className={`cursor-default w-screen absolute bg-black bg-opacity-90 z-50 py-4 min-h-screen max-w-full`}
        >
          <div className='flex-col w-full h-full flex justify-center items-center'>
            <div className='w-auto flex justify-center items-center flex-col font-bold'>
              {/* // UPDATE EKRANI VERİ BİLGİSİ Aşağıdadır*/}
              <div className='w-full'>
                <div className='bg-white overflow-hidden shadow-md rounded-lg'>
                  <div className='p-2'>
                    <h3 className='text-lg leading-6 font-medium text-gray-900 text-center'>
                      ÖZEL İŞLEM VERİLERİ
                    </h3>
                  </div>
                  <div className='p-2'>
                    <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                      <thead className='text-md text-gray-700 bg-gray-50 dark:bg-blue-500 dark:text-white'>
                        <tr scope='col' className='bg-blue-600 text-white'>
                          <th className='text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2'>
                            İşlem Sırası
                          </th>
                          <th className='text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2'>
                            Matematik Operatörü
                          </th>
                          <th className='text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2'>
                            Özel Değeri
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {showSpecialFinancialManagementData.length > 0 &&
                          showSpecialFinancialManagementData.map(
                            (item, index) => (
                              <tr key={index} className='border-b'>
                                <td className='border-r'>
                                  <div className='flex justify-center items-center h-full mt-2 w-full text-center py-2'>
                                    <div className='bg-black text-white rounded-full flex justify-center items-center w-6 h-6 text-center'>
                                      {index + 1}
                                    </div>
                                  </div>
                                </td>
                                <td className='text-center py-2 border-r text-xl'>
                                  {item.mathOperatorSpecial}
                                </td>
                                <td className='text-center py-2 border-r px-2'>
                                  {item.conditionValueSpecial ==
                                  'Özel Barem Ekle'
                                    ? item.ozelBaremValue
                                    : item.conditionValueSpecial}
                                </td>
                              </tr>
                            )
                          )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* // UPDATE EKRANI VERİ BİLGİSİ Yukarıdadır*/}
            </div>
            <button
              onClick={() => setShowSpecialFinancialManagement(false)}
              className='bg-red-600 m-2 p-2 rounded-full cursor-pointer hover:scale-105 transition hover:rotate-6 hover:border-2 hover:border-white'
            >
              <IoClose color='white' size={40} />
            </button>
          </div>
        </div>
      )}
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
                {!filterEnabled && (
                  <div>
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
                  </div>
                )}
                {!filterEnabled ? (
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
                      Filtre
                    </div>
                  </div>
                ) : (
                  <button
                    type='button'
                    className='bg-red-600 rounded text-white p-4 flex flex-row gap-2 flex-nowrap justify-center items-center hover:cursor-pointer hover:scale-105 transition-all'
                    onClick={() => {
                      setFilterEnabled(false);
                    }}
                  >
                    <IoClose size={25} /> İptal Et
                  </button>
                )}

                {filterEnabled && (
                  <div className='rounded text-white flex justify-center items-center flex-col lg:flex-row gap-2 '>
                    <div className='flex justify-center items-center flex-col'>
                      <h3 className='text-black'>İşlem İsmi</h3>
                      <div className='border-2 border-gray-400 rounded-md'>
                        <input
                          type='text'
                          className=' outline-none border-none text-lg text-black bg-white p-2 rounded max-w-[200px]'
                          onChange={(e) =>
                            setFilterOperationName(e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className='flex justify-center items-center flex-col'>
                      <h3 className='text-black'>Fiyat Tipi</h3>
                      <div className='border-2 border-gray-400 rounded-md'>
                        <input
                          type='text'
                          className=' outline-none border-none text-lg text-black bg-white p-2 rounded max-w-[200px]'
                          onChange={(e) => setFilterPriceType(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className='flex justify-center items-center flex-col'>
                      <h3 className='text-black'>Matematik Operatörü</h3>
                      <div className='border-2 border-gray-400 rounded-md'>
                        <input
                          type='text'
                          className=' outline-none border-none text-lg text-black bg-white p-2 rounded max-w-[200px]'
                          onChange={(e) =>
                            setFilterMathOperator(e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div className='flex justify-center items-center flex-col'>
                      <h3 className='text-black'>Sonuç Değeri</h3>
                      <div className='border-2 border-gray-400 rounded-md'>
                        <input
                          type='text'
                          className=' outline-none border-none text-lg text-black bg-white p-2 rounded max-w-[200px]'
                          onChange={(e) => setFilterFinalPrice(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className='flex justify-center items-center flex-col'>
                      <h3 className='text-black'>İşlem Sırası</h3>
                      <div className='border-2 border-gray-400 rounded-md'>
                        <input
                          type='number'
                          min={1}
                          className=' outline-none border-none text-lg text-black bg-white p-2 rounded max-w-[200px]'
                          onChange={(e) => setFilterOrderValue(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          }
          {/* Filtereleme işlemleri buradan yapılıyor. */}
          {!filterEnabled && (
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
          )}
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
            mergedFinancialManagements={mergedFinancialManagements}
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
          financialManagementsSpecial={financialManagementsSpecial}
          filterOperationName={filterOperationName}
          filterPriceType={filterPriceType}
          filterMathOperator={filterMathOperator}
          filterFinalPrice={filterFinalPrice}
          filterOrderValue={filterOrderValue}
          financialManagements={financialManagements}
          setFinancialManagements={setFinancialManagements}
          filteredFinancialManagements={filteredFinancialManagements}
          setFilteredFinancialManagements={setFilteredFinancialManagements}
          isloading={isloading}
          setIsloading={setIsloading}
          getData={getData}
          toast={toast}
          setEditFinancialManagement={setEditFinancialManagement}
          setEditFinancialManagementData={setEditFinancialManagementData}
          setCreateFinancialManagement={setCreateFinancialManagement}
          setFilterEnabled={setFilterEnabled}
          setTestEnabled={setTestEnabled}
          showSpecialFinancialManagement={showSpecialFinancialManagement}
          setShowSpecialFinancialManagement={setShowSpecialFinancialManagement}
          filterSpecialFinancialManagement={filterSpecialFinancialManagement}
        />
      )}
    </>
  );
};

export default FinancialManagementComponent;
