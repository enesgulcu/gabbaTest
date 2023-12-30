import React from 'react';
import Image from 'next/image';
const Card = ({
  orderData,
  setOrderData,
  setSelectedOrder,
  setShowOrderOffer,
}) => {
  console.log(orderData);
  return (
    <div className='grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 p-3'>
      {orderData &&
        orderData.length > 0 &&
        orderData.map((item) => (
          <div
            key={item.orderCode}
            className='border rounded-lg shadow bg-gray-800 border-gray-700'
          >
            <div className='flex flex-col items-center pt-4'>
              <Image
                className='w-24 h-24 mb-3 rounded-full shadow-lg'
                src='/invoice-blue.png'
                width={100}
                height={100}
                alt='Invoice icon'
              />

              <h5 className='my-2 text-md font-medium text-white'>
                {item.orderCode}
              </h5>
              <ul className='divide-y divide-gray-700 text-gray-300'>
                <li className='py-2'>
                  Oluşturma Tarihi:{' '}
                  {item.Orders.map(
                    (orders, index) =>
                      index == 0 &&
                      orders.createdAt
                        .split('T')[0]
                        .split('-')
                        .reverse()
                        .join('.')
                  )}
                </li>
                <li className='py-2'>
                  Müşteri İsmi: {item.Personel[0].name}{' '}
                  {item.Personel[0].surname}
                </li>
                <li className='py-2'>
                  Firma İsmi: {item.Müşteri[0].companyName}
                </li>
                <li className='py-2'>Ürün Adedi: {item.Orders.length}</li>
                <li className='py-2'>
                  Fiyat:{' '}
                  {item.Orders.reduce((total, order) => {
                    return (
                      total +
                      (order.productPrice + order.productFeaturePrice) *
                        order.stock
                    );
                  }, 0)}
                </li>
                <li>
                  Durum:{' '}
                  <span className='text-xs font-medium me-2 px-2.5 py-0.5 rounded-full bg-blue-900 text-blue-300'>
                    {item.Orders[0].ordersStatus}
                  </span>
                </li>
              </ul>
              <div className='flex mt-4 gap-2'>
                <Image
                  onClick={() => {
                    setSelectedOrder({ data: item, lang: 'en' });
                  }}
                  className='w-10 h-10 mb-3 rounded-full shadow-lg hover:cursor-pointer hover:scale-110 transition-all'
                  src='/en_flag.svg'
                  width={100}
                  height={100}
                  alt='Invoice icon'
                />
                <Image
                  onClick={() => {
                    setSelectedOrder({ data: item, lang: 'ua' });
                  }}
                  className='w-10 h-10 mb-3 rounded-full shadow-lg hover:cursor-pointer hover:scale-110 transition-all'
                  src='/ua_flag.svg'
                  width={100}
                  height={100}
                  alt='Invoice icon'
                />
                <Image
                  onClick={() => {
                    setSelectedOrder({ data: item, lang: 'tr' });
                  }}
                  className='w-10 h-10 mb-3 rounded-full shadow-lg hover:cursor-pointer hover:scale-110 transition-all'
                  src='/tr_flag.svg'
                  width={100}
                  height={100}
                  alt='Invoice icon'
                />
              </div>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Card;
