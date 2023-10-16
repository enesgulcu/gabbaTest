'use client';
import React, { useState, useEffect } from 'react';
import { MdOutlineCancel } from 'react-icons/md';
import { AiFillEye } from 'react-icons/ai';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import FinancialManagementValidationSchema from './formikData';
import { postAPI, getAPI } from '@/services/fetchAPI';

const CreateFinancialManagementComponent = ({ orderLength }) => {
  const [orderLengthState, setOrderLengthState] = useState(orderLength);
  const [financialManagementSpecial, setFinancialManagementSpecial] =
    useState(false);
  console.log(orderLength);
  return (
    <>
      <Formik
        validationSchema={FinancialManagementValidationSchema}
        initialValues={{
          // İşlem Türünü Giriniz... (KDV ORANI, VERGİ, KARGO...)
          operationName: '',
          // Liste Fiyatı, Liste Fiyatı x Adet Miktarı
          priceType: '',
          // Fiyata Koşul Eklensin mi?
          condition: false,
          // <, <=, >, >=, ==, !=, <>
          conditionType: '',
          // Fiyata Koşul Eklendikten Sonraki Değerler
          conditionValue: '',
          conditionValue2: '',
          mathOperator: '',
          finalPrice: '',
          orderCondition: false,
          orderValue: parseInt(orderLength),
          financialManagementSpecial: [
            {
              mathOperatorSpecial: '',
              conditionValueSpecial: orderLength.toString(),
              ozelBaremValue: 0,
            },
          ],
        }}
        onSubmit={async (value) => {
          //console.log(value);
          const response = await postAPI('/createProduct/financialManagement', {
            data: value,
          });
          console.log(response);
        }}
      >
        {(props) => (
          <Form onSubmit={props.handleSubmit}>
            <>
              <div className='border-2 border-purple-500 mb-2 rounded lg:px-10 px-2 hover:bg-yellow-400 py-4 transition-all w-full flex-col xl:flex-row flex flex-wrap   item-center xl:items-start gap-4 bg-gray-100'>
                <div className='flex justify-center items-center gap-4'>
                  <label className='whitespace-nowrap font-semibold flex justify-center items-center'>
                    <div className='flex justify-start items-center flex-row gap-2'>
                      <span className='flex justify-center items-center w-[25px] h-[25px] rounded-full bg-black text-white'>
                        1
                      </span>{' '}
                      - Hesaplama İşlemi
                    </div>
                  </label>
                  <div className='flex flex-col'>
                    <input
                      onChange={props.handleChange}
                      id='operationName'
                      name='operationName'
                      value={props.values.operationName}
                      className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[250px]`}
                      type='text'
                      placeholder='İşlem Türünü Giriniz...'
                    />
                    <ErrorMessage
                      name='operationName'
                      component='div'
                      className='field-error text-red-600 m-1'
                    />
                  </div>
                  {props.values.operationName.length > 0 && (
                    <div>
                      <p>Hangi Duruma Göre Fiyat Hesaplansın?</p>
                      <div className='w-fit'>
                        <select
                          id='priceType'
                          name='priceType'
                          onChange={props.handleChange}
                          className='border text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400'
                        >
                          <option value=''>Seçiniz...</option>
                          <option value='Liste Fiyatı'>Liste Fiyatı</option>
                          <option value='Liste Fiyatı x Adet Miktarı'>
                            Liste Fiyatı x Adet Miktarı
                          </option>
                        </select>
                        <ErrorMessage
                          name='priceType'
                          component='div'
                          className='field-error text-red-600 m-1'
                        />
                      </div>
                    </div>
                  )}
                  {props.values.priceType.length > 0 && (
                    <div>
                      <label htmlFor='condition'>
                        Fiyata Koşul Eklensin mi?{' '}
                      </label>
                      <input
                        name='condition'
                        id='condition'
                        onChange={props.handleChange}
                        checked={props.values.condition}
                        type='checkbox'
                      />
                      <ErrorMessage
                        name='condition'
                        component='div'
                        className='field-error text-red-600 m-1'
                      />
                      {props.values.condition && (
                        <div className='w-fit'>
                          <select
                            onChange={props.handleChange}
                            id='conditionType'
                            name='conditionType'
                            className='border text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400'
                          >
                            <option value=''>Bir Koşul Seçiniz...</option>
                            <option value='<'>{`${props.values.priceType} < x`}</option>
                            <option value='<='>{`${props.values.priceType} <= x`}</option>
                            <option value='>'>{`${props.values.priceType} > x`}</option>
                            <option value='>='>{`${props.values.priceType} >= x`}</option>
                            <option value='=='>{`${props.values.priceType} == x`}</option>
                            <option value='!='>{`${props.values.priceType} != x`}</option>
                            <option value='<>'>{`x < ${props.values.priceType} > y`}</option>
                          </select>
                          <ErrorMessage
                            name='conditionType'
                            component='div'
                            className='field-error text-red-600 m-1'
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {props.values.condition &&
                  props.values.conditionType.length > 0 && (
                    <div className='bg-gray-100 border p-2 rounded-3xl w-fit'>
                      {props.values.conditionType === '<' ? (
                        <div>
                          {`${props.values.priceType} < `}
                          <input
                            name='conditionValue'
                            id='conditionValue'
                            onChange={props.handleChange}
                            type='number'
                            min='0'
                            className='hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[170px]'
                          />
                        </div>
                      ) : props.values.conditionType === '<=' ? (
                        <div>
                          {`${props.values.priceType} <= `}
                          <input
                            name='conditionValue'
                            id='conditionValue'
                            onChange={props.handleChange}
                            type='number'
                            min='0'
                            className='hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[170px]'
                          />
                          <ErrorMessage
                            name='conditionValue'
                            component='div'
                            className='field-error text-red-600 m-1'
                          />
                        </div>
                      ) : props.values.conditionType === '>' ? (
                        <div>
                          {`${props.values.priceType} > `}
                          <input
                            name='conditionValue'
                            id='conditionValue'
                            onChange={props.handleChange}
                            type='number'
                            min='0'
                            className='border-2 border-gray-300 p-1 mb-3'
                          />
                          <ErrorMessage
                            name='conditionValue'
                            component='div'
                            className='field-error text-red-600 m-1'
                          />
                        </div>
                      ) : props.values.conditionType === '>=' ? (
                        <div>
                          {`${props.values.priceType} >= `}
                          <input
                            name='conditionValue'
                            id='conditionValue'
                            onChange={props.handleChange}
                            type='number'
                            min='0'
                            className='border-2 border-gray-300 p-1 mb-3'
                          />
                          <ErrorMessage
                            name='conditionValue'
                            component='div'
                            className='field-error text-red-600 m-1'
                          />
                        </div>
                      ) : props.values.conditionType === '==' ? (
                        <div>
                          {`${props.values.priceType} == `}
                          <input
                            name='conditionValue'
                            id='conditionValue'
                            onChange={props.handleChange}
                            type='number'
                            min='0'
                            className='border-2 border-gray-300 p-1 mb-3'
                          />
                          <ErrorMessage
                            name='conditionValue'
                            component='div'
                            className='field-error text-red-600 m-1'
                          />
                        </div>
                      ) : props.values.conditionType === '!=' ? (
                        <div>
                          {`${props.values.priceType} != `}
                          <input
                            id='conditionValue'
                            name='conditionValue'
                            onChange={props.handleChange}
                            type='number'
                            min='0'
                            className='border-2 border-gray-300 p-1 mb-3'
                          />
                          <ErrorMessage
                            name='conditionValue'
                            component='div'
                            className='field-error text-red-600 m-1'
                          />
                        </div>
                      ) : props.values.conditionType === '<>' ? (
                        <div>
                          <input
                            id='conditionValue'
                            name='conditionValue'
                            onChange={props.handleChange}
                            type='number'
                            min='0'
                            className='border-2 border-gray-300 p-1 mb-3'
                          />
                          <ErrorMessage
                            name='conditionValue'
                            component='div'
                            className='field-error text-red-600 m-1'
                          />
                          {`< ${props.values.priceType} > `}
                          <input
                            name='conditionValue2'
                            id='conditionValue2'
                            onChange={props.handleChange}
                            type='number'
                            min='0'
                            className='border-2 border-gray-300 p-1 mb-3'
                          />
                          <ErrorMessage
                            name='conditionValue2'
                            component='div'
                            className='field-error text-red-600 m-1'
                          />
                        </div>
                      ) : null}
                    </div>
                  )}
                {props.values.priceType && (
                  <div>
                    <label htmlFor='mathOperator'>Fiyatı hesapla</label>
                    <select
                      onChange={props.handleChange}
                      id='mathOperator'
                      name='mathOperator'
                      className='border text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400'
                    >
                      <option value=''>Matematik Operatörü Seçiniz...</option>
                      <option value='+'>Toplama (+)</option>
                      <option value='-'>Çıkarma (-)</option>
                      <option value='x'>Çarpma (x)</option>
                      <option value='÷'>Bölme (÷)</option>
                      <option value='%'>Yüzde (%)</option>
                      <option value='+%'>Yüzde (+%)</option>
                      <option value='-%'>Yüzde (-%)</option>
                    </select>
                    <ErrorMessage
                      name='mathOperator'
                      component='div'
                      className='field-error text-red-600 m-1'
                    />
                  </div>
                )}
                {props.values.mathOperator && (
                  <div>
                    {`${props.values.priceType}'na ${
                      props.values.mathOperator
                    }${
                      props.values.finalPrice &&
                      props.values.finalPrice != undefined
                        ? props.values.finalPrice
                        : '0'
                    } işlemini uygula`}
                    <br />
                    <input
                      name='finalPrice'
                      id='finalPrice'
                      onChange={props.handleChange}
                      min='0'
                      className='hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[170px]'
                      type='number'
                    />
                    <ErrorMessage
                      name='finalPrice'
                      component='div'
                      className='field-error text-red-600 m-1'
                    />
                  </div>
                )}
                {props.values.finalPrice && orderLength > 0 && (
                  <div>
                    <label htmlFor='orderCondition'>
                      İşlem Sırası Belirlensin mi? {'  '}
                    </label>
                    <input
                      name='orderCondition'
                      id='orderCondition'
                      onChange={props.handleChange}
                      checked={props.values.orderCondition}
                      type='checkbox'
                    />
                    <ErrorMessage
                      name='orderCondition'
                      component='div'
                      className='field-error text-red-600 m-1'
                    />
                    {props.values.orderCondition && (
                      <div>
                        <select
                          className='border text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400'
                          onChange={props.handleChange}
                          id='orderValue'
                          name='orderValue'
                        >
                          {Array.from(
                            { length: orderLengthState },
                            (_, length) => (
                              <option key={length} value={length + 1}>
                                {length + 1}. İşlem Sırası
                              </option>
                            )
                          )}
                        </select>
                        <ErrorMessage
                          name='orderValue'
                          component='div'
                          className='field-error text-red-600 m-1'
                        />
                      </div>
                    )}
                  </div>
                )}
                {orderLength > 0 && props.values.finalPrice && (
                  <div>
                    <label htmlFor='financialManagementSpecial'>
                      Özel İşlem Eklesin mi? {'  '}
                    </label>
                    <input
                      name='financialManagementSpecial'
                      id='financialManagementSpecial'
                      onChange={() =>
                        setFinancialManagementSpecial(
                          !financialManagementSpecial
                        )
                      }
                      checked={financialManagementSpecial}
                      type='checkbox'
                    />
                    <ErrorMessage
                      name='orderCondition'
                      component='div'
                      className='field-error text-red-600 m-1'
                    />
                  </div>
                )}
              </div>
              {financialManagementSpecial && (
                <div className='grid grid-cols-3 gap-2'>
                  <FieldArray name='financialManagementSpecial'>
                    {({ push, remove }) => (
                      <>
                        {props.values.financialManagementSpecial.map(
                          (option, index) => (
                            <div
                              key={index}
                              className='bg-gray-200 p-2 flex flex-col gap-2 rounded'
                            >
                              <h3 className='font-bold text-center text-2xl'>
                                Özel İşlem - {index + 1}
                              </h3>
                              <Field
                                as='select'
                                id='mathOperator'
                                name={`financialManagementSpecial[${index}].mathOperatorSpecial`}
                                className='border text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400'
                              >
                                <option value=''>
                                  Matematik Operatörü Seçiniz...
                                </option>
                                <option value='+'>Toplama (+)</option>
                                <option value='-'>Çıkarma (-)</option>
                                <option value='x'>Çarpma (x)</option>
                                <option value='÷'>Bölme (÷)</option>
                                <option value='%'>Yüzde (%)</option>
                              </Field>
                              {props.values.financialManagementSpecial[index]
                                .mathOperatorSpecial && (
                                <Field
                                  className='border text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400'
                                  name={`financialManagementSpecial[${index}].conditionValueSpecial`}
                                  as='select'
                                >
                                  <option>
                                    İşlem Sonucu veya Özel Barem Seçiniz...
                                  </option>
                                  <option
                                    value={`${
                                      props.values.orderValue
                                        ? props.values.orderValue - 1
                                        : orderLength - 1
                                    }`}
                                  >
                                    {props.values.orderValue
                                      ? props.values.orderValue - 1
                                      : orderLength - 1}
                                    . İşlemin Sonucu
                                  </option>
                                  <option value='Özel Barem Ekle'>
                                    Özel Barem Ekle
                                  </option>
                                </Field>
                              )}
                              {props.values.financialManagementSpecial[index]
                                .conditionValueSpecial == 'Özel Barem Ekle' && (
                                <Field
                                  onChange={props.handleChange}
                                  id={`financialManagementSpecial[${index}].ozelBaremValue`}
                                  name={`financialManagementSpecial[${index}].ozelBaremValue`}
                                  value={
                                    props.values.financialManagementSpecial[
                                      index
                                    ].ozelBaremValue
                                  }
                                  className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                                  type='number'
                                  placeholder='Özel Barem Değerini Giriniz...'
                                ></Field>
                              )}
                              <p>
                                {`${props.values.operationName} ${
                                  props.values.financialManagementSpecial[index]
                                    .mathOperatorSpecial
                                    ? props.values.financialManagementSpecial[
                                        index
                                      ].mathOperatorSpecial
                                    : ' '
                                }`}
                                {props.values.financialManagementSpecial[index]
                                  .conditionValueSpecial == 'Özel Barem Ekle'
                                  ? `${props.values.financialManagementSpecial[index].ozelBaremValue}`
                                  : ` ${
                                      props.values.orderValue
                                        ? props.values.orderValue - 1
                                        : orderLength - 1
                                    }. İşlemin Sonucu`}
                              </p>
                              <button
                                className='bg-red-600 hover:bg-red-500 text-white rounded p-3'
                                type='button'
                                onClick={() => remove(index)}
                              >
                                İşlemi Kaldır (X)
                              </button>
                            </div>
                          )
                        )}
                        <button
                          className='bg-gray-300 text-[70px]'
                          type='button'
                          onClick={() =>
                            push({
                              mathOperatorSpecial: '',
                              conditionValueSpecial: orderLength.toString(),
                              ozelBaremValue: 0,
                            })
                          }
                        >
                          +
                        </button>
                      </>
                    )}
                  </FieldArray>
                </div>
              )}

              <div className='w-full flex justify-center items-center gap-6 my-6 '>
                <button
                  type='submit'
                  className='px-4 py-2 rounded-md bg-green-500 text-white hover:rotate-2 hover:scale-105 transition-all shadow-lg'
                >
                  Gönder
                </button>
              </div>
            </>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default CreateFinancialManagementComponent;
