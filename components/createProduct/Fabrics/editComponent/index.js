"use client"

import React from 'react'
import {postAPI} from '@/services/fetchAPI';
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import Image from 'next/image';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { IoClose, IoCheckmarkDoneSharp, IoAddOutline, IoCloseOutline } from "react-icons/io5";
import ResizeImage from '@/functions/others/resizeImage';
import FabricsValidationSchema from './formikData';


 const EditComponent = ({updateData, setUpdateData, NewData, isloading, setIsloading}) => {



  
  const initialValues = {
    fabrics: [
      updateData ||
      {
        fabricType: "",
        fabricDescription: "",
        fabricSwatch: "",

        image: "",
        
        translateEnabled: false,
        addSwatchEnabled: false,

        fabricTypeTurkish: "",
        fabricTypeUkrainian: "",
        fabricTypeEnglish: "",

        fabricDescriptionTurkish: "",
        fabricDescriptionUkrainian: "",
        fabricDescriptionEnglish: "",

        fabricSwatchTurkish:"",
        fabricSwatchUkrainian:"",
        fabricSwatchEnglish:"",
      },
    ],
  };

    

  const index = 0;


  return (
    <div className='w-full'>
      <div className={`w-full ${isloading ? " blur max-h-screen overflow-hidden" : " blur-none"}`}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <Formik
          initialValues={initialValues}
          validationSchema={FabricsValidationSchema}
          onSubmit={async (value) => {
            setIsloading(true);
            const responseData = await postAPI("/createProduct/fabrics",{data:value, processType:"update"});
            if (
              responseData.status !== "success" ||
              responseData.status == "error"
            ) {
              setIsloading(false);
              toast.error(responseData.error);
            } else {
              setIsloading(false);
              toast.success("Tüm Veriler Başarıyla Güncellendi!");
              setUpdateData("");

              // form verilerini sıfırla.
              value.fabrics = [
                {
                  fabricType: "",
                  fabricDescription: "",
                  fabricSwatch: "",

                  image: "",
                  
                  translateEnabled: false,

                  fabricTypeTurkish: "",
                  fabricTypeUkrainian: "",
                  fabricTypeEnglish: "",

                  fabricDescriptionTurkish: "",
                  fabricDescriptionUkrainian: "",
                  fabricDescriptionEnglish: "",

                  fabricSwatchTurkish:"",
                  fabricSwatchUkrainian:"",
                  fabricSwatchEnglish:"",
                },
                
              ];
              

              // arayüzdeki input içindeki değerleri sil ve sıfırla.
              document.getElementById(`fabrics[${0}].fabricType`).value ="";
              document.getElementById(`fabrics[${0}].fabricDescription`).value ="";
              document.getElementById(`fabrics[${0}].fabricSwatch`).value ="";
              document.getElementById(`fabrics[${0}].image`).value = "";
              document.getElementById(`fabrics[${0}].fabricTypeTurkish`).value ="";
              document.getElementById(`fabrics[${0}].fabricTypeUkrainian`).value ="";
              document.getElementById(`fabrics[${0}].fabricTypeEnglish`).value ="";
              document.getElementById(`fabrics[${0}].fabricDescriptionTurkish`).value ="";
              document.getElementById(`fabrics[${0}].fabricDescriptionUkrainian`).value ="";
              document.getElementById(`fabrics[${0}].fabricDescriptionEnglish`).value ="";
              document.getElementById(`fabrics[${0}].fabricSwatchTurkish`).value ="";
              document.getElementById(`fabrics[${0}].fabricSwatchUkrainian`).value ="";
              document.getElementById(`fabrics[${0}].fabricSwatchEnglish`).value ="";
              
            }
          }}
        >
          {(props) => (
            <Form onSubmit={props.handleSubmit}>
              <FieldArray name="fabrics">
                {({ insert, push, remove }) => (
                  <div>
                    <div>
                      {props.values.fabrics.map((measurement, index) => (
                        <div key={index}
                          className={` lg:px-4 hover:bg-yellow-400 py-4 transition-all w-full flex-col xl:flex-row flex flex-wrap xl:justify-center justify-center item-center xl:items-center gap-4 ${
                            index % 2 ? "bg-white" : "bg-gray-100"
                          }`}
                        >

                          {/* fabricType - fabricDescription inputları aşağıdadır. */}
                          <div className=" flex flex-col gap-4 justify-center item-center">
                            <div className='flex flex-col lg:flex-row flex-wrap gap-4 justify-center item-center lg:items-start'>
                              {/* fabricDescription input aşağıdadır.*/}
                              <div className="flex flex-col justify-center items-center ">
                                <Field
                                  onChange={props.handleChange}
                                  id={`fabrics[${index}].fabricType`}
                                  name={`fabrics[${index}].fabricType`}
                                  value={props.values.fabrics[index].fabricType}
                                  className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-full lg:w-[200px]`}
                                  type="text"
                                  placeholder="Kumaş tipini giriniz."
                                />

                                <ErrorMessage
                                  name={`fabrics[${index}].fabricType`}
                                  component="div"
                                  className="field-error text-red-600 m-1"
                                />
                              </div>
                              <div className="flex flex-col justify-center items-center ">
                                <Field
                                  onChange={props.handleChange}
                                  id={`fabrics[${index}].fabricDescription`}
                                  name={`fabrics[${index}].fabricDescription`}
                                  value={props.values.fabrics[index].fabricDescription}
                                  className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-full lg:w-[200px]`}
                                  type="text"
                                  placeholder="Kumaş açıklamasını giriniz."
                                />

                                <ErrorMessage
                                  name={`fabrics[${index}].fabricDescription`}
                                  component="div"
                                  className="field-error text-red-600 m-1"
                                />
                              </div>
                              
                              <div className="flex flex-col justify-center items-center ">
                                {/* (Kartela Seç - yok-2 - yok-3) seçme yapısı aşağıadadır. */}
                                <Field
                                  as="select"
                                  disabled={props.values.fabrics[index].addSwatchEnabled ? true : false}
                                  //defaultValue="Kartela Seç"
                                  value={!props.values.fabrics[index].addSwatchEnabled ? props.values.fabricSwatch : "Kartela Seç"}
                                  onChange={props.handleChange}
                                  id={`fabrics[${index}].fabricSwatch`}
                                  name={`fabrics[${index}].fabricSwatch`}
                                  
                                  className="h-10 hover:scale-105 transition-all cursor-pointer  p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                  <option value="">Kartela Seç</option>
                                  {
                                    NewData && NewData.map((item, index) => (
                                      // fabricSwatch içi boş olanları eklemiyoruz.
                                      item.fabricSwatch != "" && item.fabricSwatch &&

                                      // aynı değere sahip olanlardan sadece birini ekliyoruz.
                                      !NewData.slice(0, index).some((item2) => item2.fabricSwatch === item.fabricSwatch) &&

                                      <option key={index} value={item.fabricSwatch}>{item.fabricSwatch}</option>
                                      
                                    ))
                                  }
                                </Field>
                              </div>
                              <div className='flex flex-col justify-center items-center'>
                              <div className={`flex justify-center items-center gap-2 flex-col lg:flex-row`}>
                                <h3 className='lg:mr-2'>Veya</h3>
                                <button
                                type='button'
                                onClick={ () => {
                                    props.setFieldValue(`fabrics[${index}].addSwatchEnabled`, !props.values.fabrics[index].addSwatchEnabled)
                                }
                                }
                                >
                                  {
                                    props.values.fabrics[index].addSwatchEnabled ?
                                    <div className='hover:scale-105 transition-all p-2 bg-red-600 text-white rounded-md flex flex-row justify-center items-center gap-2'>
                                    <IoCloseOutline size={20}/> <h4>İptal</h4>
                                    </div>
                                    :
                                    <div className='hover:scale-105 transition-all p-2 bg-green-600 text-white rounded-md flex flex-row justify-center items-center gap-2'>
                                      <IoAddOutline size={20}/> <h4>Kartela Ekle</h4>
                                      </div>
                                  }
                                  
                                </button>
                            
                                <div className={`${props.values.fabrics[index].addSwatchEnabled ? "block" : "hidden"}`}>
                                  <Field
                                      onChange={props.handleChange}
                                      id={`fabrics[${index}].fabricSwatch`}
                                      name={`fabrics[${index}].fabricSwatch`}
                                      value={props.values.fabrics[index].fabricSwatch}
                                      className={`hover:scale-105 transition-all border border-gray-600 rounded-md p-2 w-full lg:w-[200px]`}
                                      type="text"
                                      placeholder="Yeni Kartela Adı Giriniz."
                                  />
                                </div>
                              </div>
                              </div>
                              <div className='flex flex-row flex-nowrap justify-center items-center gap-2'>
                                <div className="hover:scale-105 transition-all relative border rounded-lg overflow-hidden">
                                <Field
                                  type="file"
                                  id={`fabrics[${index}].image`}
                                  name={`fabrics[${index}].image`}
                                  accept="image/*"
                                  className="opacity-0 cursor-pointer w-28 h-10"
                                  value={props.values.image}                             
                                  onChange={async (event) => {
                                    const file = event.target.files[0];
                                    if (!file) return;
                                    const resizedImageBase64 = await ResizeImage(file, 400, 400);
                                    props.setFieldValue(`fabrics[${index}].image`, resizedImageBase64);
                                  }}
                                />
                                  <label
                                    htmlFor={`fabrics[${index}].image`}
                                    className={
                                      props.values.fabrics[index].image
                                        ? "absolute inset-0 text-center p-2  bg-purple-600 text-white cursor-pointer transition  whitespace-nowrap"
                                        : "absolute inset-0 text-center p-2  bg-blue-600 text-white cursor-pointer transition whitespace-nowrap"
                                      
                                    }
                                  > {
                                    props.values.fabrics[index].image ? "Resim Seçildi" : "Resim Seç"
                                  }
                                  </label> 
                                    
                                </div>
                                {props.values.fabrics[index].image &&
                                  <div className=' hover:scale-125 transition-all hover:rotate-6'>
                                    <button 
                                    className=''
                                    onClick={
                                      () => {
                                        props.values.fabrics[index].image &&
                                        props.setFieldValue(`fabrics[${index}].image`, "");
                                      }
                                    }>
                                      <IoClose/>
                                    </button>
                                </div> 
                                }
                                </div>
                              <div className="flex justify-center items-center flex-row gap-2">
                                    {
                                      <div className="flex justify-center items-center flex-row gap-2 rounded-lg">
                                        {props.values.fabrics[index].fabricTypeTurkish != "" && props.values.fabrics[index].fabricTypeTurkish && (
                                          <Image
                                            className="cursor-default rounded-full"
                                            src="/tr_flag.svg"
                                            height={25}
                                            width={25}
                                            alt="TrFlag"
                                          />
                                        )}
                                        {props.values.fabrics[index].fabricTypeUkrainian != "" && props.values.fabrics[index].fabricTypeUkrainian && (
                                          <Image
                                            className="cursor-default rounded-full"
                                            src="/ua_flag.svg"
                                            height={25}
                                            width={25}
                                            alt="TrFlag"
                                          />
                                        )}
                                        {props.values.fabrics[index].fabricTypeEnglish != "" && props.values.fabrics[index].fabricTypeEnglish && (
                                          <Image
                                            className="cursor-default rounded-full"
                                            src="/en_flag.svg"
                                            height={25}
                                            width={25}
                                            alt="TrFlag"
                                          />
                                        )}
                                      </div>
                                    }

                                    <Image
                                      onClick={() => {
                                        props.setFieldValue(
                                          `fabrics[${index}].translateEnabled`,
                                          true
                                        );
                                      }}
                                      className="hover:scale-105 transition-all cursor-pointer"
                                      src="/translate.svg"
                                      height={30}
                                      width={40}
                                      alt="TrFlag"
                                    />
                              </div>
                            </div>

                            {/* translateEnabled true ise çeviri alanı açılır. */}
                            <div>
                            {props.values.fabrics[index].translateEnabled && (
                            <div className="p-2 bg-white rounded-lg relative pt-10 lg:pt-2 flex justify-center items-center flex-col">

                              {props.values.fabrics[index].fabricTypeTurkish == "" &&
                              props.values.fabrics[index].fabricTypeUkrainian == "" &&
                              props.values.fabrics[index].fabricTypeEnglish == "" &&
                              props.values.fabrics[index].fabricDescriptionTurkish == "" &&
                              props.values.fabrics[index].fabricDescriptionUkrainian == "" &&
                              props.values.fabrics[index].fabricDescriptionEnglish == "" &&
                              props.values.fabrics[index].fabricSwatchTurkish == "" &&
                              props.values.fabrics[index].fabricSwatchUkrainian == "" &&
                              props.values.fabrics[index].fabricSwatchEnglish == "" ? (

                                <div
                                    onClick={() => {
                                      props.setFieldValue(
                                        `fabrics[${index}].translateEnabled`,
                                        false
                                      );
                                    }}
                                    className="cursor-pointer hover:scale-105 hover:rotate-6 transition-all my-4 bg-red-600 p-2 lg:-right-10 -top-20 scale-125 lg:-top-10 rounded-full w-10 h-10 flex justify-center items-center text-center"
                                  >
                                    <IoClose
                                      color="white"
                                      size={40}
                                    />
                                  </div>
                              ) : (
                                <div className="w-full flex justify-center items-center">
                                  <div
                                    onClick={() => {
                                      props.setFieldValue(
                                        `fabrics[${index}].translateEnabled`,
                                        false
                                      );
                                    }}
                                    className="cursor-pointer hover:scale-105 hover:rotate-6 transition-all my-4 bg-green-600 p-2 lg:-right-10 -top-20 scale-125 lg:-top-10 rounded-full w-10 h-10 flex justify-center items-center text-center"
                                  >
                                    <IoCheckmarkDoneSharp
                                      color="white"
                                      size={40}
                                    />
                                  </div>
                                </div>
                              )}


                                <h2 className="text-xl font-semibold p-2 bg-blue-600 text-white rounded-lg w-full text-center">
                                  {`${index + 1}`} - Kumaş Ekle (Çeviri İşlemleri)
                                </h2>
                                <h2 className="text-center w-full m-2">
                                    Girilen Orjinal Değer
                                  </h2>
                                <div className="flex flex-col gap-2 md:gap-2 justify-center items-center w-full ">
                                  
                                  {props.values.fabrics[index].fabricType && (
                                    <div className="bg-black p-1 w-full rounded-lg text-white mb-2">
                                      <h3 className='font-bold text-black bg-gray-200 inline-block p-2 rounded mr-2 min-w-[115px] text-end'>Kumaş Tipi :</h3>
                                      {props.values.fabrics[index].fabricType}
                                    </div>
                                  )}
                                  {props.values.fabrics[index].fabricDescription && (
                                    <div className="bg-black p-1 w-full rounded-lg text-white mb-2">
                                      <h3 className='font-bold text-black bg-gray-200 inline-block p-2 rounded mr-2 min-w-[115px] text-end'>Açıklama :</h3>
                                      {props.values.fabrics[index].fabricDescription}
                                    </div>
                                  )}
                                  {props.values.fabrics[index].fabricSwatch && (
                                    <div className="bg-black p-1 w-full rounded-lg text-white mb-2">
                                      <h3 className='font-bold text-black bg-gray-200 inline-block p-2 rounded mr-2 min-w-[115px] text-end'>Kartela Adı :</h3>
                                      {props.values.fabrics[index].fabricSwatch}
                                    </div>
                                  )}
                                  </div>
                                  {/* Türkçe çeviri alanı */}
                                  <div className="w-full flex pl-1 justify-center item-center flex-row flex-nowrap gap-2">
                                    
                                      <Image
                                        className="hover:scale-105 transition-all"
                                        src="/tr_flag.svg"
                                        height={40}
                                        width={40}
                                        alt="TrFlag"
                                      />

                                      <Field
                                        onChange={props.handleChange}
                                        id={`fabrics[${index}].fabricTypeTurkish`}
                                        name={`fabrics[${index}].fabricTypeTurkish`}
                                        value={ props.values.fabrics[index].fabricTypeTurkish }
                                        className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                        type="text"
                                        placeholder="Kumaş Tipi Türkçe"
                                      />
                                    </div>

                                    <div className="w-full flex pl-1 justify-center item-center flex-row flex-nowrap gap-2">
                                      <Image
                                        className="hover:scale-105 transition-all"
                                        src="/tr_flag.svg"
                                        height={40}
                                        width={40}
                                        alt="TrFlag"
                                      />

                                      <Field
                                        onChange={props.handleChange}
                                        id={`fabrics[${index}].fabricDescriptionTurkish`}
                                        name={`fabrics[${index}].fabricDescriptionTurkish`}
                                        value={ props.values.fabrics[index].fabricDescriptionTurkish }
                                        className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                        type="text"
                                        placeholder="Açıklama Türkçe"
                                      />
                                    </div>

                                    <div className="w-full flex pl-1 justify-center item-center flex-row flex-nowrap gap-2">
                                      <Image
                                          className="hover:scale-105 transition-all"
                                          src="/tr_flag.svg"
                                          height={40}
                                          width={40}
                                          alt="TrFlag"
                                        />
                                      <Field
                                        onChange={props.handleChange}
                                        id={`fabrics[${index}].fabricSwatchTurkish`}
                                        name={`fabrics[${index}].fabricSwatchTurkish`}
                                        value={ props.values.fabrics[index].fabricSwatchTurkish }
                                        className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                        type="text"
                                        placeholder="Kartela Adı Türkçe"
                                      />
                                  </div>

                                  {/* Ukrayna çeviri alanı */}
                                  <div className="bg-gray-100 pl-1 rounded-t w-full flex justify-center item-center flex-row flex-nowrap gap-2">
                                    <Image
                                      className="hover:scale-105 transition-all"
                                      src="/ua_flag.svg"
                                      height={40}
                                      width={40}
                                      alt="TrFlag"
                                    />

                                    <Field
                                      onChange={props.handleChange}
                                      id={`fabrics[${index}].fabricTypeUkrainian`}
                                      name={`fabrics[${index}].fabricTypeUkrainian`}
                                      value={ props.values.fabrics[index].fabricTypeUkrainian }
                                      className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                      type="text"
                                      placeholder="Kumaş Tipi Ukraynaca"
                                    />
                                    </div>
                                    <div className="bg-gray-100 pl-1 w-full flex justify-center item-center flex-row flex-nowrap gap-2">
                                    <Image
                                      className="hover:scale-105 transition-all"
                                      src="/ua_flag.svg"
                                      height={40}
                                      width={40}
                                      alt="TrFlag"
                                    />
                                    <Field
                                      onChange={props.handleChange}
                                      id={`fabrics[${index}].fabricDescriptionUkrainian`}
                                      name={`fabrics[${index}].fabricDescriptionUkrainian`}
                                      value={ props.values.fabrics[index].fabricDescriptionUkrainian }
                                      className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                      type="text"
                                      placeholder="Açıklama Ukraynaca"
                                    />
                                  </div>
                                  <div className="bg-gray-100 rounded-b pl-1 w-full flex justify-center item-center flex-row flex-nowrap gap-2">
                                    <Image
                                      className="hover:scale-105 transition-all"
                                      src="/ua_flag.svg"
                                      height={40}
                                      width={40}
                                      alt="TrFlag"
                                    />
                                    <Field
                                      onChange={props.handleChange}
                                      id={`fabrics[${index}].fabricSwatchUkrainian`}
                                      name={`fabrics[${index}].fabricSwatchUkrainian`}
                                      value={ props.values.fabrics[index].fabricSwatchUkrainian }
                                      className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                      type="text"
                                      placeholder="Kartela Adı Ukraynaca"
                                    />
                                  </div>



                                  {/* English çeviri alanı */}
                                  <div className="w-full pl-1 flex justify-center item-center flex-row flex-nowrap gap-2">
                                    <Image
                                      className="hover:scale-105 transition-all"
                                      src="/en_flag.svg"
                                      height={40}
                                      width={40}
                                      alt="TrFlag"
                                    />

                                    <Field
                                      onChange={props.handleChange}
                                      id={`fabrics[${index}].fabricTypeEnglish`}
                                      name={`fabrics[${index}].fabricTypeEnglish`}
                                      value={ props.values.fabrics[index].fabricTypeEnglish }
                                      className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                      type="text"
                                      placeholder="Kumaş Tipi İngilizce"
                                    />
                                  </div>

                                  <div className="w-full pl-1 flex justify-center item-center flex-row flex-nowrap gap-2">
                                    <Image
                                      className="hover:scale-105 transition-all"
                                      src="/en_flag.svg"
                                      height={40}
                                      width={40}
                                      alt="TrFlag"
                                    />
                                    <Field
                                      onChange={props.handleChange}
                                      id={`fabrics[${index}].fabricDescriptionEnglish`}
                                      name={`fabrics[${index}].fabricDescriptionEnglish`}
                                      value={ props.values.fabrics[index].fabricDescriptionEnglish }
                                      className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                      type="text"
                                      placeholder="Açıklama İngilizce"
                                    />
                                  </div>

                                  <div className="w-full pl-1 flex justify-center item-center flex-row flex-nowrap gap-2">
                                    <Image
                                      className="hover:scale-105 transition-all"
                                      src="/en_flag.svg"
                                      height={40}
                                      width={40}
                                      alt="TrFlag"
                                    />
                                    <Field
                                      onChange={props.handleChange}
                                      id={`fabrics[${index}].fabricSwatchEnglish`}
                                      name={`fabrics[${index}].fabricSwatchEnglish`}
                                      value={ props.values.fabrics[index].fabricSwatchEnglish }
                                      className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                      type="text"
                                      placeholder="Kartela Adı İngilizce"
                                    />
                                </div>

                              </div>                           
                            )}
                            </div>            
                          </div>
                          
                          
                          
                          {/* fabricDescription - fabric Description inputları yukarıdadır. */}
                        </div>
                      ))}
                    </div>

                    <div className="w-full flex justify-center items-center gap-6 my-6 ">
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-md bg-purple-500 text-white hover:rotate-2 hover:scale-105 transition-all shadow-lg"
                      >
                        Güncelle
                      </button>
                    </div>
                  </div>
                )}
              </FieldArray>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default EditComponent;
