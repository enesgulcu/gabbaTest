'use client';
import React from 'react';
import { postAPI, getAPI } from '@/services/fetchAPI';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import Image from 'next/image';
import LoadingScreen from '@/components/other/loading';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { IoClose, IoCheckmarkDoneSharp } from 'react-icons/io5';
import ResizeImage from '@/functions/others/resizeImage';
import ListComponent from '@/components/createProduct/Metals/listComponent';
import MetalsValidationSchema from './formikData';
import EditComponent from '@/components/createProduct/Metals/editComponent';

const MetalsComponent = () => {
  const initialValues = {
    metals: [
      {
        metalType: '',
        metalDescription: '',
        image: '',

        translateEnabled: false,

        metalTypeTurkish: '',
        metalTypeUkrainian: '',
        metalTypeEnglish: '',

        metalDescriptionTurkish: '',
        metalDescriptionUkrainian: '',
        metalDescriptionEnglish: '',
      },
    ],
  };

  const [isloading, setIsloading] = useState(false);
  const [NewData, setNewData] = useState('');
  const [isUpdateActive, setIsUpdateActive] = useState(false);
  const [updateData, setUpdateData] = useState('');
  const [selectedLanguageData, setSelectedLanguageData] = useState('');

  const getData = async () => {
    try {
      setIsloading(true);
      const response = await getAPI('/createProduct/metals');

      if (!response) {
        throw new Error('Veri çekilemedi 2');
      }

      if (response.status !== 'success') {
        throw new Error('Veri çekilemedi 3');
      }
      setNewData(response.data);
      setIsloading(false);
    } catch (error) {
      setIsloading(false);

      toast.error(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    // "updateData" state'i değiştiğinde çalışır.
    if (updateData) {
      setIsUpdateActive(true);
    } else {
      setIsUpdateActive(false);
    }
    getData();
  }, [updateData]);

  const keyMappings = {
    metalType: 'Metal Tipi',
    metalDescription: 'Ek Açıklama',
    image: 'Resim',
    metalTypeTurkish: 'Metal Tipi (TR)',
    metalTypeUkrainian: 'Metal Tipi (UA)',
    metalTypeEnglish: 'Metal Tipi (EN)',
    metalDescriptionTurkish: 'Ek Açıklama (TR)',
    metalDescriptionUkrainian: 'Ek Açıklama (UA)',
    metalDescriptionEnglish: 'Ek Açıklama (EN)',
  };

  const filteredData = Object.keys(updateData).reduce((acc, key) => {
    if (
      updateData[key] !== '' &&
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
        <div
          className={`        
        ${
          isloading || (selectedLanguageData && 'blur')
        } cursor-default w-screen absolute bg-black bg-opacity-90 z-50 py-4 min-h-screen max-w-full`}
        >
          <div className='flex-col w-full h-full flex justify-center items-center'>
            <div className='w-auto flex justify-center items-center flex-col font-bold'>
              {/* // UPDATE EKRANI VERİ BİLGİSİ Aşağıdadır*/}
              <div className='w-full'>
                <div className='bg-white overflow-hidden shadow-md rounded-lg'>
                  <div className='p-2'>
                    <h3 className='text-lg leading-6 font-medium text-gray-900 text-center'>
                      Eski Veri
                    </h3>

                    {/* 
                        keyMappings[key] -> obje başlıklarını listeler
                        filteredData[key] -> obje içindeki değerleri listeler 
                    */}
                    <div className='mt-2 flex flex-row flex-wrap justify-center items-start gap-2'>
                      {Object.keys(filteredData).map((key) => (
                        <div
                          key={key}
                          className={`p-2 rounded
                        ${key === 'metalType' && ' bg-blue-500 w-full'}
                        ${key === 'metalDescription' && ' bg-blue-500 w-full'}
                        ${key === 'image' && ' order-first bg-gray-100 w-full'}
                        ${key === 'metalTypeTurkish' && ' bg-orange-400'}
                        ${key === 'metalTypeUkrainian' && ' bg-orange-400'}
                        ${key === 'metalTypeEnglish' && ' bg-orange-400'}
                        ${key === 'metalDescriptionTurkish' && 'bg-orange-400 '}
                        ${
                          key === 'metalDescriptionUkrainian' &&
                          ' bg-orange-400'
                        }
                        ${key === 'metalDescriptionEnglish' && ' bg-orange-400'}

                        `}
                        >
                          {key === 'image' ? (
                            <div
                              className={`flex justify-center items-center text-center flex-col`}
                            >
                              <h3 className='text-black'>{keyMappings[key]}</h3>
                              <div className='flex justify-center items-center order-last'>
                                <Image
                                  className='rounded-lg shadow-lg'
                                  src={filteredData[key]}
                                  height={200}
                                  width={200}
                                  alt='Metal Resmi'
                                />
                              </div>
                            </div>
                          ) : key === 'metalType' ||
                            key === 'metalDescription' ? (
                            <div className='flex flex-row flex-nowrap gap-2'>
                              <h3 className='text-white'>
                                {keyMappings[key]} :
                              </h3>
                              <h4 className='text-white font-normal'>
                                {filteredData[key]}
                              </h4>
                            </div>
                          ) : (
                            <div className='flex flex-row flex-nowrap gap-2'>
                              <h3 className='text-white'>
                                {keyMappings[key]} :
                              </h3>
                              <h4 className='text-white'>
                                {filteredData[key]}
                              </h4>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* // UPDATE EKRANI VERİ BİLGİSİ Yukarıdadır*/}
            </div>
            <div
              className='bg-red-600 m-2 p-2 rounded-full cursor-pointer hover:scale-105 transition hover:rotate-6 hover:border-2 hover:border-white '
              onClick={() => {
                setUpdateData('');
              }}
            >
              <IoClose color='white' size={40} />
            </div>

            <EditComponent
              updateData={updateData}
              setUpdateData={setUpdateData}
              NewData={NewData}
              setIsloading={setIsloading}
              isloading={isloading}
            />
          </div>
        </div>
      )}
      {/* // UPDATE EKRANI Yukarıdadır */}

      <div
        className={`w-full ${
          isloading || selectedLanguageData
            ? ' blur max-h-screen overflow-hidden'
            : ' blur-none'
        } ${isUpdateActive && 'blur-sm max-h-screen overflow-hidden'}
        `}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={MetalsValidationSchema}
          onSubmit={async (value) => {
            setIsloading(true);

            const responseData = await postAPI('/createProduct/metals', value);

            if (
              responseData.status !== 'success' ||
              responseData.status == 'error'
            ) {
              setIsloading(false);
              toast.error(responseData.error);
            } else {
              // veriyi çek ve state'e at
              getData();
              setIsloading(false);
              toast.success('Tüm Veriler Başarıyla Eklendi!');

              // form verilerini sıfırla.
              value.metals = [
                {
                  metalType: '',
                  metalDescription: '',
                  image: '',

                  translateEnabled: false,

                  metalTypeTurkish: '',
                  metalTypeUkrainian: '',
                  metalTypeEnglish: '',

                  metalDescriptionTurkish: '',
                  metalDescriptionUkrainian: '',
                  metalDescriptionEnglish: '',
                },
              ];

              // arayüzdeki input içindeki değerleri sil ve sıfırla.
              document.getElementById(`metals[${0}].metalType`).value = '';
              document.getElementById(`metals[${0}].metalDescription`).value =
                '';
              document.getElementById(`metals[${0}].image`).value = '';
              document.getElementById(`metals[${0}].metalTypeTurkish`).value =
                '';
              document.getElementById(`metals[${0}].metalTypeUkrainian`).value =
                '';
              document.getElementById(`metals[${0}].metalTypeEnglish`).value =
                '';
              document.getElementById(
                `metals[${0}].metalDescriptionTurkish`
              ).value = '';
              document.getElementById(
                `metals[${0}].metalDescriptionUkrainian`
              ).value = '';
              document.getElementById(
                `metals[${0}].metalDescriptionEnglish`
              ).value = '';
            }
          }}
        >
          {(props) => (
            <Form onSubmit={props.handleSubmit}>
              <FieldArray name='metals'>
                {({ insert, push, remove }) => (
                  <div>
                    <div>
                      {props.values.metals.map((measurement, index) => (
                        <div
                          key={index}
                          className={` lg:px-10 hover:bg-yellow-400 p-4 transition-all w-full flex-col xl:flex-row flex flex-wrap xl:justify-center justify-center item-center xl:items-start gap-4 ${
                            index % 2 ? 'bg-white' : 'bg-gray-100'
                          }`}
                        >
                          {/* Metal kaldırma butonu aşağıdadır. */}
                          <div className='flex justify-center items-center gap-4'>
                            <button
                              className='hover:scale-110 hover:rotate-6 transition-all'
                              type='button'
                              onClick={() => {
                                if (props.values.metals.length > 1) {
                                  // burada Metal birimini sileceğiz.
                                  const newPropsValues =
                                    props.values.metals.filter(
                                      // tıklanan değeri sil diğerlerini listelemeye deva met demektir...
                                      (item, i) => i !== index
                                    );
                                  props.setFieldValue('metals', newPropsValues);
                                }
                              }}
                            >
                              <p className='bg-red-600 text-white p-2 rounded-md'>
                                {' '}
                                <MdOutlineCancel size={25} />{' '}
                              </p>
                            </button>

                            <label
                              htmlFor={`measure-${index}`}
                              className='whitespace-nowrap font-semibold flex justify-center items-center'
                            >
                              <div className='flex justify-start items-center flex-row gap-2'>
                                <span className='flex justify-center items-center w-[25px] h-[25px] rounded-full bg-black text-white'>
                                  {`${index + 1}`}
                                </span>{' '}
                                - Metal Ekle
                              </div>
                            </label>
                          </div>
                          {/* Metal kaldırma butonu yukarıdadır. */}

                          {/* metalType - metalDescription inputları aşağıdadır. */}
                          <div className='flex flex-col lg:flex-row flex-wrap lg:flex-nowrap gap-4 justify-center item-center lg:items-start'>
                            {/* metalDescription input aşağıdadır.*/}
                            <div className='flex flex-col justify-center items-center '>
                              <Field
                                onChange={props.handleChange}
                                id={`metals[${index}].metalType`}
                                name={`metals[${index}].metalType`}
                                value={props.values.metals[index].metalType}
                                className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[250px]`}
                                type='text'
                                placeholder='Metal tipini giriniz.'
                              />

                              <ErrorMessage
                                name={`metals[${index}].metalType`}
                                component='div'
                                className='field-error text-red-600 m-1'
                              />
                            </div>
                            <div className='flex flex-col justify-center items-center '>
                              <Field
                                onChange={props.handleChange}
                                id={`metals[${index}].metalDescription`}
                                name={`metals[${index}].metalDescription`}
                                value={
                                  props.values.metals[index].metalDescription
                                }
                                className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[250px]`}
                                type='text'
                                placeholder='Metal açıklamasını giriniz.'
                              />

                              <ErrorMessage
                                name={`metals[${index}].metalDescription`}
                                component='div'
                                className='field-error text-red-600 m-1'
                              />
                            </div>
                            <div className='flex flex-row flex-nowrap justify-center items-center gap-2'>
                              <div className='hover:scale-105 transition-all relative border rounded-lg overflow-hidden'>
                                <Field
                                  type='file'
                                  id={`metals[${index}].image`}
                                  name={`metals[${index}].image`}
                                  accept='image/*'
                                  className='opacity-0 cursor-pointer w-28 h-10'
                                  value={props.values.image}
                                  onChange={async (event) => {
                                    const file = event.target.files[0];
                                    if (!file) return;

                                    const resizedImageBase64 =
                                      await ResizeImage(file, 400, 400);
                                    props.setFieldValue(
                                      `metals[${index}].image`,
                                      resizedImageBase64
                                    );
                                  }}
                                />
                                <label
                                  htmlFor={`metals[${index}].image`}
                                  className={
                                    props.values.metals[index].image
                                      ? 'absolute inset-0 text-center p-2  bg-purple-600 text-white cursor-pointer transition  whitespace-nowrap'
                                      : 'absolute inset-0 text-center p-2  bg-blue-600 text-white cursor-pointer transition whitespace-nowrap'
                                  }
                                >
                                  {' '}
                                  {props.values.metals[index].image
                                    ? 'Resim Seçildi'
                                    : 'Resim Seç'}
                                </label>
                              </div>
                              {props.values.metals[index].image && (
                                <div className=' hover:scale-125 transition-all hover:rotate-6'>
                                  <button
                                    className=''
                                    onClick={() => {
                                      props.values.metals[index].image &&
                                        props.setFieldValue(
                                          `metals[${index}].image`,
                                          ''
                                        );
                                    }}
                                  >
                                    <IoClose />
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* ÇEVİRİ eklendiği bölüm aşağıdadır */}
                            <div className='flex flex-row flex-wrap justify-center xl:justify-around gap-2 items-center cursor-pointer'>
                              <div className='flex justify-center items-center gap-2 max-w-[%90]'>
                                <div className='flex justify-center items-center flex-row gap-2'>
                                  {
                                    <div className='flex justify-center items-center flex-row gap-2 rounded-lg'>
                                      {props.values.metals[index]
                                        .metalTypeTurkish != '' &&
                                        props.values.metals[index]
                                          .metalTypeTurkish && (
                                          <Image
                                            className='cursor-default rounded-full'
                                            src='/tr_flag.svg'
                                            height={25}
                                            width={25}
                                            alt='TrFlag'
                                          />
                                        )}
                                      {props.values.metals[index]
                                        .metalTypeUkrainian != '' &&
                                        props.values.metals[index]
                                          .metalTypeUkrainian && (
                                          <Image
                                            className='cursor-default rounded-full'
                                            src='/ua_flag.svg'
                                            height={25}
                                            width={25}
                                            alt='TrFlag'
                                          />
                                        )}
                                      {props.values.metals[index]
                                        .metalTypeEnglish != '' &&
                                        props.values.metals[index]
                                          .metalTypeEnglish && (
                                          <Image
                                            className='cursor-default rounded-full'
                                            src='/en_flag.svg'
                                            height={25}
                                            width={25}
                                            alt='TrFlag'
                                          />
                                        )}
                                    </div>
                                  }

                                  <Image
                                    onClick={() => {
                                      props.setFieldValue(
                                        `metals[${index}].translateEnabled`,
                                        true
                                      );
                                    }}
                                    className='hover:scale-105 transition-all cursor-pointer'
                                    src='/translate.svg'
                                    height={30}
                                    width={40}
                                    alt='TrFlag'
                                  />
                                </div>

                                {props.values.metals[index]
                                  .translateEnabled && (
                                  <div className=' cursor-default absolute w-screen h-[1600px] max-h-screen lg:h-screen z-50 left-0 top-0 bg-black bg-opacity-90'>
                                    <div className='relative top-0 left-0 w-screen h-screen z-20 flex justify-center items-start lg:items-center'>
                                      <div className='p-2 bg-white rounded-lg relative pt-10 lg:pt-2 flex justify-center items-center flex-col'>
                                        {props.values.metals[index]
                                          .metalTypeTurkish == '' &&
                                        props.values.metals[index]
                                          .metalTypeUkrainian == '' &&
                                        props.values.metals[index]
                                          .metalTypeEnglish == '' &&
                                        props.values.metals[index]
                                          .metalDescriptionTurkish == '' &&
                                        props.values.metals[index]
                                          .metalDescriptionUkrainian == '' &&
                                        props.values.metals[index]
                                          .metalDescriptionEnglish == '' ? (
                                          <div className='w-full flex justify-center items-center relative'>
                                            <div
                                              onClick={() => {
                                                props.setFieldValue(
                                                  `metals[${index}].translateEnabled`,
                                                  false
                                                );
                                              }}
                                              className='cursor-pointer hover:scale-105 hover:rotate-6 transition-all my-4 lg:absolute bg-red-600 p-2 lg:-right-10 -top-20 scale-125 lg:-top-10 rounded-full w-10 h-10 flex justify-center items-center text-center'
                                            >
                                              <IoClose
                                                color='white'
                                                size={40}
                                              />
                                            </div>
                                          </div>
                                        ) : (
                                          <div className='w-full flex justify-center items-center relative'>
                                            <div
                                              onClick={() => {
                                                props.setFieldValue(
                                                  `metals[${index}].translateEnabled`,
                                                  false
                                                );
                                              }}
                                              className='cursor-pointer hover:scale-105 hover:rotate-6 transition-all my-4 lg:absolute bg-green-600 p-2 lg:-right-10 -top-20 scale-125 lg:-top-10 rounded-full w-10 h-10 flex justify-center items-center text-center'
                                            >
                                              <IoCheckmarkDoneSharp
                                                color='white'
                                                size={40}
                                              />
                                            </div>
                                          </div>
                                        )}

                                        <h2 className='text-xl font-semibold p-2 bg-blue-600 text-white rounded-lg w-full text-center'>
                                          {`${index + 1}`} - Metal Ekle (Çeviri
                                          İşlemleri)
                                        </h2>
                                        <h2 className='text-center w-full m-2'>
                                          Girilen Orjinal Değer
                                        </h2>
                                        <div className='flex flex-col gap-2 md:gap-2 justify-center items-center w-full '>
                                          {props.values.metals[index]
                                            .metalType && (
                                            <div className='bg-black p-1 w-full rounded-lg text-white mb-2'>
                                              <h3 className='font-bold text-black bg-gray-200 inline-block p-2 rounded mr-2 min-w-[115px] text-end'>
                                                Metal Tipi :
                                              </h3>
                                              {
                                                props.values.metals[index]
                                                  .metalType
                                              }
                                            </div>
                                          )}
                                          {props.values.metals[index]
                                            .metalDescription && (
                                            <div className='bg-black p-1 w-full rounded-lg text-white mb-2'>
                                              <h3 className='font-bold text-black bg-gray-200 inline-block p-2 rounded mr-2 min-w-[115px] text-end'>
                                                Açıklama :
                                              </h3>
                                              {
                                                props.values.metals[index]
                                                  .metalDescription
                                              }
                                            </div>
                                          )}
                                        </div>
                                        {/* Türkçe çeviri alanı */}
                                        <div className='w-full flex pl-1 justify-center item-center flex-row flex-nowrap gap-2'>
                                          <Image
                                            className='hover:scale-105 transition-all'
                                            src='/tr_flag.svg'
                                            height={40}
                                            width={40}
                                            alt='TrFlag'
                                          />

                                          <Field
                                            onChange={props.handleChange}
                                            id={`metals[${index}].metalTypeTurkish`}
                                            name={`metals[${index}].metalTypeTurkish`}
                                            value={
                                              props.values.metals[index]
                                                .metalTypeTurkish
                                            }
                                            className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                            type='text'
                                            placeholder='Metal Tipi Türkçe'
                                          />
                                        </div>

                                        <div className='w-full flex pl-1 justify-center item-center flex-row flex-nowrap gap-2'>
                                          <Image
                                            className='hover:scale-105 transition-all'
                                            src='/tr_flag.svg'
                                            height={40}
                                            width={40}
                                            alt='TrFlag'
                                          />

                                          <Field
                                            onChange={props.handleChange}
                                            id={`metals[${index}].metalDescriptionTurkish`}
                                            name={`metals[${index}].metalDescriptionTurkish`}
                                            value={
                                              props.values.metals[index]
                                                .metalDescriptionTurkish
                                            }
                                            className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                            type='text'
                                            placeholder='Açıklama Türkçe'
                                          />
                                        </div>

                                        {/* Ukrayna çeviri alanı */}
                                        <div className='bg-gray-100 pl-1 rounded-t w-full flex justify-center item-center flex-row flex-nowrap gap-2'>
                                          <Image
                                            className='hover:scale-105 transition-all'
                                            src='/ua_flag.svg'
                                            height={40}
                                            width={40}
                                            alt='TrFlag'
                                          />

                                          <Field
                                            onChange={props.handleChange}
                                            id={`metals[${index}].metalTypeUkrainian`}
                                            name={`metals[${index}].metalTypeUkrainian`}
                                            value={
                                              props.values.metals[index]
                                                .metalTypeUkrainian
                                            }
                                            className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                            type='text'
                                            placeholder='Metal Tipi Ukraynaca'
                                          />
                                        </div>
                                        <div className='bg-gray-100 pl-1 w-full flex justify-center item-center flex-row flex-nowrap gap-2'>
                                          <Image
                                            className='hover:scale-105 transition-all'
                                            src='/ua_flag.svg'
                                            height={40}
                                            width={40}
                                            alt='TrFlag'
                                          />
                                          <Field
                                            onChange={props.handleChange}
                                            id={`metals[${index}].metalDescriptionUkrainian`}
                                            name={`metals[${index}].metalDescriptionUkrainian`}
                                            value={
                                              props.values.metals[index]
                                                .metalDescriptionUkrainian
                                            }
                                            className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                            type='text'
                                            placeholder='Açıklama Ukraynaca'
                                          />
                                        </div>

                                        {/* English çeviri alanı */}
                                        <div className='w-full pl-1 flex justify-center item-center flex-row flex-nowrap gap-2'>
                                          <Image
                                            className='hover:scale-105 transition-all'
                                            src='/en_flag.svg'
                                            height={40}
                                            width={40}
                                            alt='TrFlag'
                                          />

                                          <Field
                                            onChange={props.handleChange}
                                            id={`metals[${index}].metalTypeEnglish`}
                                            name={`metals[${index}].metalTypeEnglish`}
                                            value={
                                              props.values.metals[index]
                                                .metalTypeEnglish
                                            }
                                            className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                            type='text'
                                            placeholder='Metal Tipi İngilizce'
                                          />
                                        </div>

                                        <div className='w-full pl-1 flex justify-center item-center flex-row flex-nowrap gap-2'>
                                          <Image
                                            className='hover:scale-105 transition-all'
                                            src='/en_flag.svg'
                                            height={40}
                                            width={40}
                                            alt='TrFlag'
                                          />
                                          <Field
                                            onChange={props.handleChange}
                                            id={`metals[${index}].metalDescriptionEnglish`}
                                            name={`metals[${index}].metalDescriptionEnglish`}
                                            value={
                                              props.values.metals[index]
                                                .metalDescriptionEnglish
                                            }
                                            className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                            type='text'
                                            placeholder='Açıklama İngilizce'
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
                          {/* metalDescription - metal Description inputları yukarıdadır. */}
                        </div>
                      ))}
                    </div>

                    <div className='w-full flex justify-center items-center gap-6 my-6 '>
                      <button
                        type='button'
                        onClick={() =>
                          push({
                            metalType: '',
                            metalDescription: '',
                            image: '',

                            translateEnabled: false,

                            metalTypeTurkish: '',
                            metalTypeUkrainian: '',
                            metalTypeEnglish: '',

                            metalDescriptionTurkish: '',
                            metalDescriptionUkrainian: '',
                            metalDescriptionEnglish: '',
                          })
                        }
                        className='px-3 py-2 rounded-md bg-blue-500 text-white hover:rotate-2 hover:scale-105 transition-all shadow-lg'
                      >
                        Yeni Metal Ekle
                      </button>

                      <button
                        type='submit'
                        className='px-4 py-2 rounded-md bg-green-500 text-white hover:rotate-2 hover:scale-105 transition-all shadow-lg'
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
        <div></div>

        <div
          className={`
        ${selectedLanguageData && 'hidden blur opacity-0'}
        w-full mt-6 flex-row flex-wrap justify-center items-center
        `}
        >
          {/* verileri aşağıdakicomponent içerisinde listeleriz. */}
          <div className='w-full border-t-4 border-gray-700'>
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

      {
        //  listedeki dil iconuna basınca dilleri göstermek için açılan ekran aşağıdadır.
        selectedLanguageData && selectedLanguageData !== '' && (
          <div className='absolute top-0 left-0 w-full z-40 bg-black bg-opacity-90 h-screen flex justify-center items-center'>
            <div className='relative top-0 left-0 w-full flex justify-center item-center'>
              <div className=' bg-white rounded-lg min-h-screen lg:min-h-min'>
                <div className='flex flex-row flex-nowrap justify-center items-center gap-2'>
                  <div className='flex flex-col justify-center items-center gap-2 p-2'>
                    <div className='w-full flex flex-row gap-2 justify-center item-center flex-wrap bg-black lg:bg-opacity-0 p-2 rounded'>
                      <div className=' rounded flex flex-row flex-nowrap gap-2 w-full'>
                        <h3 className=' p-2 w-full bg-black rounded-lg text-white text-center text-xl'>
                          Dil Çevrisi - Metal Bilgileri
                        </h3>
                      </div>
                    </div>

                    <div className='w-full flex flex-row gap-2 justify-center item-center flex-wrap bg-blue-200 lg:bg-opacity-0 p-2 rounded'>
                      <div className='bg-blue-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                        <h3 className='text-center font-bold'>
                          Metal Tipi Türkçe :
                        </h3>
                        <h4 className='text-center'>
                          {selectedLanguageData.metalTypeTurkish}
                        </h4>
                      </div>
                      <div className='bg-blue-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                        <h3 className='text-center font-bold'>
                          Açıklama Türkçe :
                        </h3>
                        <h4 className='text-center'>
                          {selectedLanguageData.metalDescriptionTurkish}
                        </h4>
                      </div>
                    </div>

                    <div className='w-full flex flex-row gap-2 justify-center item-center flex-wrap bg-orange-200 lg:bg-opacity-0 p-2 rounded'>
                      <div className='bg-orange-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                        <h3 className='text-center font-bold'>
                          Metal Tipi İngilizce :
                        </h3>
                        <h4 className='text-center'>
                          {selectedLanguageData.metalTypeEnglish}
                        </h4>
                      </div>
                      <div className='bg-orange-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                        <h3 className='text-center font-bold'>
                          Açıklama İngilizce :
                        </h3>
                        <h4 className='text-center'>
                          {selectedLanguageData.metalDescriptionEnglish}
                        </h4>
                      </div>
                    </div>

                    <div className='w-full flex flex-row gap-2 justify-center item-center flex-wrap bg-green-200 lg:bg-opacity-0 p-2 rounded'>
                      <div className='bg-green-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                        <h3 className='text-center font-bold'>
                          Metal Tipi Ukraynaca :
                        </h3>
                        <h4 className='text-center'>
                          {selectedLanguageData.metalTypeUkrainian}
                        </h4>
                      </div>
                      <div className='bg-green-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                        <h3 className='text-center font-bold'>
                          Açıklama Ukraynaca :
                        </h3>
                        <h4 className='text-center'>
                          {selectedLanguageData.metalDescriptionUkrainian}
                        </h4>
                      </div>
                    </div>

                    <div>
                      <div
                        className='bg-red-600 m-2 p-2 rounded-full cursor-pointer hover:scale-105 transition hover:rotate-6 hover:border-2 hover:border-white '
                        onClick={() => {
                          setSelectedLanguageData('');
                        }}
                      >
                        <IoClose color='white' size={40} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};

export default MetalsComponent;
