'use client'
import { getAPI } from '@/services/fetchAPI'
import React, { useEffect, useState } from 'react'
import PrintOrder from '@/components/createOffer/orderOffer/PrintOrder';
import { useSearchParams } from 'next/navigation';

// Adım adım bir formu temsil eden bileşen
const StepByStep = () => {
  const id = useSearchParams().get("id")
  const lang = useSearchParams().get("lang")
  console.log(id)
  console.log(lang)

  const [orderData, setOrderData] = useState();

  const getAllOrderData = async () => {
    const response = await getAPI('/createOrder/order');
    const filtered = response.data?.filter((fl) => fl.orderCode === id)[0]
    setOrderData(filtered);
  };

  useEffect(() => {
    getAllOrderData();
  }, []);

  return (
    <div className='h-screen w-full flex'>
      {orderData && <PrintOrder data={orderData} lang={lang} />}
    </div>
  )
}

export default StepByStep