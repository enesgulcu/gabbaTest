'use client';

import React from 'react';
import { postAPI } from '@/services/fetchAPI';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import Image from 'next/image';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoClose, IoCheckmarkDoneSharp } from 'react-icons/io5';
import ResizeImage from '@/functions/others/resizeImage';

import MetalsValidationSchema from './formikData';

const EditComponent = ({
  updateData,
  setUpdateData,
  NewData,
  isloading,
  setIsloading,
}) => {
  const initialValues = {
    metals: [
      updateData || {
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

  const index = 0;

  return (
    <div className='w-full'>
      <div
        className={`w-full ${
          isloading ? ' blur max-h-screen overflow-hidden' : ' blur-none'
        }`}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={MetalsValidationSchema}
          onSubmit={async (value) => {
            setIsloading(true);
            const responseData = await postAPI('/createProduct/metals', {
              data: value,
              processType: 'update',
            });
            if (
              responseData.status !== 'success' ||
              responseData.status == 'error'
            ) {
              setIsloading(false);
              toast.error(responseData.error);
            } else {
              setIsloading(false);
              toast.success('Tüm Veriler Başarıyla Güncellendi!');
              setUpdateData('');

              // form verilerini sıfırla.
              value.metals = [
                {
                  metalType: '',
                  metalDescription: '',

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
                      {props.values.metals.map((metal, index) => (
                        <div
                          key={index}
                          className={` lg:px-4 hover:bg-yellow-400 py-4 transition-all w-full flex-col xl:flex-row flex flex-wrap xl:justify-center justify-center item-center xl:items-center gap-4 ${
                            index % 2 ? 'bg-white' : 'bg-gray-100'
                          }`}
                        >
                          {/* metalType - metalDescription inputları aşağıdadır. */}
                          <div className=' flex flex-col gap-4 justify-center item-center'>
                            <div className='flex flex-col lg:flex-row flex-wrap gap-4 justify-center item-center '>
                              {/* metalDescription input aşağıdadır.*/}
                              <div className='flex flex-col justify-center items-center '>
                                <h3>Metal tipini giriniz.</h3>
                                <Field
                                  onChange={props.handleChange}
                                  id={`metals[${index}].metalType`}
                                  name={`metals[${index}].metalType`}
                                  value={props.values.metals[index].metalType}
                                  className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-full lg:w-[200px]`}
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
                                <h3>Metal açıklamasını giriniz.</h3>
                                <Field
                                  onChange={props.handleChange}
                                  id={`metals[${index}].metalDescription`}
                                  name={`metals[${index}].metalDescription`}
                                  value={
                                    props.values.metals[index].metalDescription
                                  }
                                  className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-full lg:w-[200px]`}
                                  type='text'
                                  placeholder='Metal açıklamasını giriniz.'
                                />

                                <ErrorMessage
                                  name={`metals[${index}].metalDescription`}
                                  component='div'
                                  className='field-error text-red-600 m-1'
                                />
                              </div>
                              <div className='flex flex-row flex-nowrap justify-center items-end gap-2'>
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
                                  <div className=' hover:scale-125 transition-all hover:rotate-6 mb-2'>
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
                                  className='hover:scale-105 transition-all cursor-pointer flex self-end'
                                  src='/translate.svg'
                                  height={30}
                                  width={40}
                                  alt='TrFlag'
                                />
                              </div>
                            </div>

                            {/* translateEnabled true ise çeviri alanı açılır. */}
                            <div>
                              {props.values.metals[index].translateEnabled && (
                                <div className='p-2 bg-white rounded-lg relative pt-10 lg:pt-2 flex justify-center items-center flex-col'>
                                  {props.values.metals[index]
                                    .metalTypeTurkish == '' &&
                                  props.values.metals[index]
                                    .metalTypeUkrainian == '' &&
                                  props.values.metals[index].metalTypeEnglish ==
                                    '' &&
                                  props.values.metals[index]
                                    .metalDescriptionTurkish == '' &&
                                  props.values.metals[index]
                                    .metalDescriptionUkrainian == '' &&
                                  props.values.metals[index]
                                    .metalDescriptionEnglish == '' ? (
                                    <div
                                      onClick={() => {
                                        props.setFieldValue(
                                          `metals[${index}].translateEnabled`,
                                          false
                                        );
                                      }}
                                      className='cursor-pointer hover:scale-105 hover:rotate-6 transition-all my-4 bg-red-600 p-2 lg:-right-10 -top-20 scale-125 lg:-top-10 rounded-full w-10 h-10 flex justify-center items-center text-center'
                                    >
                                      <IoClose color='white' size={40} />
                                    </div>
                                  ) : (
                                    <div className='w-full flex justify-center items-center'>
                                      <div
                                        onClick={() => {
                                          props.setFieldValue(
                                            `metals[${index}].translateEnabled`,
                                            false
                                          );
                                        }}
                                        className='cursor-pointer hover:scale-105 hover:rotate-6 transition-all my-4 bg-green-600 p-2 lg:-right-10 -top-20 scale-125 lg:-top-10 rounded-full w-10 h-10 flex justify-center items-center text-center'
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
                                    {props.values.metals[index].metalType && (
                                      <div className='bg-black p-1 w-full rounded-lg text-white mb-2'>
                                        <h3 className='font-bold text-black bg-gray-200 inline-block p-2 rounded mr-2 min-w-[115px] text-end'>
                                          Metal Tipi :
                                        </h3>
                                        {props.values.metals[index].metalType}
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
                              )}
                            </div>
                          </div>

                          {/* metalDescription - metal Description inputları yukarıdadır. */}
                        </div>
                      ))}
                    </div>

                    <div className='w-full flex flex-col justify-center items-center gap-6 my-6 '>
                      <h3 className='text-center text-white'>
                        Günncelle butouna basılana kadar hiçbir veri
                        güncellenemez.
                      </h3>
                      <button
                        type='submit'
                        className='px-4 py-2 rounded-md bg-purple-500 text-white hover:rotate-2 hover:scale-105 transition-all shadow-lg'
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
};

export default EditComponent;
