'use client';

import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAPI, postAPI } from '@/services/fetchAPI';

function ListFinancialComponent({
  financialManagements,
  setFinancialManagement,
}) {
  const [isloading, setIsloading] = useState(false);

  const mathOperators = {
    ADD: '+',
    SUBTRACT: '-',
    MULTIPLY: 'x',
    DIVIDE: '÷',
    PERCENT: '%',
    SUBTRACT_PERCENT: '-%',
    ADD_PERCENT: '+%',
  };

  const priceTypes = {
    LIST: 'Liste Fiyatı',
    LIST_MULTIPLY_STOCK: 'Liste Fiyatı x Adet Miktarı',
  };

  async function test(price = 100, stock = 10) {
    const response = await getAPI('/createProduct/financialManagement');
    response.data.sort((a, b) => a.orderValue - b.orderValue);
    const responseSpecial = await getAPI(
      '/createProduct/financialManagementSpecial'
    );
    let result = [];
    response.data.forEach((element, index) => {
      result.length > 0
        ? (result[index] = result[index - 1])
        : (result[index] = price);

      element.priceType === priceTypes.LIST_MULTIPLY_STOCK
        ? (result[index] = result[index] * stock)
        : (result[index] = result[index]);
      // Eğer koşul varsa, burayı çalıştır. (<, >, =, !=, <=, >=)
      if (element.condition) {
        console.log('Koşul var');
      } else {
        // Eğer koşul yoksa, burayı çalıştır.

        if (element.mathOperator === mathOperators.ADD) {
          result[index] = result[index] + parseInt(element.finalPrice);
        }

        if (element.mathOperator === mathOperators.SUBTRACT) {
          result[index] = result[index] - parseInt(element.finalPrice);
        }

        if (element.mathOperator === mathOperators.MULTIPLY) {
          result[index] = result[index] * parseInt(element.finalPrice);
        }

        if (element.mathOperator === mathOperators.DIVIDE) {
          result[index] = result[index] / parseInt(element.finalPrice);
        }

        if (element.mathOperator === mathOperators.PERCENT) {
          result[index] = (result[index] * parseInt(element.finalPrice)) / 100;
        }

        if (element.mathOperator === mathOperators.SUBTRACT_PERCENT) {
          result[index] =
            result[index] -
            (result[index] * parseInt(element.finalPrice)) / 100;
        }

        if (element.mathOperator === mathOperators.ADD_PERCENT) {
          result[index] =
            result[index] +
            (result[index] * parseInt(element.finalPrice)) / 100;
        }
        responseSpecial.data
          .filter((item) => {
            return item.financialManagementId === element.id;
          })
          .forEach((item, specialIndex) => {
            if (
              item.conditionValueSpecial == 'Özel Barem Ekle' &&
              item.ozelBaremValue > 0
            ) {
              //result[index] = result[index] + parseInt(item.ozelBaremValue);
              if (item.mathOperatorSpecial === mathOperators.ADD) {
                // Özel İşlem Toplama
                result[index] = result[index] + parseFloat(item.ozelBaremValue);
              }

              // Özel İşlem Çıkarma
              if (item.mathOperatorSpecial === mathOperators.SUBTRACT) {
                result[index] = result[index] - parseFloat(item.ozelBaremValue);
              }

              // Özel İşlem Çarpma
              if (item.mathOperatorSpecial === mathOperators.MULTIPLY) {
                result[index] = result[index] * parseFloat(item.ozelBaremValue);
              }

              // Özel İşlem Bölme
              if (item.mathOperatorSpecial === mathOperators.DIVIDE) {
                result[index] = result[index] / parseFloat(item.ozelBaremValue);
              }

              // Özel İşlem Yüzde
              if (item.mathOperatorSpecial === mathOperators.PERCENT) {
                result[index] =
                  (result[index] * parseFloat(item.ozelBaremValue)) / 100;
              }

              // Özel İşlem Yüzde Toplama
              if (item.mathOperatorSpecial === mathOperators.ADD_PERCENT) {
                result[index] =
                  result[index] +
                  (result[index] * parseFloat(item.ozelBaremValue)) / 100;
              }

              // Özel İşlem Yüzde Çıkarma
              if (item.mathOperatorSpecial === mathOperators.SUBTRACT_PERCENT) {
                result[index] =
                  result[index] -
                  (result[index] * parseFloat(item.ozelBaremValue)) / 100;
              }
            }
            if (
              specialIndex == 0 &&
              item.conditionValueSpecial != 'Özel Barem Ekle'
            ) {
              if (item.mathOperatorSpecial === mathOperators.ADD) {
                // Özel İşlem Toplama
                result[index] = result[index] + result[index - 1];
              }

              // Özel İşlem Çıkarma
              if (item.mathOperatorSpecial === mathOperators.SUBTRACT) {
                result[index] = result[index] - result[index - 1];
              }

              // Özel İşlem Çarpma
              if (item.mathOperatorSpecial === mathOperators.MULTIPLY) {
                result[index] = result[index] * result[index - 1];
              }

              // Özel İşlem Bölme
              if (item.mathOperatorSpecial === mathOperators.DIVIDE) {
                result[index] = result[index] / result[index - 1];
              }

              // Özel İşlem Yüzde
              if (item.mathOperatorSpecial === mathOperators.PERCENT) {
                result[index] =
                  (result[index] * parseFloat(result[index - 1])) / 100;
              }

              // Özel İşlem Yüzde Toplama
              if (item.mathOperatorSpecial === mathOperators.ADD_PERCENT) {
                result[index] =
                  result[index] +
                  (result[index] * parseFloat(result[index - 1])) / 100;
              }

              // Özel İşlem Yüzde Çıkarma
              if (item.mathOperatorSpecial === mathOperators.SUBTRACT_PERCENT) {
                result[index] =
                  result[index] -
                  (result[index] * parseFloat(result[index - 1])) / 100;
              }
            }

            if (
              specialIndex > 0 &&
              item.conditionValueSpecial != 'Özel Barem Ekle'
            ) {
              if (item.mathOperatorSpecial === mathOperators.ADD) {
                // Özel İşlem Toplama
                result[index] = result[index] + result[index];
              }

              // Özel İşlem Çıkarma
              if (item.mathOperatorSpecial === mathOperators.SUBTRACT) {
                result[index] = result[index] - result[index];
              }

              // Özel İşlem Çarpma
              if (item.mathOperatorSpecial === mathOperators.MULTIPLY) {
                result[index] = result[index] * result[index];
              }

              // Özel İşlem Bölme
              if (item.mathOperatorSpecial === mathOperators.DIVIDE) {
                result[index] = result[index] / result[index];
              }

              // Özel İşlem Yüzde
              if (item.mathOperatorSpecial === mathOperators.PERCENT) {
                result[index] = (result[index] * result[index]) / 100;
              }

              // Özel İşlem Yüzde Toplama
              if (item.mathOperatorSpecial === mathOperators.ADD_PERCENT) {
                console.log(result);
                result[index] =
                  result[index] + (result[index] * result[index]) / 100;
              }

              // Özel İşlem Yüzde Çıkarma
              if (item.mathOperatorSpecial === mathOperators.SUBTRACT_PERCENT) {
                result[index] =
                  result[index] - (result[index] * result[index]) / 100;
              }
            }
          });
      }
    });
    console.log(result);
  }
  test();
  // tablodan veri silme fonksiyonu
  const dataDeleteFunction = async (id) => {
    try {
      setIsloading(true); // yükleniyor etkinleştirildi
      const responseData = await postAPI('/createProduct/financialManagement', {
        data: id,
        processType: 'delete',
      });
      console.log(responseData);
      if (!responseData || responseData.status !== 'success') {
        throw new Error('Veri silinemedi');
      }
      await getData();
      await setIsloading(false);
      toast.success('Veri başarıyla silindi');
    } catch (error) {
      toast.error(error.message);
      console.log(error);
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
                  setUpdateData(colour);
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
