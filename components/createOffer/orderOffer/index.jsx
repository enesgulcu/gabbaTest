'use client';
import React, { useState, useEffect } from 'react';
import { getAPI } from '@/services/fetchAPI';
import Card from './Card';
import PrintOrder from './PrintOrder';

//
const OrderOffer = ({
  setIsloading,
  selectedOrder,
  setSelectedOrder,
  setShowOrderOffer,
}) => {
  const [orderData, setOrderData] = useState([]);

  const getAllOrderData = async () => {
    const response = await getAPI('/createOrder/order');
    setOrderData(response.data);
    setIsloading(false);
  };

  useEffect(() => {
    setIsloading(true);
    getAllOrderData();
  }, []);

  return (
    <>
      {orderData && !orderData.length > 0 && (
        <h2 className='text-center text-red-500 font-semibold text-3xl mt-40'>
          Herhangi bir teklif bulunmamakta!
        </h2>
      )}
      {selectedOrder && selectedOrder.data ? (
        <PrintOrder data={selectedOrder.data} lang={selectedOrder.lang} />
      ) : (
        <Card
          orderData={orderData}
          setOrderData={setOrderData}
          setSelectedOrder={setSelectedOrder}
          setShowOrderOffer={setShowOrderOffer}
          setIsloading={setIsloading}
          getAllOrderData={getAllOrderData}
        />
      )}
    </>
  );
};

export default OrderOffer;
