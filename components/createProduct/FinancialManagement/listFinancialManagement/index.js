'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAPI, postAPI } from '@/services/fetchAPI';
import FinancialManagementCalculate from '@/functions/others/financialManagementCalculate';

function ListFinancialComponent({
  filterOperationName,
  filterPriceType,
  filterConditionStatus,
  filterConditionType,
  filterConditionValue,
  filterConditionValue2,
  filterMathOperator,
  filterFinalPrice,
  financialManagements,
  setFinancialManagement,
  isloading,
  setIsloading,
  getData,
  toast,
  setEditFinancialManagement,
  setEditFinancialManagementData,
  setCreateFinancialManagement,
  setFilterEnabled,
  setTestEnabled,
}) {
  const [filteredData, setFilteredData] = useState([]); // filtrelenmiş veriler

  useEffect(() => {}, []);

  // tablodan veri silme fonksiyonu
  const dataDeleteFunction = async (id) => {
    try {
      setIsloading(true); // yükleniyor etkinleştirildi
      const responseData = await postAPI('/createProduct/financialManagement', {
        data: id,
        processType: 'delete',
      });

      if (!responseData || responseData.status !== 'success') {
        throw new Error('Veri silinemedi');
      }
      await getData();
      await setIsloading(false);
      toast.success('Veri başarıyla silindi');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const renderHead = () => {
    const tableHeaders = [
      'sıra',
      'İşlem İsmi',
      'Fiyat Tipi',
      'Koşul Durumu',
      'Koşul Tipi',
      'Koşul Değeri',
      'Koşul Değeri 2',
      'Matematik Operatörü',
      'Sonuç Değeri',
      'İşlem Sırası',
      'İşlemler',
    ];

    return (
      <tr className='bg-blue-600 text-white'>
        {tableHeaders.map((header, index) => (
          <th
            key={index}
            scope='col'
            className=' text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2'
          >
            {header}
          </th>
        ))}
      </tr>
    );
  };

  const renderData = () => {
    return (
      financialManagements.length > 0 &&
      financialManagements.map((financialManagement, index) => (
        <tr key={index} className='border-b'>
          <td className='border-r'>
            <div className='flex justify-center items-center h-full mt-2 w-full text-center py-2'>
              <div className='bg-black text-white rounded-full flex justify-center items-center w-6 h-6 text-center'>
                {index + 1}
              </div>
            </div>
          </td>
          <td className='text-center py-2 border-r'>
            <div>{financialManagement.operationName}</div>
          </td>
          <td className='text-center py-2 border-r'>
            <div>{financialManagement.priceType}</div>
          </td>
          <td className='text-center py-2 border-r'>
            <div>
              {financialManagement.condition
                ? 'Koşul Olacak'
                : 'Koşul Olmayacak'}
            </div>
          </td>
          <td className='text-center py-2 border-r'>
            <div>{financialManagement.conditionType}</div>
          </td>
          <td className='text-center py-2 border-r'>
            <div>{financialManagement.conditionValue}</div>
          </td>
          <td className='text-center py-2 border-r'>
            <div>{financialManagement.conditionValue2}</div>
          </td>
          <td className='text-center py-2 border-r'>
            <div>{financialManagement.mathOperator}</div>
          </td>
          <td className='text-center py-2 border-r'>
            <div>{financialManagement.finalPrice}</div>
          </td>
          <td className='text-center py-2 border-r'>
            <div>{financialManagement.orderValue}</div>
          </td>
          {/* Tablonun Düzenle - sil aksiyon işlemlerinin yapıldığı kısım */}
          <td className='text-center py-2 border-r'>
            <div className='flex center justify-center items-center gap-4'>
              <button
                onClick={() => {
                  // veri güncellemesi için ilk adım.
                  setEditFinancialManagement(true);
                  setCreateFinancialManagement(false);
                  setFilterEnabled(false);
                  setTestEnabled(false);
                  setEditFinancialManagementData(financialManagement);
                }}
                className='shadow-md bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded-md min-w-[50px]'
              >
                Düzenle
              </button>

              <button
                onClick={async () => {
                  await dataDeleteFunction(financialManagement.id);
                }}
                className='shadow-md bg-red-500 hover:bg-red-700 text-white font-bold p-2  rounded-md min-w-[50px]'
              >
                Sil
              </button>
            </div>
          </td>
        </tr>
      ))
    );
  };
  return (
    <>
      <div
        className={`
    w-full relative overflow-x-auto
    ${isloading ? ' blur max-h-screen overflow-hidden' : ' blur-none'}
    `}
      >
        <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
          <thead className='text-md text-gray-700 bg-gray-50 dark:bg-blue-500 dark:text-white'>
            {renderHead()}
          </thead>
          <tbody>{renderData()}</tbody>
        </table>
      </div>
      {financialManagements.length === 0 && (
        <div className='text-center text-xl text-gray-500 my-5'>
          Veri bulunamadı
        </div>
      )}
    </>
  );
}

export default ListFinancialComponent;
