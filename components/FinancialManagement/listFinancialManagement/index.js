'use client';

import React, { useEffect } from 'react';
import { postAPI } from '@/services/fetchAPI';
import { IoCheckmarkDoneSharp, IoClose } from 'react-icons/io5';

function ListFinancialComponent({
  filterOperationName,
  filterPriceType,
  filterMathOperator,
  filterFinalPrice,
  filterOrderValue,
  financialManagements,
  setFinancialManagement,
  filteredFinancialManagements,
  setFilteredFinancialManagements,
  isloading,
  setIsloading,
  getData,
  toast,
  setEditFinancialManagement,
  setEditFinancialManagementData,
  setCreateFinancialManagement,
  setFilterEnabled,
  setTestEnabled,
  setShowSpecialFinancialManagement,
  filterSpecialFinancialManagement,
  financialManagementsSpecial,
}) {
  useEffect(() => {
    // Filtreleme işlemi
    const filteredData = financialManagements.filter((item) => {
      return (
        item.operationName
          .toLowerCase()
          .includes(filterOperationName.toLowerCase()) &&
        item.priceType.toLowerCase().includes(filterPriceType.toLowerCase()) &&
        item.mathOperator
          .toLowerCase()
          .includes(filterMathOperator.toLowerCase()) &&
        item.finalPrice
          .toLowerCase()
          .includes(filterFinalPrice.toLowerCase()) &&
        item.orderValue
          .toString()
          .toLowerCase()
          .includes(filterOrderValue.toString().toLowerCase())
      );
    });

    setFilteredFinancialManagements(filteredData);
  }, [
    filterOperationName,
    filterPriceType,
    filterMathOperator,
    filterFinalPrice,
    filterOrderValue,
    financialManagements,
  ]);

  // tablodan veri silme fonksiyonu
  const dataDeleteFunction = async (selectedFinancialManagementData) => {
    try {
      setIsloading(true); // yükleniyor etkinleştirildi
      const responseData = await postAPI('/createProduct/financialManagement', {
        data: selectedFinancialManagementData,
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
      'Özel İşlem',
      'Sorgulanacak Koşul',
      'Koşul Durumu',
      'Koşul Tipi',
      'Koşul Değeri',
      'Operatör',
      'Uygulanan Değer',
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
      filteredFinancialManagements.length > 0 &&
      filteredFinancialManagements.map((financialManagement, index) => (
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
          <td className='text-center py-2 border-r flex justify-center items-center h-full px-2'>
            {/* Eğer özel işlem var ise kontrol et. */}
            {financialManagementsSpecial.filter(
              (item) => item.financialManagementId === financialManagement.id
            ).length > 0 ? (
              <div className='flex center justify-center items-center gap-4'>
                <button
                  onClick={() => {
                    // Özel işlemleri listelemek için
                    setEditFinancialManagement(false);
                    setCreateFinancialManagement(false);
                    setFilterEnabled(false);
                    setTestEnabled(false);
                    setShowSpecialFinancialManagement(true);
                    filterSpecialFinancialManagement(financialManagement.id);
                  }}
                  className='shadow-md bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded-md min-w-[50px]'
                >
                  Özel İşlemi Göster
                </button>
              </div>
            ) : (
              <div className='text-center py-2'>Özel İşlem Yok</div>
            )}
          </td>
          <td className='text-center py-2 border-r'>
            <div>{financialManagement.priceType}</div>
          </td>
          <td className='text-center py-2 border-r'>
            <div className='flex justify-center items-center'>
              {financialManagement.condition ? (
                <IoCheckmarkDoneSharp color='green' size={25} />
              ) : (
                <IoClose color='red' size={25} />
              )}
            </div>
          </td>
          <td className='text-center py-2 border-r'>
            <div>{financialManagement.conditionType}</div>
          </td>
          <td className='text-center py-2 border-r'>
            <div>
              {financialManagement.conditionValue}{' '}
              {financialManagement.conditionValue2 && (
                <span>
                  {'<>'} {financialManagement.conditionValue2}
                </span>
              )}
            </div>
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
                  await dataDeleteFunction(financialManagement);
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
