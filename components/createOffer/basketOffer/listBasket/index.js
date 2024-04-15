"use client";
import React, { useState } from "react";
import { postAPI } from "@/services/fetchAPI";
// import Customer from './Customer';
import Customer from "@/components/customer";
import CustomerRegistration from "@/components/customer/CustomerRegistration";
import { IoChevronForwardOutline } from "react-icons/io5";
import { Formik, Form, ErrorMessage } from "formik";
import BasketCard from "./Card";
import { useSession } from "next-auth/react";

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
  setSelectedBasketFeatures,
  customers,
  getData
}) => {
  const { data } = useSession();
  
  return (
    <>
      <Formik
        //validationSchema={FinancialManagementValidationSchema}
        initialValues={{
          orderNote: "",
          ordersStatus: "Onay Bekliyor",
          productOrderStatus: "Onay Bekliyor",
          personelId: data?.user?.id,
          customerId: "",
          customerName: "",
        }}
        onSubmit={async (values, { resetForm }) => {
          setIsloading(true);
          const response = await postAPI("/createOrder/order", {
            basketData,
            values: {
              ...values,
            },
          });

          if (response.status !== "success" || response.status == "error") {
            setIsloading(false);
            toast.error(response.message);
          } else {
            setIsloading(false);
            toast.success(response.message);
            resetForm();
            setBasketData([]);
            setShowOrderOffer(true);
            setShowBasketOffer(false);
          }
        }}
      >
        {(FormProps) => (
          <Form onSubmit={FormProps.handleSubmit} id="createOfferForm">
            <div className="flex flex-col justify-center items-center">
              {isCustomerAndPersonel ? (
                <Customer toast={toast} getData={getData} FormProps={FormProps} customers={customers} />
              ) : (
                <>
                  {basketData.length === 0 ? (
                    <div className="grid grid-cols-1 w-full">
                      <div className="border p-3 mx-4 rounded shadow order-2 md:order-1">
                        <p className="text-2xl font-bold text-center my-4 text-red-500">
                          Sepetinizde ürün bulunmamakta!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl font-bold text-center my-4 uppercase">
                        Sepet
                      </h1>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-4 p-4">
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
                            setSelectedBasketFeatures={
                              setSelectedBasketFeatures
                            }
                          />
                        ))}
                      </div>
                      <div className="flex justify-center mb-3 items-center w-full">
                        <button
                          onClick={() => setIsCustomerAndPersonel(true)}
                          type="button"
                          className="hover:scale-105 transition-all flex justify-center items-center p-2 text-white font-semibold bg-gray-800 rounded group
                  "
                        >
                          İleri
                          <IoChevronForwardOutline
                            size={22}
                            className="text-white transform translate-x-0 group-hover:translate-x-2 transition-transform"
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
    </>
  );
};

export default ListBasket;
