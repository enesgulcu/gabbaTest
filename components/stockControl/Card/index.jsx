'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { GoTrash } from 'react-icons/go';
import { LiaEdit } from 'react-icons/lia';
import { postAPI } from '@/services/fetchAPI';
import { BiCalendarCheck } from 'react-icons/bi';
import { IoPricetagsOutline } from 'react-icons/io5';
import { FaBoxes } from 'react-icons/fa';
import { toast } from 'react-toastify';

const StockControlCard = ({
  stocks,
  setStocks,
  popup,
  setPopup,
  productFeatures,
  setModalData,
  setSelectedFeatures,
  isLoading,
  setIsLoading,
}) => {
  const role = 'Admin';

  const deleteBasketItem = async (itemId) => {
    setIsLoading(true);
    const response = await postAPI('/stockControl', {
      processType: 'delete',
      id: itemId,
    });

    if (!response || response.status !== 'success') {
      setIsLoading(false);
      toast.error('Veri Silinemedi!');
      throw new Error('Veri silinemedi');
    } else {
      const newStockData = stocks.filter((item) => item.id !== itemId);
      setStocks(newStockData);
      setIsLoading(false);
      toast.success('Veri başarıyla silindi!');
    }
  };

  return (
    <div
      className={`${popup ? 'hidden' : 'block'} ${
        stocks.length == 0 && 'h-full flex justify-center'
      }`}
    >
      {stocks.length > 0 ? (
        <>
          <p>Stoktaki Ürün Adedi: {stocks?.length}</p>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4 p-4'>
            {stocks &&
              stocks.map((stock) => (
                <div
                  className='shadow bg-white rounded flex flex-col gap-3'
                  key={stock.id}
                >
                  {/* Stock ürün resmi */}
                  {productFeatures.map(
                    (productFeature, index) =>
                      productFeature.productId === stock.Product.id &&
                      productFeature.feature.includes('Image' || 'image') && (
                        <Image
                          key={index}
                          width={600}
                          height={300}
                          src={
                            productFeature.imageValue
                              ? productFeature.imageValue
                              : '/no-image.jpg'
                          }
                          alt={`image${index}`}
                          className='max-h-[150px] w-full h-full rounded object-contain	bg-gray-100 hover:scale-110 transition-all'
                        />
                      )
                  )}
                  {/* Stock ürün adı, ürünü kaldır, ürünü düzenle */}

                  <div
                    className={`flex flex-col lg:flex-row items-center mx-2 gap-3 ${
                      role === 'Admin' ? 'justify-between' : 'justify-center'
                    }`}
                  >
                    <p className='text-center text-sm font-semibold uppercase break-all'>
                      {stock.Product.productName}
                    </p>
                    {/* Role göre düzenle ve silme kısmına erişebileceği yer burası */}
                    {role == 'Admin' && (
                      <div className='flex gap-2'>
                        <button
                          onClick={() => {
                            setPopup(true);
                            setModalData(stock);
                            setSelectedFeatures(
                              productFeatures.filter(
                                (productFeature) =>
                                  productFeature.productId === stock.Product.id
                              )
                            );
                          }}
                          title='Düzenle'
                          type='button'
                          className='font-semibold text-white border border-green-500 rounded-full p-1 bg-green-500
            hover:bg-green-800 transition duration-300 ease-in-out hover:border-green-800'
                        >
                          <LiaEdit size={20} />
                        </button>
                        <button
                          onClick={() => deleteBasketItem(stock.id)}
                          title='Sil'
                          type='button'
                          className='font-semibold text-white border border-red-500 rounded-full p-1 bg-red-500
            hover:bg-red-800 transition duration-300 ease-in-out hover:border-red-800'
                        >
                          <GoTrash size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                  {/* Mağaza İsmi, Eklenme Tarihi */}
                  <div className='flex flex-col'>
                    <div className='flex gap-1 items-center bg-gray-100 w-full p-1 border-2 pl-4'>
                      <FaBoxes
                        size={20}
                        className='text-muted-foreground'
                        title='Stok'
                      />
                      <p className='font-semibold text-muted-foreground'>
                        {stock.Stock}
                      </p>
                    </div>
                    <div className='flex gap-1 items-center bg-gray-100 w-full p-1 border-2 pl-4'>
                      <IoPricetagsOutline
                        size={20}
                        className='text-muted-foreground'
                        title='Fiyat'
                      />
                      <p className='font-semibold text-muted-foreground'>
                        {(stock.ProductPrice + stock.ProductFeaturePrice) *
                          stock.Stock}
                      </p>
                    </div>
                    <div className='flex gap-1 items-center bg-gray-100 w-full p-1 pl-4'>
                      <BiCalendarCheck
                        size={20}
                        className='text-muted-foreground'
                        title='Eklenme Tarihi'
                      />
                      <p className='font-semibold text-muted-foreground'>
                        {formatDate(stock.CreatedDate)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
      ) : (
        <div className='flex justify-center items-center'>
          <p className='text-center text-red-500 font-bold text-[30px]'>
            Stokta herhangi bir ürün bulunamadı!
          </p>
        </div>
      )}
    </div>
  );
};

export default StockControlCard;

function formatDate(dateString) {
  var dateObject = new Date(dateString);
  var day = dateObject.getDate();
  var month = dateObject.getMonth() + 1; // JavaScript'te aylar 0'dan başlar, bu yüzden 1 ekliyoruz
  var year = dateObject.getFullYear();

  // Tarih bilgisini istenen formata çevir
  var formattedDate =
    (day < 10 ? '0' : '') +
    day +
    '.' +
    (month < 10 ? '0' : '') +
    month +
    '.' +
    year;

  return formattedDate;
}
