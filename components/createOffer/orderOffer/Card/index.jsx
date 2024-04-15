import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { IoCloseOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { postAPI } from '@/services/fetchAPI';

const Card = ({
  orderData,
  setSelectedOrder,
  setIsloading,
  getAllOrderData,
}) => {
  // Silme fonksiyonu buradadır.
  const deleteOrder = async (orderCode) => {
    const conf = confirm("Bu Teklif Silinecektir, Emin misiniz ?")
    if (conf) {
      setIsloading(true);
      try {
        const response = await postAPI('/createOrder/order', {
          deletedOrderCode: orderCode,
          processType: 'delete',
        });
        console.log(response);
        if (response.status !== 'success') {
          setIsloading(false);
          throw new Error('Bir hata oluştu');
        }

        getAllOrderData();
        return toast.success(response.message);
      } catch (error) {
        toast.error(error.message);
      }
    }
  };
  return (
    <div className='grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 p-3'>
      {orderData &&
        orderData.length > 0 &&
        orderData.map((item) => {
          return (
            <div
              key={item.orderCode}
              className='relative border rounded-lg shadow bg-gray-800 border-gray-700'
            >
              <button
                className='absolute -right-2 -top-2 z-20 bg-red-600 rounded-full hover:cursor-pointer hover:scale-110 transition-all'
                onClick={() => deleteOrder(item.orderCode)}
              >
                <IoCloseOutline size={30} color='white' />
              </button>
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
                    Müşteri İsmi: {item.Müşteri[0]?.name}{' '}
                    {item.Müşteri[0]?.surname}
                  </li>
                  <li className='py-2'>
                    Firma İsmi: {item.Müşteri[0]?.company_name}
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
                <div className='flex my-4 gap-2'>
                  <Link href={`/document?id=${item.orderCode}&lang=en`}>
                    <Image
                      className='w-10 h-10 mb-3 rounded-full shadow-lg hover:cursor-pointer hover:scale-110 transition-all'
                      src='/en_flag.svg'
                      width={100}
                      height={100}
                      alt='Invoice icon'
                    />
                  </Link>

                  <Link href={`/document?id=${item.orderCode}&lang=ua`}>
                    <Image
                      className='w-10 h-10 mb-3 rounded-full shadow-lg hover:cursor-pointer hover:scale-110 transition-all'
                      src='/ua_flag.svg'
                      width={100}
                      height={100}
                      alt='Invoice icon'
                    />
                  </Link>

                  <Link href={`/document?id=${item.orderCode}&lang=tr`}>
                    <Image
                      className='w-10 h-10 mb-3 rounded-full shadow-lg hover:cursor-pointer hover:scale-110 transition-all'
                      src='/tr_flag.svg'
                      width={100}
                      height={100}
                      alt='Invoice icon'
                    />
                  </Link>

                  <Button>
                    <Link href={`/stepbystep/${item.orderCode}/1.1`}>Go Panel</Link>
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default Card;
