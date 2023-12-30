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
      {selectedOrder && selectedOrder.data ? (
        <PrintOrder
          data={selectedOrder.data}
          lang={selectedOrder.lang}
          setSelectedOrder={setSelectedOrder}
        />
      ) : (
        <Card
          orderData={orderData}
          setOrderData={setOrderData}
          setSelectedOrder={setSelectedOrder}
          setShowOrderOffer={setShowOrderOffer}
        />
      )}
    </>
  );
};

export default OrderOffer;
