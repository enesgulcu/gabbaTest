"use client"
import React, { useRef } from 'react';
import {postAPI, getAPI} from '@/services/fetchAPI';
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import Image from 'next/image';
import LoadingScreen from '@/components/other/loading';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useState , useEffect} from 'react';
import { MdOutlineCancel } from "react-icons/md";
import { IoClose, IoCheckmarkDoneSharp, IoAddOutline, IoCloseOutline } from "react-icons/io5";
import ResizeImage from '@/functions/others/resizeImage';
import ListComponent from '@/components/createProduct/Fabrics/listComponent';
import FabricsValidationSchema from './formikData';
import EditComponent from '@/components/createProduct/Fabrics/editComponent';
import ProcessBase64Array from '@/functions/others/base64SizeCalculate';

 const FabricsComponent = () => {

  const initialValues = {
    fabrics: [
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

  const [isloading, setIsloading] = useState(false);
  const [NewData , setNewData] = useState("");
  const [isUpdateActive, setIsUpdateActive] = useState(false);
  const [updateData , setUpdateData] = useState("");
  const [selectedLanguageData , setSelectedLanguageData] = useState("");


  

  const getData = async () => {
    try {
      setIsloading(true);
      const response = await getAPI('/createProduct/fabrics');

      if(!response){
        throw new Error("Veri çekilemedi 2");
      }

      if(response.status !== "success"){
        throw new Error("Veri çekilemedi 3");
      }
      setNewData(response.data);
      setIsloading(false);

    } catch (error) {
      setIsloading(false);

      toast.error(error.message);
      console.log(error);
    }
  }  

  useEffect(() => {
    // "updateData" state'i değiştiğinde çalışır.
    if(updateData){
      setIsUpdateActive(true);
    }
    else{
      setIsUpdateActive(false);
    }
    getData();
  }, [updateData])


  const keyMappings = {
    fabricType: "Kumaş Tipi",
    fabricDescription: "Ek Açıklama",
    fabricSwatch: "Kartela",
    fabricTypeTurkish: "Kumaş Tipi (TR)",
    fabricTypeUkrainian: "Kumaş Tipi (UA)",
    fabricTypeEnglish: "Kumaş Tipi (EN)",
    fabricDescriptionTurkish: "Ek Açıklama (TR)",
    fabricDescriptionUkrainian: "Ek Açıklama (UA)",
    fabricDescriptionEnglish: "Ek Açıklama (EN)",
    fabricSwatchTurkish: "Kartela (TR)",
    fabricSwatchUkrainian: "Kartela (UA)",
    fabricSwatchEnglish: "Kartela (EN)",
    image: "Resim",
  };

  const filteredData = Object.keys(updateData).reduce((acc, key) => {
    if (
      updateData[key] !== "" &&
      updateData[key] !== null &&
      updateData[key] !== false &&
      keyMappings[key]
    ) {
      acc[key] = updateData[key];
    }
    return acc;
  }, {});

  return (
    <>
  
      {isloading && <LoadingScreen isloading={isloading} />}
    
    
      {/* // UPDATE EKRANI Aşağıdadır */}
      {isUpdateActive && updateData && (
        <div className={`        
        ${isloading || selectedLanguageData && "blur"} cursor-default w-screen absolute bg-black bg-opacity-90 z-50 py-4 min-h-screen max-w-full`}>
          <div className="flex-col w-full h-full flex justify-center items-center">
            <div className='w-auto flex justify-center items-center flex-col font-bold'>
              
            
            {/* // UPDATE EKRANI VERİ BİLGİSİ Aşağıdadır*/}
              <div className="w-full">
                <div className="bg-white overflow-hidden shadow-md rounded-lg">
                
                  <div className="p-2">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 text-center">
                      Eski Veri
                    </h3>

                    {/* 
                        keyMappings[key] -> obje başlıklarını listeler
                        filteredData[key] -> obje içindeki değerleri listeler 
                    */}
                    <div className="mt-2 flex flex-row flex-wrap justify-center items-start gap-2">
                      {Object.keys(filteredData).map((key) => (

                        <div key={key} className={`p-2 rounded
                        ${key === "image" && " order-first w-full"}
                        ${key === "fabricType" && " bg-blue-500 w-full"}
                        ${key === "fabricDescription" && " bg-blue-500 w-full"}
                        ${key === "fabricSwatch" && " bg-blue-500 w-full"}
                        ${key === "fabricTypeTurkish" && " bg-orange-400"}
                        ${key === "fabricTypeUkrainian" && " bg-orange-400"}
                        ${key === "fabricTypeEnglish" && " bg-orange-400"}
                        ${key === "fabricDescriptionTurkish" && "bg-orange-400 "}
                        ${key === "fabricDescriptionUkrainian" && " bg-orange-400"}
                        ${key === "fabricDescriptionEnglish" && " bg-orange-400"}
                        ${key === "fabricSwatchTurkish" && " bg-orange-400"}
                        ${key === "fabricSwatchUkrainian" && " bg-orange-400"}
                        ${key === "fabricSwatchEnglish" && " bg-orange-400"}

                        `}>
                        {
                          key === "image" ?
                          <div className={`flex justify-center items-center text-center flex-col`}>
                            <h3 className='text-black'>{keyMappings[key]}</h3>
                            <div className='flex justify-center items-center order-last'>
                              <Image
                              className='rounded-lg shadow-lg'
                                src={filteredData[key]}
                                height={200}
                                width={200}
                                alt="Kumaş Resmi"
                              />
                            </div>
                          </div>
                          : key === "fabricType" || key === "fabricDescription" || key === "fabricSwatch" ?
                            <div className='flex flex-row flex-nowrap gap-2'>
                              <h3 className='text-white'>{keyMappings[key]} :</h3>
                              <h4 className='text-white font-normal'>{filteredData[key]}</h4>
                            </div>
                          :
                          <div className='flex flex-row flex-nowrap gap-2'>
                            <h3 className='text-white'>{keyMappings[key]} :</h3>
                            <h4 className='text-white'>{filteredData[key]}</h4>
                          </div>
                           
                        }
                        </div>

                      ))}
                    </div>
                  </div>
                </div>
              </div>
            {/* // UPDATE EKRANI VERİ BİLGİSİ Yukarıdadır*/}

  
            </div>
            <div className='bg-red-600 m-2 p-2 rounded-full cursor-pointer hover:scale-105 transition hover:rotate-6 hover:border-2 hover:border-white '
            onClick={()=>{setUpdateData("");}}
            >
            <IoClose color="white" size={40} />
            </div>

            <EditComponent updateData={updateData} setUpdateData={setUpdateData} NewData={NewData} setIsloading={setIsloading} isloading={isloading} />

          </div>
        </div>
      )}
      {/* // UPDATE EKRANI Yukarıdadır */}


      <div
        className={`w-full ${
          isloading || selectedLanguageData ? " blur max-h-screen overflow-hidden" : " blur-none"
        } ${isUpdateActive && "blur-sm max-h-screen overflow-hidden"}
        `}
      >
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

            // base64 boyutunu hesapla
            const base64Size = await ProcessBase64Array(value.fabrics.map((item) => item.image));
            if(base64Size.status !== "success"){
              toast.error(base64Size.error);
              setIsloading(false);
            }
            else{
              const responseData = await postAPI("/createProduct/fabrics", value);

              if (
                responseData.status !== "success" ||
                responseData.status == "error"
              ) {
                setIsloading(false);
                toast.error(responseData.error);
              } else {
                // veriyi çek ve state'e at
                getData();
                setIsloading(false);
                toast.success("Tüm Veriler Başarıyla Eklendi!");

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
                          className={` lg:px-10 hover:bg-yellow-400 p-4 transition-all w-full flex-col xl:flex-row flex flex-wrap xl:justify-between justify-center item-center xl:items-start gap-4 ${
                            index % 2 ? "bg-white" : "bg-gray-100"
                          }`}
                        >
                          {/* Kumaş kaldırma butonu aşağıdadır. */}
                          <div className="flex justify-center items-center gap-4">
                            <button
                              className="hover:scale-110 hover:rotate-6 transition-all"
                              type="button"
                              onClick={() => {
                                if (props.values.fabrics.length > 1) {
                                  // burada Kumaş birimini sileceğiz.
                                  const newPropsValues =
                                    props.values.fabrics.filter(
                                      // tıklanan değeri sil diğerlerini listelemeye deva met demektir...
                                      (item, i) => i !== index
                                    );
                                  props.setFieldValue(
                                    "fabrics",
                                    newPropsValues
                                  );
                                }
                              }}
                            >
                              <p className="bg-red-600 text-white p-2 rounded-md">
                                {" "}
                                <MdOutlineCancel size={25} />{" "}
                              </p>
                            </button>

                            <label
                              htmlFor={`measure-${index}`}
                              className="whitespace-nowrap font-semibold flex justify-center items-center"
                            >
                              <div className="flex justify-start items-center flex-row gap-2">
                                  <span className="flex justify-center items-center w-[25px] h-[25px] rounded-full bg-black text-white">
                                    {`${index + 1}`}
                                  </span>{" "}
                                  - Kumaş Ekle
                                </div>
                            </label>
                          </div>
                          {/* Kumaş kaldırma butonu yukarıdadır. */}



                          {/* fabricType - fabricDescription inputları aşağıdadır. */}
                          <div className="flex flex-col lg:flex-row flex-wrap lg:flex-nowrap gap-4 justify-center item-center lg:items-start">
                            {/* fabricDescription input aşağıdadır.*/}
                            <div className="flex flex-col justify-center items-center ">
                              <Field
                                onChange={props.handleChange}
                                id={`fabrics[${index}].fabricType`}
                                name={`fabrics[${index}].fabricType`}
                                value={props.values.fabrics[index].fabricType}
                                className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[250px]`}
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
                                className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[250px]`}
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
                                defaultValue="Kartela Seç"
                                value={!props.values.fabrics[index].addSwatchEnabled ? props.values.fabricSwatch : ""}
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
                                  <IoCloseOutline size={20}/> <h4 className='whitespace-nowrap'>İptal</h4>
                                  </div>
                                  :
                                  <div className='hover:scale-105 transition-all p-2 bg-green-600 text-white rounded-md flex flex-row justify-center items-center gap-2'>
                                    <IoAddOutline size={20}/> <h4 className='whitespace-nowrap'>Kartela Ekle</h4>
                                    </div>
                                }
                                
                              </button>
                          
                              <div className={`${props.values.fabrics[index].addSwatchEnabled ? "block" : "hidden"}`}>
                                <Field
                                    onChange={props.handleChange}
                                    id={`fabrics[${index}].fabricSwatch`}
                                    name={`fabrics[${index}].fabricSwatch`}
                                    value={props.values.fabrics[index].fabricSwatch}
                                    className={`hover:scale-105 transition-all border border-gray-600 rounded-md p-2 w-[250px]`}
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
                            {/* ÇEVİRİ eklendiği bölüm aşağıdadır */}
                            <div className="flex flex-row flex-wrap justify-center xl:justify-around gap-2 items-center cursor-pointer">
                          <div className="flex justify-center items-center gap-2 max-w-[%90]">
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

                                {props.values.fabrics[index].translateEnabled && (
                                  <div className=" cursor-default absolute w-screen h-[1600px] max-h-screen lg:h-screen z-50 left-0 top-0 bg-black bg-opacity-90">
                                    <div className="relative top-0 left-0 w-screen h-screen z-20 flex justify-center items-start lg:items-center">
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

                                          <div className="w-full flex justify-center items-center relative">
                                            <div
                                              onClick={() => {
                                                props.setFieldValue(
                                                  `fabrics[${index}].translateEnabled`,
                                                  false
                                                );
                                              }}
                                              className="cursor-pointer hover:scale-105 hover:rotate-6 transition-all my-4 lg:absolute bg-red-600 p-2 lg:-right-10 -top-20 scale-125 lg:-top-10 rounded-full w-10 h-10 flex justify-center items-center text-center"
                                            >
                                              <IoClose
                                                color="white"
                                                size={40}
                                              />
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="w-full flex justify-center items-center relative">
                                            <div
                                              onClick={() => {
                                                props.setFieldValue(
                                                  `fabrics[${index}].translateEnabled`,
                                                  false
                                                );
                                              }}
                                              className="cursor-pointer hover:scale-105 hover:rotate-6 transition-all my-4 lg:absolute bg-green-600 p-2 lg:-right-10 -top-20 scale-125 lg:-top-10 rounded-full w-10 h-10 flex justify-center items-center text-center"
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
                                          {props.values.fabrics[index].fabricType &&
                                            <h2 className="text-center w-full m-2">
                                              Girilen Orjinal Değer
                                            </h2>
                                          }
                                          
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
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            {/* ÇEVİRİ eklendiği bölüm yukarıdadır */}
                          </div>
                          {/* fabricDescription - fabric Description inputları yukarıdadır. */}
                        </div>
                      ))}
                    </div>

                    <div className="w-full flex justify-center items-center gap-6 my-6 ">
                      <button
                        type="button"
                        onClick={() =>push({
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
                          })
                        }
                        className="px-3 py-2 rounded-md bg-blue-500 text-white hover:rotate-2 hover:scale-105 transition-all shadow-lg"
                      >
                        Yeni Kumaş Ekle
                      </button>

                      <button
                        type="submit"
                        className="px-4 py-2 rounded-md bg-green-500 text-white hover:rotate-2 hover:scale-105 transition-all shadow-lg"
                      >
                        Gönder
                      </button>
                    </div>
                  </div>
                )}
              </FieldArray>
            </Form>
          )}
        </Formik>
        <div>
        
        </div>
        
        <div className={`
        ${selectedLanguageData && "hidden blur opacity-0"}
        w-full mt-6 flex-row flex-wrap justify-center items-center
        `}>
          {/* verileri aşağıdakicomponent içerisinde listeleriz. */}
          <div className="w-full border-t-4 border-gray-700">
            <ListComponent
            NewData={NewData}
            setUpdateData={setUpdateData}
            setNewData={setNewData}
            setIsloading={setIsloading}
            isloading={isloading}
            selectedLanguageData={selectedLanguageData}
            setSelectedLanguageData={setSelectedLanguageData}
            />
          </div>
        </div>
      </div>


      { //  listedeki dil iconuna basınca dilleri göstermek için açılan ekran aşağıdadır.
        selectedLanguageData && selectedLanguageData !== "" &&
          <div className='absolute top-0 left-0 w-full z-40 bg-black bg-opacity-90 h-screen flex justify-center items-center'>
            <div className='relative top-0 left-0 w-full flex justify-center item-center'>
              <div className=' bg-white rounded-lg min-h-screen lg:min-h-min'>
                <div className='flex flex-row flex-nowrap justify-center items-center gap-2'>
                  <div className='flex flex-col justify-center items-center gap-2 p-2'>

                    <div className='w-full flex flex-row gap-2 justify-center item-center flex-wrap bg-black lg:bg-opacity-0 p-2 rounded'>
                      <div className=' rounded flex flex-row flex-nowrap gap-2 w-full'>
                        <h3 className=' p-2 w-full bg-black rounded-lg text-white text-center text-xl'>
                          Dil Çevrisi - Kumaş Bilgileri
                        </h3>
                      </div>
                    </div>

                    <div className='w-full flex flex-row gap-2 justify-center item-center flex-wrap bg-blue-200 lg:bg-opacity-0 p-2 rounded'>
                      <div className='bg-blue-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                        <h3 className='text-center font-bold'>Kumaş Tipi Türkçe :</h3>
                        <h4 className='text-center'>{selectedLanguageData.fabricTypeTurkish}</h4>
                      </div>
                      <div className='bg-blue-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                        <h3 className='text-center font-bold'>Açıklama Türkçe :</h3>
                        <h4 className='text-center'>{selectedLanguageData.fabricDescriptionTurkish}</h4>
                      </div>
                      <div className='bg-blue-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                        <h3 className='text-center font-bold'>Kartela Adı Türkçe :</h3>
                        <h4 className='text-center'>{selectedLanguageData.fabricSwatchTurkish}</h4>
                      </div>
                    </div>

                    <div className='w-full flex flex-row gap-2 justify-center item-center flex-wrap bg-orange-200 lg:bg-opacity-0 p-2 rounded'>
                      <div className='bg-orange-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                        <h3 className='text-center font-bold'>Kumaş Tipi İngilizce :</h3>
                        <h4 className='text-center'>{selectedLanguageData.fabricTypeEnglish}</h4>
                      </div>
                      <div className='bg-orange-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                        <h3 className='text-center font-bold'>Açıklama İngilizce :</h3>
                        <h4 className='text-center'>{selectedLanguageData.fabricDescriptionEnglish}</h4>
                      </div>
                      <div className='bg-orange-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                        <h3 className='text-center font-bold'>Kartela Adı İngilizce :</h3>
                        <h4 className='text-center'>{selectedLanguageData.fabricSwatchEnglish}</h4>
                      </div>
                    </div>

                    <div className='w-full flex flex-row gap-2 justify-center item-center flex-wrap bg-green-200 lg:bg-opacity-0 p-2 rounded'>
                      <div className='bg-green-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                        <h3 className='text-center font-bold'>Kumaş Tipi Ukraynaca :</h3>
                        <h4 className='text-center'>{selectedLanguageData.fabricTypeUkrainian}</h4>
                      </div>
                      <div className='bg-green-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                        <h3 className='text-center font-bold'>Açıklama Ukraynaca :</h3>
                        <h4 className='text-center'>{selectedLanguageData.fabricDescriptionUkrainian}</h4>
                      </div>
                      <div className='bg-green-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                        <h3 className='text-center font-bold'>Kartela Adı Ukraynaca :</h3>
                        <h4 className='text-center'>{selectedLanguageData.fabricSwatchUkrainian}</h4>
                      </div>
                    </div>

                    <div>
                    <div className='bg-red-600 m-2 p-2 rounded-full cursor-pointer hover:scale-105 transition hover:rotate-6 hover:border-2 hover:border-white '
                      onClick={()=>{setSelectedLanguageData("")}}
                      >
                      <IoClose color="white" size={40} />
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
      }
    </>
  );
}

export default FabricsComponent;
