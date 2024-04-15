'use client';
import React from 'react';
import { postAPI, getAPI } from '@/services/fetchAPI';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import Image from 'next/image';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';
import { IoClose, IoCheckmarkDoneSharp } from 'react-icons/io5';
import EditComponentValidationSchema from './formikData';

const EditComponent = ({
  updateData,
  setUpdateData,
  isloading,
  setIsloading,
}) => {
  const initialValues = {
    measurements: [
      updateData || {
        firstValue: '',
        secondValue: '',
        unit: 'cm',
        oneRangeEnabled: false,
        twoRangeEnabled: true,
        manuelDefined: false,
        turkish: '',
        ukrainian: '',
        english: '',
      },
    ],
  };

  const index = 0;

  return (
    <div>
      <div
        className={`w-full ${
          isloading ? ' blur max-h-screen overflow-hidden' : ' blur-none'
        }`}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={EditComponentValidationSchema}
          onSubmit={async (value) => {
            setIsloading(true);
            const responseData = await postAPI('/createProduct/measurements', {
              data: value,
              processType: 'update',
            });

            if (responseData.status !== 'success') {
              throw new Error('Veri güncellenemedi');
            } else {
              // veriyi çek ve state'e at
              setIsloading(false);
              toast.success('Veri başarıyla güncellendi');

              // form verilerini sıfırla.
              value.measurements = [
                {
                  firstValue: '',
                  secondValue: '',
                  unit: 'cm',
                  oneRangeEnabled: false,
                  twoRangeEnabled: true,
                  manuelDefined: false,
                  translateEnabled: false,
                  turkish: '',
                  ukrainian: '',
                  english: '',
                },
              ];

              // arayüzdeki input içindeki değerleri sil ve sıfırla.
              document.getElementById(`measurements[${0}].firstValue`).value =
                '';
              document.getElementById(`measurements[${0}].secondValue`).value =
                '';
              setUpdateData('');
            }
          }}
        >
          {(props) => (
            <Form onSubmit={props.handleSubmit}>
              <FieldArray name='measurements'>
                {({ insert, push, remove }) => (
                  <div>
                    <div>
                      <div
                        className={` lg:px-10 px-2 hover:bg-yellow-400 py-4 transition-all w-full flex-col xl:flex-row flex flex-wrap xl:justify-between justify-center item-center xl:items-start gap-4 ${
                          index % 2 ? 'bg-white' : 'bg-gray-100'
                        }`}
                      >
                        {/* Ölçü kaldırma butonu aşağıdadır. */}
                        <div className='flex justify-center items-center gap-4 h-10'>
                          <label
                            htmlFor={`measure-${index}`}
                            className='whitespace-nowrap font-semibold flex justify-center items-center'
                          >
                            {/* İnputun giriş türüne göre 3 farklı başlık gösterimi uygularız. */}
                            {props.values.measurements[index]
                              .oneRangeEnabled ? (
                              <div className='flex justify-start items-center flex-row gap-2'>
                                <span className='flex justify-center items-center w-[25px] h-[25px] rounded-full bg-black text-white'>{`${
                                  index + 1
                                }`}</span>{' '}
                                - Tek Ölçü Ekle
                              </div>
                            ) : props.values.measurements[index]
                                .twoRangeEnabled ? (
                              <div className='flex justify-start items-center flex-row gap-2'>
                                <span className='flex justify-center items-center w-[25px] h-[25px] rounded-full bg-black text-white'>{`${
                                  index + 1
                                }`}</span>{' '}
                                - Ölçü Aralığı Ekle
                              </div>
                            ) : (
                              <div className='flex justify-start items-center flex-row gap-2'>
                                <span className='flex justify-center items-center w-[25px] h-[25px] rounded-full bg-black text-white'>
                                  {`${index + 1}`}
                                </span>{' '}
                                - Özel Ölçü Ekle
                              </div>
                            )}
                          </label>
                        </div>
                        {/* Ölçü kaldırma butonu yukarıdadır. */}

                        {/* firstValue - secondValue inputları aşağıdadır. */}
                        <div className=' flex flex-row flex-wrap lg:flex-nowrap gap-4 justify-center items-start'>
                          {/* firstValue input aşağıdadır. */}
                          <div className='flex flex-col justify-center items-center '>
                            <Field
                              onChange={props.handleChange}
                              id={`measurements[${index}].firstValue`}
                              name={`measurements[${index}].firstValue`}
                              value={
                                props.values.measurements[index].firstValue
                              }
                              className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 ${
                                props.values.measurements[index].manuelDefined
                                  ? 'w-[250px]'
                                  : 'w-[170px]'
                              }`}
                              type={`${
                                props.values.measurements[index].manuelDefined
                                  ? 'text'
                                  : 'number'
                              }`}
                              placeholder={`${
                                props.values.measurements[index].manuelDefined
                                  ? 'örnek: Soldan Kapak Çıkar'
                                  : 'örnek: 124'
                              } `}
                            />

                            <ErrorMessage
                              name={`measurements[${index}].firstValue`}
                              component='div'
                              className='field-error text-red-600 m-1'
                            />
                          </div>

                          {/* secondValue input aşağıdadır. */}
                          <div
                            className={`flex flex-col justify-center items-center ${
                              props.values.measurements[index].twoRangeEnabled
                                ? 'block'
                                : 'hidden'
                            }`}
                          >
                            <Field
                              type='number'
                              placeholder='örnek: 238'
                              onChange={props.handleChange}
                              id={`measurements[${index}].secondValue`}
                              name={`measurements[${index}].secondValue`}
                              value={
                                props.values.measurements[index].secondValue
                              }
                              className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[170px]`}
                            />
                          </div>
                        </div>
                        {/* firstValue - secondValue inputları yukarıdadır. */}

                        <div className='flex flex-row flex-wrap justify-center xl:justify-around gap-2 items-center cursor-pointer'>
                          {/*Alt alan Çeviri bölümüdür ############### */}
                          {props.values.measurements[index].manuelDefined && (
                            <div className='flex justify-center items-center gap-2 max-w-[%90]'>
                              <div className='flex justify-center items-center flex-row gap-2'>
                                {
                                  <div className='flex justify-center items-center flex-row gap-2 rounded-lg'>
                                    {props.values.measurements[index].turkish !=
                                      '' && (
                                      <Image
                                        className='cursor-default rounded-full'
                                        src='/tr_flag.svg'
                                        height={25}
                                        width={25}
                                        alt='TrFlag'
                                      />
                                    )}
                                    {props.values.measurements[index]
                                      .ukrainian != '' && (
                                      <Image
                                        className='cursor-default rounded-full'
                                        src='/ua_flag.svg'
                                        height={25}
                                        width={25}
                                        alt='TrFlag'
                                      />
                                    )}
                                    {props.values.measurements[index].english !=
                                      '' && (
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
                                      `measurements[${index}].translateEnabled`,
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
                            </div>
                          )}
                          {/*Üst alan Çeviri bölümüdür ############### */}
                          {/* (mm-cm-m) seçme yapısı aşağıadadır. */}
                          <Field
                            as='select'
                            onChange={props.handleChange}
                            id={`measurements[${index}].unit`}
                            name={`measurements[${index}].unit`}
                            disabled={
                              props.values.measurements[index].manuelDefined
                            }
                            className={`${
                              props.values.measurements[index].manuelDefined
                                ? ' opacity-30'
                                : 'block'
                            } hover:scale-105 transition-all cursor-pointer  p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                          >
                            <option value='cm'>cm</option>
                            <option value='mm'>mm</option>
                            <option value='m'>m</option>
                          </Field>

                          <div
                            onClick={() => {
                              props.setFieldValue(
                                `measurements[${index}].oneRangeEnabled`,
                                true
                              );
                              props.setFieldValue(
                                `measurements[${index}].manuelDefined`,
                                false
                              );
                              props.setFieldValue(
                                `measurements[${index}].twoRangeEnabled`,
                                false
                              );

                              // initialValues içindeki eşleştiği index değerini sıfırla
                              props.setFieldValue(
                                `measurements[${index}].secondValue`,
                                ''
                              );
                              props.setFieldValue(
                                `measurements[${index}].unit`,
                                'cm'
                              );

                              // kullanıcı ara yüzündeki değeri sıfırla (input içi dolu duruyor diye )
                              document.getElementById(
                                `measurements[${index}].secondValue`
                              ).value = '';
                            }}
                            className={`
                              ${
                                props.values.measurements[index].oneRangeEnabled
                                  ? 'bg-blue-200 text-black'
                                  : 'bg-white cursor-pointer'
                              }
                              hover:scale-105 transition-all cursor-pointer flex justify-center items-center gap-2 border border-gray-300 p-2 rounded-lg`}
                          >
                            <label
                              className='inline-block whitespace-nowrap cursor-pointer'
                              htmlFor={`measure-${index}`}
                            >
                              {' '}
                              Tek Ölçü:
                            </label>

                            <Field
                              readOnly={true}
                              type='checkbox'
                              onChange={props.handleChange}
                              id={`measurements[${index}].oneRangeEnabled`}
                              name={`measurements[${index}].oneRangeEnabled`}
                              className='border border-gray-300 rounded-md p-2 w-6 h-6 cursor-pointer'
                            />
                          </div>

                          <div
                            onClick={() => {
                              props.setFieldValue(
                                `measurements[${index}].twoRangeEnabled`,
                                true
                              );
                              props.setFieldValue(
                                `measurements[${index}].manuelDefined`,
                                false
                              );
                              props.setFieldValue(
                                `measurements[${index}].oneRangeEnabled`,
                                false
                              );
                              props.setFieldValue(
                                `measurements[${index}].unit`,
                                'cm'
                              );
                            }}
                            className={`
                                ${
                                  props.values.measurements[index]
                                    .twoRangeEnabled
                                    ? 'bg-blue-200 text-black'
                                    : 'bg-white cursor-pointer'
                                }
                                hover:scale-105 transition-all cursor-pointer flex justify-center items-center gap-2 border border-gray-300 p-2 rounded-lg`}
                          >
                            <label
                              className='inline-block whitespace-nowrap cursor-pointer'
                              htmlFor={`measure-${index}`}
                            >
                              {' '}
                              Ölçü Aralığı:
                            </label>

                            <Field
                              readOnly={true}
                              type='checkbox'
                              onChange={props.handleChange}
                              id={`measurements[${index}].twoRangeEnabled`}
                              name={`measurements[${index}].twoRangeEnabled`}
                              className='border border-gray-300 rounded-md p-2 w-6 h-6 cursor-pointer'
                            />
                          </div>
                          <div
                            onClick={() => {
                              props.setFieldValue(
                                `measurements[${index}].manuelDefined`,
                                true
                              );
                              props.setFieldValue(
                                `measurements[${index}].twoRangeEnabled`,
                                false
                              );
                              props.setFieldValue(
                                `measurements[${index}].oneRangeEnabled`,
                                false
                              );

                              // initialValues içindeki eşleştiği index değerini sıfırla
                              props.setFieldValue(
                                `measurements[${index}].secondValue`,
                                ''
                              );
                              props.setFieldValue(
                                `measurements[${index}].unit`,
                                ''
                              );

                              // kullanıcı ara yüzündeki değeri sıfırla (input içi dolu duruyor yoksa)
                              document.getElementById(
                                `measurements[${index}].secondValue`
                              ).value = '';
                            }}
                            className={`${
                              props.values.measurements[index].manuelDefined
                                ? 'bg-blue-200 text-black'
                                : 'bg-white'
                            }
                                hover:scale-105 transition-all cursor-pointer flex justify-center items-center gap-2 border border-gray-300 p-2 rounded-lg`}
                          >
                            <label
                              className='inline-block whitespace-nowrap cursor-pointer'
                              htmlFor={`measure-${index}`}
                            >
                              Özel Ölçü
                            </label>

                            <Field
                              readOnly={true}
                              type='checkbox'
                              onChange={props.handleChange}
                              id={`measurements[${index}].manuelDefined`}
                              name={`measurements[${index}].manuelDefined`}
                              className='border border-gray-300 rounded-md p-2 w-6 h-6 cursor-pointer'
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-col justify-center items-center gap-4'>
                      {/* TRANSLATE BÖLÜMÜ aşağıdadır.*/}
                      <div className='w-full flex justify-center items-center gap-6 '>
                        {props.values.measurements[index].translateEnabled && (
                          <div className=''>
                            <div className='flex flex-col justify-center item-center my-4 gap-4'>
                              {props.values.measurements[index].turkish == '' &&
                              props.values.measurements[index].ukrainian ==
                                '' &&
                              props.values.measurements[index].english == '' ? (
                                <div className='w-full flex justify-center items-center '>
                                  <div
                                    onClick={() => {
                                      props.setFieldValue(
                                        `measurements[${index}].translateEnabled`,
                                        false
                                      );
                                    }}
                                    className='cursor-pointer hover:scale-105 hover:rotate-6 transition-all  bg-red-600 p-2 lg:-right-10 -top-20 scale-125 lg:-top-10 rounded-full w-10 h-10 flex justify-center items-center text-center'
                                  >
                                    <IoClose color='white' size={45} />
                                  </div>
                                </div>
                              ) : (
                                <div className='w-full flex justify-center items-center relative'>
                                  <div
                                    onClick={() => {
                                      props.setFieldValue(
                                        `measurements[${index}].translateEnabled`,
                                        false
                                      );
                                    }}
                                    className='cursor-pointer hover:scale-105 hover:rotate-6 transition-all  bg-green-600 p-2 lg:-right-10 -top-20 scale-125 lg:-top-10 rounded-full w-10 h-10 flex justify-center items-center text-center'
                                  >
                                    <IoCheckmarkDoneSharp
                                      color='white'
                                      size={40}
                                    />
                                  </div>
                                </div>
                              )}

                              <div className='p-4 bg-white rounded-lg '>
                                <div className='flex flex-col gap-4 justify-center items-center'>
                                  <h2 className='text-xl font-semibold p-2 bg-blue-600 text-white rounded-lg w-full text-center'>
                                    {`${index + 1}`} - Özel Ölçü Ekle
                                  </h2>
                                  <div className='flex flex-col justify-center items-center '>
                                    <h2 className=''>Girilen Orjinal Değer</h2>
                                    {props.values.measurements[index]
                                      .firstValue && (
                                      <div className='bg-black p-2 w-full rounded-lg text-white mb-2'>
                                        {
                                          props.values.measurements[index]
                                            .firstValue
                                        }
                                      </div>
                                    )}
                                    <div className='w-full flex justify-center item-center flex-row flex-nowrap gap-4'>
                                      <Image
                                        className='hover:scale-105 transition-all'
                                        src='/tr_flag.svg'
                                        height={40}
                                        width={40}
                                        alt='TrFlag'
                                      />

                                      <Field
                                        onChange={props.handleChange}
                                        id={`measurements[${index}].turkish`}
                                        name={`measurements[${index}].turkish`}
                                        value={
                                          props.values.measurements[index]
                                            .turkish
                                        }
                                        className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                        type='text'
                                        placeholder='Türkçe Dil Çevirisi'
                                      />
                                    </div>
                                  </div>
                                  <div className='flex flex-col justify-center items-center '>
                                    <div className='w-full flex justify-center item-center flex-row flex-nowrap gap-4'>
                                      <Image
                                        className='hover:scale-105 transition-all'
                                        src='/ua_flag.svg'
                                        height={40}
                                        width={40}
                                        alt='TrFlag'
                                      />
                                      <Field
                                        onChange={props.handleChange}
                                        id={`measurements[${index}].ukrainianv`}
                                        name={`measurements[${index}].ukrainian`}
                                        value={
                                          props.values.measurements[index]
                                            .ukrainian
                                        }
                                        className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                        type='text'
                                        placeholder='Ukraynaca Dil Çevirisi'
                                      />
                                    </div>
                                  </div>
                                  <div className='flex flex-col justify-center items-center '>
                                    <div className='w-full flex justify-center item-center flex-row flex-nowrap gap-4'>
                                      <Image
                                        className='hover:scale-105 transition-all'
                                        src='/en_flag.svg'
                                        height={40}
                                        width={40}
                                        alt='TrFlag'
                                      />
                                      <Field
                                        onChange={props.handleChange}
                                        id={`measurements[${index}].english`}
                                        name={`measurements[${index}].english`}
                                        value={
                                          props.values.measurements[index]
                                            .english
                                        }
                                        className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                        type='text'
                                        placeholder='İngilizce Dil Çevirisi'
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* TRANSLATE BÖLÜMÜ yukarıdadır.*/}
                      <p className='text-white w-full text-center'>
                        Güncelle butonuna basılana kadar hiçbir veri
                        güncellenmez.
                      </p>
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
