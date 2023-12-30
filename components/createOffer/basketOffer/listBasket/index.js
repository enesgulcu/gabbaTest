'use client';
import React, { useState } from 'react';
import { postAPI } from '@/services/fetchAPI';
import CustomerAndPersonel from '@/components/createOffer/basketOffer/listBasket/multiStepForm/CustomerAndPersonel';
import { IoChevronForwardOutline } from 'react-icons/io5';
import { Formik, Form, ErrorMessage } from 'formik';
import BasketCard from './Card';

const ListBasket = ({
  toast,
  setIsloading,
  setBasketData,
  basketData,
  productFeatures,
  setShowOrderOffer,
  setShowBasketOffer,
  setIsCustomerAndPersonel,
  isCustomerAndPersonel,
  setSelectedBasketData,
  setIsSelectedBasket,
  setHiddenBasketBar,
  setUniqueKeys,
  setSelectedBasketFeatures,
}) => {
  console.log('basketData', basketData);

  return (
    <Formik
      //validationSchema={FinancialManagementValidationSchema}
      initialValues={{
        orderNote: '',
        ordersStatus: 'Onay Bekliyor',
        productOrderStatus: 'Onay Bekliyor',
        Customer: [
          {
            companyName: '',
            name: '',
            surname: '',
            phoneNumber: '',
            address: '',
            mailAddress: '',
            role: 'customer',
          },
        ],
        Personel: [
          {
            name: '',
            surname: '',
            phoneNumber: '',
            storeName: '',
            storeAddress: '',
            role: 'personel',
          },
        ],
      }}
      onSubmit={async (values, { resetForm }) => {
        setIsloading(true);
        const response = await postAPI('/createOrder/order', {
          basketData,
          values,
        });
        if (response.status !== 'success' || response.status == 'error') {
          setIsloading(false);
          toast.error(response.error);
        } else {
          console.log(response);
          setIsloading(false);
          toast.success(response.message);
          resetForm();
          setBasketData([]);
          setShowOrderOffer(true);
          setShowBasketOffer(false);
          setIsCustomerAndPersonel(false);
        }
      }}
    >
      {(FormProps) => (
        <Form onSubmit={FormProps.handleSubmit}>
          <div className='flex flex-col justify-center items-center'>
            {isCustomerAndPersonel ? (
              <CustomerAndPersonel
                FormProps={FormProps}
                ErrorMessage={ErrorMessage}
                setIsCustomerAndPersonel={setIsCustomerAndPersonel}
              />
            ) : (
              <>
                {basketData.length === 0 ? (
                  <div className='grid grid-cols-1 w-full'>
                    <div className='border p-3 mx-4 rounded shadow order-2 md:order-1'>
                      <p className='text-2xl font-bold text-center my-4 text-red-500'>
                        Sepetinizde ürün bulunmamakta!
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className='text-2xl font-bold text-center my-4 uppercase'>
                      Sepet
                    </h1>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4 p-4'>
                      {basketData.map((item) => (
                        <BasketCard
                          key={item.id}
                          item={item}
                          productFeatures={productFeatures}
                          setBasketData={setBasketData}
                          setIsloading={setIsloading}
                          toast={toast}
                          basketData={basketData}
                          setSelectedBasketData={setSelectedBasketData}
                          setIsSelectedBasket={setIsSelectedBasket}
                          setHiddenBasketBar={setHiddenBasketBar}
                          setSelectedBasketFeatures={setSelectedBasketFeatures}
                        />
                      ))}
                    </div>
                    <div className='flex justify-center mb-3 items-center w-full'>
                      <button
                        onClick={() => setIsCustomerAndPersonel(true)}
                        type='button'
                        className='hover:scale-105 transition-all flex justify-center items-center p-2 text-white font-semibold bg-gray-800 rounded group
                  '
                      >
                        İleri
                        <IoChevronForwardOutline
                          size={22}
                          className='text-white transform translate-x-0 group-hover:translate-x-2 transition-transform'
                        />
                      </button>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ListBasket;
