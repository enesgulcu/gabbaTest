'use client';
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, FieldArray, ErrorMessage } from 'formik';
import { postAPI } from '@/services/fetchAPI';
import FinancialManagementValidationSchema from './formikData';
import 'react-toastify/dist/ReactToastify.css';

const CreateFinancialManagementComponent = ({
  orderLength,
  setOrderLength,
  setIsloading,
  getData,
  toast,
  setCreateFinancialManagement,
}) => {
  const [financialManagementSpecial, setFinancialManagementSpecial] =
    useState(false);
  return (
    <>
      <Formik
        validationSchema={FinancialManagementValidationSchema}
        initialValues={{
          // İşlem Türünü Giriniz... (KDV ORANI, VERGİ, KARGO...)
          operationName: '',
          // Liste Fiyatı, Liste Fiyatı x Adet Miktarı
          priceType: 'Liste Fiyatı',
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
          orderValue: orderLength == 0 ? 1 : parseInt(orderLength),
          financialManagementSpecial: [
            {
              mathOperatorSpecial: '',
              conditionValueSpecial: orderLength.toString(),
              ozelBaremValue: 0,
            },
          ],
        }}
        onSubmit={async (values, { resetForm }) => {
          // Liste Fiyatı x Adet Miktarı seçildiğinde koşul kontrolü sağlandı
          if (values.priceType == 'Liste Fiyatı x Adet Miktarı') {
            // Eğer kullanıcı Liste Fiyatı x Adet Miktarı seçiyorsa, koşul var demektir.
            values.condition = true;

            // Eğer kullanıcı koşul seçerse, koşul tipi ve koşul değeri girilmesi zorunlu hale geliyor.
            if (values.conditionType == '') {
              return toast.error(
                'Liste x Adet Miktarını seçtiniz. Koşul seçiniz.'
              );
            }
            if (values.conditionType != '<>' && values.conditionValue == '') {
              return toast.error(
                'Liste x Adet Miktarını seçtiniz. Koşul değeri giriniz.'
              );
            }
            if (values.conditionType == '<>') {
              if (values.conditionValue == '' || values.conditionValue2 == '') {
                return toast.error(
                  'Liste x Adet Miktarını seçtiniz. Koşul değerlerini giriniz.'
                );
              }
              if (values.conditionValue > values.conditionValue2) {
                return toast.error('İlk değer ikinci değerden büyük olamaz!');
              }
            }
          } else {
            // Eğer Liste Fiyatı seçildiyse, koşul durumu false durumuna getiriliyor.
            values.condition = false;
          }

          let isError = { status: false, message: '' };
          // Özel işlem için kontrol yeri
          financialManagementSpecial &&
            values.financialManagementSpecial.forEach((item, index) => {
              if (
                item.mathOperatorSpecial == '' ||
                item.conditionValueSpecial == orderLength ||
                (item.conditionValueSpecial == 'Özel Barem Ekle' &&
                  item.ozelBaremValue == 0)
              ) {
                return (isError = {
                  status: true,
                  message: 'Özel İşlemdeki tüm alanları doldurunuz!',
                });
              }
            });

          // Eğer kullanıcı koşul eklemek istiyorsa, obje içerisinde true/false güncellemesi yapıyoruz.
          if (values.priceType == 'Liste Fiyatı x Adet Miktarı') {
            values.condition = true;
          } else {
            values.condition = false;
          }

          if (isError.status) {
            return toast.error(isError.message);
          }

          setIsloading(true);
          const response = await postAPI('/createProduct/financialManagement', {
            data: values,
          });

          if (response.status !== 'success' || response.status == 'error') {
            setIsloading(false);
            toast.error(response.error);
          } else {
            // veriyi çek ve state'e at
            getData();
            setIsloading(false);
            resetForm({ values: '' });
            setOrderLength(orderLength + 1);
            setCreateFinancialManagement(false);
            toast.success('Tüm Veriler Başarıyla Eklendi!');
          }
        }}
      >
        {(props) => (
          <Form onSubmit={props.handleSubmit}>
            <>
              <div className='grid grid-cols-3 gap-2'>
                {/* 1. Adım (Finansal İşlem ismi input) */}
                <div className='bg-gray-100 p-3 rounded border-2'>
                  <div className='flex-row text-center items-center justify-center gap-2 whitespace-nowrap font-semibold w-full'>
                    <div className='flex flex-col justify-center items-center'>
                      <h1 className='text-center text-lg mb-4'>İşlem Adı</h1>
                      <input
                        onChange={props.handleChange}
                        id='operationName'
                        name='operationName'
                        value={props.values.operationName}
                        className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[400px] m-2]`}
                        type='text'
                        placeholder='İşlem Türünü Giriniz...'
                      />
                    </div>
                    <ErrorMessage
                      name='operationName'
                      component='div'
                      className='field-error text-red-600 m-1'
                    />
                  </div>
                </div>
                {/* 2. Adım (Matematik Operatörü) */}
                {props.values.operationName && (
                  <div className='bg-gray-100 p-3 rounded border-2 flex-col gap-2 items-center justify-center'>
                    <h1 className='text-center font-semibold text-lg mb-4'>
                      Matematik Operatör Seçimi
                    </h1>
                    <div className='flex justify-center items-center gap-2'>
                      {props.values.priceType && (
                        <div>
                          <select
                            value={props.values.mathOperator}
                            onChange={props.handleChange}
                            id='mathOperator'
                            name='mathOperator'
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
                            <option value='+%'>Yüzde (+%)</option>
                            <option value='-%'>Yüzde (-%)</option>
                          </select>
                        </div>
                      )}
                      {props.values.mathOperator && (
                        <div>
                          <input
                            value={props.values.finalPrice}
                            name='finalPrice'
                            id='finalPrice'
                            onChange={props.handleChange}
                            min='0'
                            className='hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[170px]'
                            type='number'
                            inputMode='decimal'
                            step='any'
                          />
                        </div>
                      )}
                    </div>
                    <ErrorMessage
                      name='mathOperator'
                      component='div'
                      className='field-error text-red-600 m-1'
                    />
                    {props.values.mathOperator && (
                      <ErrorMessage
                        name='finalPrice'
                        component='div'
                        className='field-error text-red-600 m-1'
                      />
                    )}
                    <p className='font-semibold text-center whitespace-nowrap mt-2'>
                      {`${props.values.priceType}'na ${
                        props.values.mathOperator
                      }${
                        props.values.finalPrice &&
                        props.values.finalPrice != undefined
                          ? props.values.finalPrice
                          : '0'
                      } işlemini uygula`}
                    </p>
                  </div>
                )}
                {/* 3. Adım (Koşul seçme butonları) */}
                {props.values.operationName.length > 0 && (
                  <div className='bg-gray-100 p-3 rounded border-2'>
                    <h1 className='text-center font-semibold text-lg mb-4'>
                      Ekstra İşlemler
                    </h1>
                    <div className='flex justify-center items-center'>
                      <div className='flex gap-2 justify-center'>
                        <button
                          onClick={
                            props.values.condition === false
                              ? () => props.setFieldValue('condition', true)
                              : () => props.setFieldValue('condition', false)
                          }
                          type='button'
                          className={`${
                            props.values.condition
                              ? 'bg-red-500'
                              : 'bg-gray-500 hover:bg-gray-400'
                          } text-white rounded p-1 font-semibold`}
                        >
                          {props.values.condition
                            ? 'Koşulu Kaldır (x)'
                            : 'Koşul Ekle (+)'}
                        </button>
                        <button
                          onClick={
                            props.values.orderCondition === false
                              ? () =>
                                  props.setFieldValue('orderCondition', true)
                              : () =>
                                  props.setFieldValue('orderCondition', false)
                          }
                          type='button'
                          className={`${
                            props.values.orderCondition
                              ? 'bg-red-500'
                              : 'bg-gray-500 hover:bg-gray-400'
                          } text-white rounded p-3 font-semibold`}
                        >
                          {props.values.orderCondition
                            ? 'İşlem Sırasını Kaldır (x)'
                            : 'İşlem Sırası Ekle (+)'}
                        </button>
                        <button
                          type='button'
                          onClick={
                            financialManagementSpecial
                              ? () => setFinancialManagementSpecial(false)
                              : () => setFinancialManagementSpecial(true)
                          }
                          className={`${
                            financialManagementSpecial
                              ? 'bg-red-500'
                              : 'bg-gray-500 hover:bg-gray-400'
                          } text-white rounded p-3 font-semibold`}
                        >
                          {financialManagementSpecial
                            ? 'Özel İşlemi Kaldır (x)'
                            : 'Özel İşlem Ekle (+)'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Adım (Koşullar. < > <... Liste Fiyatı / Liste x Adet Miktarı*/}
                {props.values.condition && (
                  <div className='bg-gray-100 w-fit p-3 rounded border-2 flex-col'>
                    <div className='w-fit mb-2 flex gap-2'>
                      <select
                        value={props.values.priceType}
                        id='priceType'
                        name='priceType'
                        onChange={props.handleChange}
                        className='w-[210px] h-[40px] border text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400'
                      >
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
                      <select
                        value={props.values.conditionType}
                        onChange={props.handleChange}
                        id='conditionType'
                        name='conditionType'
                        className='border w-[210px] h-[40px] text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400'
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
                    <div className='conditionValue flex justify-center'>
                      <div className='ml-2'>
                        {props.values.conditionType === '<' ? (
                          <div className='mb-2'>
                            <p className='inline mx-2'>
                              <span className='font-semibold'>
                                KOŞUL DEĞERİ
                              </span>
                              {' <'}
                            </p>
                            <input
                              value={props.values.conditionValue}
                              name='conditionValue'
                              id='conditionValue'
                              onChange={props.handleChange}
                              type='number'
                              step='any'
                              inputMode='decimal'
                              min='0'
                              className='hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[170px]'
                            />
                          </div>
                        ) : props.values.conditionType === '<=' ? (
                          <div className='mb-2'>
                            <p className='inline mx-2'>
                              <span className='font-semibold'>
                                KOŞUL DEĞERİ
                              </span>
                              {' <='}
                            </p>
                            <input
                              value={props.values.conditionValue}
                              name='conditionValue'
                              id='conditionValue'
                              onChange={props.handleChange}
                              type='number'
                              step='any'
                              inputMode='decimal'
                              min='0'
                              className='hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[170px]'
                            />
                          </div>
                        ) : props.values.conditionType === '>' ? (
                          <div className='mb-2'>
                            <p className='inline mx-2'>
                              <span className='font-semibold'>
                                KOŞUL DEĞERİ
                              </span>
                              {' >'}
                            </p>
                            <input
                              name='conditionValue'
                              id='conditionValue'
                              value={props.values.conditionValue}
                              onChange={props.handleChange}
                              type='number'
                              step='any'
                              inputMode='decimal'
                              min='0'
                              className='hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[170px]'
                            />
                          </div>
                        ) : props.values.conditionType === '>=' ? (
                          <div className='mb-2'>
                            <p className='inline mx-2'>
                              <span className='font-semibold'>
                                KOŞUL DEĞERİ
                              </span>
                              {' >='}
                            </p>
                            <input
                              name='conditionValue'
                              id='conditionValue'
                              value={props.values.conditionValue}
                              onChange={props.handleChange}
                              type='number'
                              step='any'
                              inputMode='decimal'
                              min='0'
                              className='hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[170px]'
                            />
                          </div>
                        ) : props.values.conditionType === '==' ? (
                          <div className='mb-2'>
                            <p className='inline mx-2'>
                              <span className='font-semibold'>
                                KOŞUL DEĞERİ
                              </span>
                              {' =='}
                            </p>
                            <input
                              name='conditionValue'
                              id='conditionValue'
                              value={props.values.conditionValue}
                              onChange={props.handleChange}
                              type='number'
                              step='any'
                              inputMode='decimal'
                              min='0'
                              className='hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[170px]'
                            />
                          </div>
                        ) : props.values.conditionType === '!=' ? (
                          <div className='mb-2'>
                            <p className='inline mx-2'>
                              <span className='font-semibold'>
                                KOŞUL DEĞERİ
                              </span>
                              {' !='}
                            </p>
                            <input
                              id='conditionValue'
                              name='conditionValue'
                              value={props.values.conditionValue}
                              onChange={props.handleChange}
                              type='number'
                              step='any'
                              inputMode='decimal'
                              min='0'
                              className='hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[170px]'
                            />
                          </div>
                        ) : props.values.conditionType === '<>' ? (
                          <div className='mb-2'>
                            <input
                              value={props.values.conditionValue}
                              id='conditionValue'
                              name='conditionValue'
                              onChange={props.handleChange}
                              type='number'
                              step='any'
                              inputMode='decimal'
                              min='0'
                              className='hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[100px]'
                            />
                            <p className='inline mx-2'>
                              {'< '}
                              <span className='font-semibold mx-2'>
                                KOŞUL DEĞERİ
                              </span>
                              {' >'}
                            </p>
                            <input
                              value={props.values.conditionValue2}
                              name='conditionValue2'
                              id='conditionValue2'
                              onChange={props.handleChange}
                              type='number'
                              step='any'
                              inputMode='decimal'
                              min='0'
                              className='hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[100px]'
                            />
                          </div>
                        ) : null}
                        <ErrorMessage
                          name='conditionValue'
                          component='div'
                          className='field-error text-red-600 m-1'
                        />
                        <ErrorMessage
                          name='conditionValue2'
                          component='div'
                          className='field-error text-red-600 m-1'
                        />
                        {props.values.conditionType != '' ? (
                          props.values.conditionType === '<>' ? (
                            <p className='block w-full font-semibold text-center'>{`${props.values.conditionValue} < ${props.values.priceType} > ${props.values.conditionValue2}`}</p>
                          ) : (
                            <p className='block w-full font-semibold text-center'>{`${props.values.priceType} ${props.values.conditionType} ${props.values.conditionValue}`}</p>
                          )
                        ) : null}
                      </div>
                    </div>
                  </div>
                )}
                {/* 5. Adım (İşlem Srırası Ekleme) */}
                {props.values.orderCondition && (
                  <div className='bg-gray-100 p-3 rounded border-2'>
                    <h1 className='text-center font-semibold text-lg'>
                      İşlem Sırası Ekle
                    </h1>
                    <div>
                      {props.values.orderCondition && (
                        <div>
                          <select
                            value={props.values.orderValue}
                            className='border text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400'
                            onChange={props.handleChange}
                            id='orderValue'
                            name='orderValue'
                          >
                            {orderLength > 0 &&
                              Array.from(
                                { length: orderLength },
                                (_, length) => (
                                  <option key={length} value={length + 1}>
                                    {length + 1}. İşlem Sırası
                                  </option>
                                )
                              )}
                            {orderLength == 0 && (
                              <option value='1'>1. İşlem Sırası</option>
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
                  </div>
                )}
              </div>
              {/* Özel İşlemler */}
              {financialManagementSpecial && (
                <div className='grid grid-cols-3 gap-2 mt-2'>
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
                                <option value='+%'>Yüzde (+%)</option>
                                <option value='-%'>Yüzde (-%)</option>
                              </Field>
                              {props.values.financialManagementSpecial[index]
                                .mathOperatorSpecial && (
                                <Field
                                  className='border text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400'
                                  name={`financialManagementSpecial[${index}].conditionValueSpecial`}
                                  as='select'
                                >
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
                                  inputMode='decimal'
                                  step='any'
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
