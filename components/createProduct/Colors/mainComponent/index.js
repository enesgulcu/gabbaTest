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
import {
  IoClose,
  IoCheckmarkDoneSharp,
  IoAddOutline,
  IoCloseOutline,
} from 'react-icons/io5';
import ListComponent from '@/components/createProduct/Colors/listComponent';
import ColorsValidationSchema from './formikData';
import EditComponent from '@/components/createProduct/Colors/editComponent';
import ResizeImage from '@/functions/others/resizeImage';
import HandleImageClick from '@/functions/others/HandleImageClick';

const ColorsComponent = () => {
  const initialValues = {
    colors: [
      {
        colourType: '',
        colourDescription: '',

        translateEnabled: false,
        colourPickerEnabled: false,
        colourHex: '',
        image: '',

        colourTypeTurkish: '',
        colourTypeUkrainian: '',
        colourTypeEnglish: '',

        colourDescriptionTurkish: '',
        colourDescriptionUkrainian: '',
        colourDescriptionEnglish: '',
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
      const response = await getAPI('/createProduct/colors');

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
    colourType: 'Colour Tipi',
    colourDescription: 'Ek Açıklama',
    colourHex: 'Hex Kodu',
    colourTypeTurkish: 'Colour Tipi (TR)',
    colourTypeUkrainian: 'Colour Tipi (UA)',
    colourTypeEnglish: 'Colour Tipi (EN)',
    colourDescriptionTurkish: 'Ek Açıklama (TR)',
    colourDescriptionUkrainian: 'Ek Açıklama (UA)',
    colourDescriptionEnglish: 'Ek Açıklama (EN)',
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
                          style={{
                            backgroundColor: `${
                              key === 'colourHex' ? filteredData[key] : ''
                            }`,
                          }}
                          key={key}
                          className={`p-2 rounded
                          ${key === 'colourType' && ' bg-blue-500 w-full'}
                          ${
                            key === 'colourDescription' && ' bg-blue-500 w-full'
                          }
                          ${key === 'colourHex' && ' w-full'}

                          ${key === 'colourTypeTurkish' && ' bg-orange-400'}
                          ${key === 'colourTypeUkrainian' && ' bg-orange-400'}
                          ${key === 'colourTypeEnglish' && ' bg-orange-400'}
                          ${
                            key === 'colourDescriptionTurkish' &&
                            'bg-orange-400 '
                          }
                          ${
                            key === 'colourDescriptionUkrainian' &&
                            ' bg-orange-400'
                          }
                          ${
                            key === 'colourDescriptionEnglish' &&
                            ' bg-orange-400'
                          }
                          `}
                        >
                          {key === 'colourType' ||
                          key === 'colourDescription' ? (
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
          validationSchema={ColorsValidationSchema}
          onSubmit={async (value) => {
            setIsloading(true);

            const responseData = await postAPI('/createProduct/colors', value);

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
              value.colors = [
                {
                  colourType: '',
                  colourDescription: '',

                  translateEnabled: false,
                  colourPickerEnabled: false,
                  colourHex: '',
                  image: '',

                  colourTypeTurkish: '',
                  colourTypeUkrainian: '',
                  colourTypeEnglish: '',

                  colourDescriptionTurkish: '',
                  colourDescriptionUkrainian: '',
                  colourDescriptionEnglish: '',
                },
              ];

              // arayüzdeki input içindeki değerleri sil ve sıfırla.
              document.getElementById(`colors[${0}].colourType`).value = '';
              document.getElementById(`colors[${0}].colourDescription`).value =
                '';

              document.getElementById(`colors[${0}].translateEnabled`).value =
                '';
              document.getElementById(
                `colors[${0}].colourPickerEnabled`
              ).value = '';
              document.getElementById(`colors[${0}].colourHex`).value = '';
              document.getElementById(`colors[${0}].image`).value = '';

              document.getElementById(`colors[${0}].colourTypeTurkish`).value =
                '';
              document.getElementById(
                `colors[${0}].colourTypeUkrainian`
              ).value = '';
              document.getElementById(`colors[${0}].colourTypeEnglish`).value =
                '';
              document.getElementById(
                `colors[${0}].colourDescriptionTurkish`
              ).value = '';
              document.getElementById(
                `colors[${0}].colourDescriptionUkrainian`
              ).value = '';
              document.getElementById(
                `colors[${0}].colourDescriptionEnglish`
              ).value = '';
            }
          }}
        >
          {(props) => (
            <Form onSubmit={props.handleSubmit}>
              <FieldArray name='colors'>
                {({ insert, push, remove }) => (
                  <div>
                    <div>
                      {props.values.colors.map((measurement, index) => (
                        <div
                          key={index}
                          className={` lg:px-10 hover:bg-yellow-400 p-4 transition-all w-full flex-col xl:flex-row flex flex-wrap xl:justify-center justify-center item-center xl:items-start gap-4 ${
                            index % 2 ? 'bg-white' : 'bg-gray-100'
                          }`}
                        >
                          {/* Colour kaldırma butonu aşağıdadır. */}
                          <div className='flex justify-center items-center gap-4'>
                            <button
                              className='hover:scale-110 hover:rotate-6 transition-all'
                              type='button'
                              onClick={() => {
                                if (props.values.colors.length > 1) {
                                  // burada Colour birimini sileceğiz.
                                  const newPropsValues =
                                    props.values.colors.filter(
                                      // tıklanan değeri sil diğerlerini listelemeye devamet demektir...
                                      (item, i) => i !== index
                                    );
                                  props.setFieldValue('colors', newPropsValues);
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
                                - Renk Ekle
                              </div>
                            </label>
                          </div>
                          {/* Colour kaldırma butonu yukarıdadır. */}

                          {/* colourType - colourDescription inputları aşağıdadır. */}
                          <div className='flex flex-col lg:flex-row flex-wrap lg:flex-nowrap gap-4 justify-center item-center lg:items-start'>
                            {/* colourDescription input aşağıdadır.*/}
                            <div className='flex flex-col justify-center items-center '>
                              <Field
                                onChange={props.handleChange}
                                id={`colors[${index}].colourType`}
                                name={`colors[${index}].colourType`}
                                value={props.values.colors[index].colourType}
                                className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[250px]`}
                                type='text'
                                placeholder='Renk tipini giriniz.'
                              />

                              <ErrorMessage
                                name={`colors[${index}].colourType`}
                                component='div'
                                className='field-error text-red-600 m-1'
                              />
                            </div>
                            <div className='flex flex-col justify-center items-center '>
                              <Field
                                onChange={props.handleChange}
                                id={`colors[${index}].colourDescription`}
                                name={`colors[${index}].colourDescription`}
                                value={
                                  props.values.colors[index].colourDescription
                                }
                                className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[250px]`}
                                type='text'
                                placeholder='Renk açıklamasını giriniz.'
                              />

                              <ErrorMessage
                                name={`colors[${index}].colourDescription`}
                                component='div'
                                className='field-error text-red-600 m-1'
                              />
                            </div>

                            <div className='flex flex-row justify-center items-center gap-2 flex-wrap '>
                              <div
                                style={{
                                  backgroundColor: `${props.values.colors[index].colourHex}`,
                                }}
                                className='p-[20px] rounded border border-gray-200 bg-white'
                              ></div>
                              <Field
                                onChange={props.handleChange}
                                id={`colors[${index}].colourHex`}
                                name={`colors[${index}].colourHex`}
                                value={props.values.colors[index].colourHex}
                                className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[150px]`}
                                type='text'
                                placeholder='Hex Kodu'
                              />

                              <ErrorMessage
                                name={`colors[${index}].colourHex`}
                                component='div'
                                className='field-error text-red-600 m-1'
                              />
                              <h3>Veya</h3>
                              <div className='flex flex-row flex-nowrap justify-center items-center gap-2'>
                                <div className='hover:scale-105 transition-all relative border rounded-lg overflow-hidden'>
                                  <Field
                                    type='file'
                                    id={`colors[${index}].image`}
                                    name={`colors[${index}].image`}
                                    accept='image/*'
                                    className='opacity-0 cursor-pointer w-44 h-10'
                                    value={props.values.image}
                                    onChange={async (event) => {
                                      const file = event.target.files[0];
                                      if (!file) return;

                                      const resizedImageBase64 =
                                        await ResizeImage(file, 800, 800);
                                      await props.setFieldValue(
                                        `colors[${index}].image`,
                                        resizedImageBase64
                                      );
                                      await props.setFieldValue(
                                        `colors[${index}].colourPickerEnabled`,
                                        true
                                      );
                                    }}
                                  />
                                  <label
                                    onClick={async () => {
                                      await props.setFieldValue(
                                        `colors[${index}].image`,
                                        ''
                                      );
                                    }}
                                    htmlFor={`colors[${index}].image`}
                                    className='absolute inset-0 text-center p-2  bg-blue-600 text-white cursor-pointer transition whitespace-nowrap'
                                  >
                                    Resimden Renk Seç
                                  </label>
                                </div>
                              </div>
                            </div>

                            {/* ÇEVİRİ eklendiği bölüm aşağıdadır */}
                            <div className='flex flex-row flex-wrap justify-center xl:justify-around gap-2 items-center cursor-pointer'>
                              <div className='flex justify-center items-center gap-2 max-w-[%90]'>
                                <div className='flex justify-center items-center flex-row gap-2'>
                                  {
                                    <div className='flex justify-center items-center flex-row gap-2 rounded-lg'>
                                      {props.values.colors[index]
                                        .colourTypeTurkish != '' &&
                                        props.values.colors[index]
                                          .colourTypeTurkish && (
                                          <Image
                                            className='cursor-default rounded-full'
                                            src='/tr_flag.svg'
                                            height={25}
                                            width={25}
                                            alt='TrFlag'
                                          />
                                        )}
                                      {props.values.colors[index]
                                        .colourTypeUkrainian != '' &&
                                        props.values.colors[index]
                                          .colourTypeUkrainian && (
                                          <Image
                                            className='cursor-default rounded-full'
                                            src='/ua_flag.svg'
                                            height={25}
                                            width={25}
                                            alt='TrFlag'
                                          />
                                        )}
                                      {props.values.colors[index]
                                        .colourTypeEnglish != '' &&
                                        props.values.colors[index]
                                          .colourTypeEnglish && (
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
                                        `colors[${index}].translateEnabled`,
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

                                {props.values.colors[index]
                                  .colourPickerEnabled && (
                                  <div className=' cursor-default absolute w-screen h-[1600px] max-h-screen lg:h-screen z-50 left-0 top-0 bg-black bg-opacity-90'>
                                    <div className='relative top-0 left-0 w-screen h-screen z-20 flex justify-center items-center'>
                                      <div className='p-2 bg-white rounded-lg relative pt-10 lg:pt-2 flex justify-center items-center flex-col '>
                                        <div
                                          onClick={async () => {
                                            await props.setFieldValue(
                                              `colors[${index}].colourPickerEnabled`,
                                              false
                                            );
                                            await props.setFieldValue(
                                              `colors[${index}].image`,
                                              ''
                                            );
                                          }}
                                          className='cursor-pointer hover:scale-105 hover:rotate-6 transition-all my-4  bg-red-600 p-2 lg:-right-10 -top-20 scale-125 lg:-top-10 rounded-full w-10 h-10 flex justify-center items-center text-center'
                                        >
                                          <IoClose color='white' size={40} />
                                        </div>

                                        {/* // resmi ekranda göstereceğiz */}
                                        <div className='flex justify-center items-center flex-col'>
                                          <div className='flex flex-row justify-center items-center gap-2 m-2'>
                                            <div className='rounded inline-block'>
                                              Seçilen Renk:
                                            </div>
                                            <div
                                              style={{
                                                backgroundColor: `${props.values.colors[index].colourHex}`,
                                              }}
                                              className={`
                                              ${
                                                props.values.colors[index]
                                                  .colourHex
                                                  ? 'p-4'
                                                  : 'p-2'
                                              }
                                               border-2 border-gray-200 rounded-lg`}
                                            >
                                              {props.values.colors[index]
                                                .colourHex
                                                ? props.values.colors[index]
                                                    .colourHex
                                                : 'Renk Seçilmedi'}
                                            </div>
                                          </div>
                                          <div className='p-2 bg-gray-100 rounded m-2'>
                                            Lütfen resim üzerinde istediğiniz
                                            yere tıklayarak renginizi seçiniz.
                                          </div>
                                          <Image
                                            className='hover:cursor-pointer'
                                            onClick={async (event) => {
                                              await props.setFieldValue(
                                                `colors[${index}].colourHex`,
                                                HandleImageClick(event)
                                              );
                                            }}
                                            src={
                                              props.values.colors[index].image
                                            }
                                            height={600}
                                            width={600}
                                            alt='colorPickerImage'
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {props.values.colors[index]
                                  .translateEnabled && (
                                  <div className=' cursor-default absolute w-screen h-[1600px] lg:h-screen z-50 left-0 top-0 bg-black bg-opacity-90'>
                                    <div className='relative top-0 left-0 w-screen h-screen z-20 flex justify-center items-start lg:items-center'>
                                      <div className='p-2 bg-white rounded-lg relative pt-10 lg:pt-2 flex justify-center items-center flex-col'>
                                        {props.values.colors[index]
                                          .colourTypeTurkish == '' &&
                                        props.values.colors[index]
                                          .colourTypeUkrainian == '' &&
                                        props.values.colors[index]
                                          .colourTypeEnglish == '' &&
                                        props.values.colors[index]
                                          .colourDescriptionTurkish == '' &&
                                        props.values.colors[index]
                                          .colourDescriptionUkrainian == '' &&
                                        props.values.colors[index]
                                          .colourDescriptionEnglish == '' ? (
                                          <div className='w-full flex justify-center items-center relative'>
                                            <div
                                              onClick={() => {
                                                props.setFieldValue(
                                                  `colors[${index}].translateEnabled`,
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
                                                  `colors[${index}].translateEnabled`,
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
                                          {`${index + 1}`} - Renk Ekle (Çeviri
                                          İşlemleri)
                                        </h2>
                                        <h2 className='text-center w-full m-2'>
                                          Girilen Orjinal Değer
                                        </h2>
                                        <div className='flex flex-col gap-2 md:gap-2 justify-center items-center w-full'>
                                          {props.values.colors[index]
                                            .colourType && (
                                            <div className='bg-black p-1 w-full rounded-lg text-white mb-2'>
                                              <h3 className='font-bold text-black bg-gray-200 inline-block p-2 rounded mr-2 min-w-[115px] text-end'>
                                                Colour Tipi :
                                              </h3>
                                              {
                                                props.values.colors[index]
                                                  .colourType
                                              }
                                            </div>
                                          )}
                                          {props.values.colors[index]
                                            .colourDescription && (
                                            <div className='bg-black p-1 w-full rounded-lg text-white mb-2'>
                                              <h3 className='font-bold text-black bg-gray-200 inline-block p-2 rounded mr-2 min-w-[115px] text-end'>
                                                Açıklama :
                                              </h3>
                                              {
                                                props.values.colors[index]
                                                  .colourDescription
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
                                            id={`colors[${index}].colourTypeTurkish`}
                                            name={`colors[${index}].colourTypeTurkish`}
                                            value={
                                              props.values.colors[index]
                                                .colourTypeTurkish
                                            }
                                            className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                            type='text'
                                            placeholder='Colour Tipi Türkçe'
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
                                            id={`colors[${index}].colourDescriptionTurkish`}
                                            name={`colors[${index}].colourDescriptionTurkish`}
                                            value={
                                              props.values.colors[index]
                                                .colourDescriptionTurkish
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
                                            id={`colors[${index}].colourTypeUkrainian`}
                                            name={`colors[${index}].colourTypeUkrainian`}
                                            value={
                                              props.values.colors[index]
                                                .colourTypeUkrainian
                                            }
                                            className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                            type='text'
                                            placeholder='Colour Tipi Ukraynaca'
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
                                            id={`colors[${index}].colourDescriptionUkrainian`}
                                            name={`colors[${index}].colourDescriptionUkrainian`}
                                            value={
                                              props.values.colors[index]
                                                .colourDescriptionUkrainian
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
                                            id={`colors[${index}].colourTypeEnglish`}
                                            name={`colors[${index}].colourTypeEnglish`}
                                            value={
                                              props.values.colors[index]
                                                .colourTypeEnglish
                                            }
                                            className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                            type='text'
                                            placeholder='Colour Tipi İngilizce'
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
                                            id={`colors[${index}].colourDescriptionEnglish`}
                                            name={`colors[${index}].colourDescriptionEnglish`}
                                            value={
                                              props.values.colors[index]
                                                .colourDescriptionEnglish
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
                          {/* colourDescription - colour Description inputları yukarıdadır. */}
                        </div>
                      ))}
                    </div>

                    <div className='w-full flex justify-center items-center gap-6 my-6 '>
                      <button
                        type='button'
                        onClick={() =>
                          push({
                            colourType: '',
                            colourDescription: '',

                            translateEnabled: false,
                            colourPickerEnabled: false,
                            colourHex: '',
                            image: '',

                            colourTypeTurkish: '',
                            colourTypeUkrainian: '',
                            colourTypeEnglish: '',

                            colourDescriptionTurkish: '',
                            colourDescriptionUkrainian: '',
                            colourDescriptionEnglish: '',
                          })
                        }
                        className='px-3 py-2 rounded-md bg-blue-500 text-white hover:rotate-2 hover:scale-105 transition-all shadow-lg'
                      >
                        Yeni Renk Ekle
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
                          Dil Çevrisi - Colour Bilgileri
                        </h3>
                      </div>
                    </div>

                    <div className='w-full flex flex-row gap-2 justify-center item-center flex-wrap bg-blue-200 lg:bg-opacity-0 p-2 rounded'>
                      <div className='bg-blue-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                        <h3 className='text-center font-bold'>
                          Colour Tipi Türkçe :
                        </h3>
                        <h4 className='text-center'>
                          {selectedLanguageData.colourTypeTurkish}
                        </h4>
                      </div>
                      <div className='bg-blue-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                        <h3 className='text-center font-bold'>
                          Açıklama Türkçe :
                        </h3>
                        <h4 className='text-center'>
                          {selectedLanguageData.colourDescriptionTurkish}
                        </h4>
                      </div>
                    </div>

                    <div className='w-full flex flex-row gap-2 justify-center item-center flex-wrap bg-orange-200 lg:bg-opacity-0 p-2 rounded'>
                      <div className='bg-orange-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                        <h3 className='text-center font-bold'>
                          Colour Tipi İngilizce :
                        </h3>
                        <h4 className='text-center'>
                          {selectedLanguageData.colourTypeEnglish}
                        </h4>
                      </div>
                      <div className='bg-orange-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                        <h3 className='text-center font-bold'>
                          Açıklama İngilizce :
                        </h3>
                        <h4 className='text-center'>
                          {selectedLanguageData.colourDescriptionEnglish}
                        </h4>
                      </div>
                    </div>

                    <div className='w-full flex flex-row gap-2 justify-center item-center flex-wrap bg-green-200 lg:bg-opacity-0 p-2 rounded'>
                      <div className='bg-green-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                        <h3 className='text-center font-bold'>
                          Colour Tipi Ukraynaca :
                        </h3>
                        <h4 className='text-center'>
                          {selectedLanguageData.colourTypeUkrainian}
                        </h4>
                      </div>
                      <div className='bg-green-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                        <h3 className='text-center font-bold'>
                          Açıklama Ukraynaca :
                        </h3>
                        <h4 className='text-center'>
                          {selectedLanguageData.colourDescriptionUkrainian}
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

export default ColorsComponent;
