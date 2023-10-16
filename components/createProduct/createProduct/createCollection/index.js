"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image'
import { IoClose, IoCheckmarkDoneSharp, IoAddOutline, IoCloseOutline, IoWarningOutline } from "react-icons/io5";
import { RxPlusCircled, RxListBullet, RxTriangleRight,  } from "react-icons/rx";
import {postAPI, getAPI} from '@/services/fetchAPI';
import ResizeImage from '@/functions/others/resizeImage';
import VisibleImage from '@/components/other/visibleImage';
import { ToastContainer, toast } from "react-toastify";

const CreateCollection = ({
  collectionProducts, 
  setIsloading, 
  collectionAllData, 
  setCollectionAllData, 
  collectionTypes, 
  setCollectionTypes,
  setCollectionUpdateEnabled,
  setCollectionUpdateData, 
  setCollectionListEnabled, 
  setListProductsEnabled,
  setCollectionUpdateImageData,
  setCollectionUpdateProductData,

  collectionUpdateData,
  collectionUpdateImageData,
  collectionUpdateProductData,
  collectionUpdateEnabled,
}) => {
  
  const [collectionName , setCollectionName] = useState("");
  const [collectionType, setCollectionType] = useState("");
  const [collectionDescription, setCollectionDescription] = useState("");
  const [collectionImages, setCollectionImages] = useState([]);
  const [visibleImages , setVisibleImages] = useState(false);
  const [languageIsEnabled, setLanguageIsEnabled] = useState(false);


  const [collectionNameTR , setCollectionNameTR] = useState("");
  const [collectionTypeTR, setCollectionTypeTR] = useState("");
  const [collectionDescriptionTR, setCollectionDescriptionTR] = useState("");

  const [collectionNameEN , setCollectionNameEN] = useState("");
  const [collectionTypeEN, setCollectionTypeEN] = useState("");
  const [collectionDescriptionEN, setCollectionDescriptionEN] = useState("");

  const [collectionNameUA , setCollectionNameUA] = useState("");
  const [collectionTypeUA, setCollectionTypeUA] = useState("");
  const [collectionDescriptionUA, setCollectionDescriptionUA] = useState("");

  const [collectionUpdateId, setCollectionUpdateId] = useState("");
  const [collectionUpdateCode, setCollectionUpdateCode] = useState("");

  const [addTypeEnabled, setAddTypeEnabled] = useState(false);
  

  // Koleksiyon güncelleme işlemi için gerekli olan verileri state'e atıyoruz.   ## GÜNCELLEME İŞLEMİ İÇİN ##
  useEffect(() => {
    if(collectionUpdateEnabled){
      
      if(collectionUpdateImageData){
        setCollectionImages(collectionUpdateImageData);
      }
  
      if(collectionUpdateData){

        setCollectionUpdateId(collectionUpdateData.id);
        setCollectionUpdateCode(collectionUpdateData.collectionCode);

        setCollectionName(collectionUpdateData.collectionName);
        setCollectionType(collectionUpdateData.collectionType);
        setCollectionDescription(collectionUpdateData.collectionDescription);

        setCollectionNameTR(collectionUpdateData.collectionNameTR);
        setCollectionTypeTR(collectionUpdateData.collectionTypeTR);
        setCollectionDescriptionTR(collectionUpdateData.collectionDescriptionTR);

        setCollectionNameEN(collectionUpdateData.collectionNameEN);
        setCollectionTypeEN(collectionUpdateData.collectionTypeEN);
        setCollectionDescriptionEN(collectionUpdateData.collectionDescriptionEN);

        setCollectionNameUA(collectionUpdateData.collectionNameUA);
        setCollectionTypeUA(collectionUpdateData.collectionTypeUA);
        setCollectionDescriptionUA(collectionUpdateData.collectionDescriptionUA);
      }
      // NOT: collectionUpdateProductData bölümü bir üst component olan "ListFeatureTable" bölümünde tanımlanmaktadır.
    }
    


  }, [collectionUpdateEnabled, collectionUpdateData, collectionUpdateImageData, collectionUpdateProductData])

  useEffect(() => {
    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    try {
      setIsloading(true);
      const response = await getAPI('/createProduct/createProduct/createCollection');
      

      if(!response || response.status !== "success"){
        throw new Error("Veri çekilemedi JJKY7TB");
      }
      // tüm getirilen verileri collectionAllData içerisine atıyoruz.
      setCollectionAllData(response.data);

      // collectionTypes içerisine response.data içindeki tüm collectionTypes verilerini atıyoruz.

        const uniqueCollectionTypes = [];
        
        response.data.collectionsData.forEach((item) => {
          if (!uniqueCollectionTypes.includes(item.collectionType)) {
            uniqueCollectionTypes.push(item.collectionType);
          }
        });
        // State'i güncelleyin
        setCollectionTypes(uniqueCollectionTypes);
      

      setIsloading(false);
  
    } catch (error) {
      setIsloading(false);
  
      //toast.error(error.message);
      console.log(error);
    }
  } 

  const submitCollection = async () => {
    try {
      setIsloading(true);
      let response;


      // YENİ KOLEKSİYON OLUŞTURMA İŞLEMİ İÇİN POST
    
        response = await postAPI('/createProduct/createProduct/createCollection',{
          processType: collectionUpdateEnabled && collectionUpdateData ? "update" : "create",
          collectionUpdateId, 
          collectionUpdateCode,
          collectionName,
          collectionType,
          collectionDescription,
          collectionImages,
          collectionNameTR,
          collectionTypeTR,
          collectionDescriptionTR,
          collectionNameEN,
          collectionTypeEN,
          collectionDescriptionEN,
          collectionNameUA,
          collectionTypeUA,
          collectionDescriptionUA,
          collectionProducts
        });
     
        
      
      if(!response || response.status !== "success"){
        throw new Error("Veri eklenemedi JJKY7TB");
      }

      setIsloading(false);
      toast.success(response.message);
  
    } catch (error) {
      setIsloading(false);
  
      toast.error(error.message);
      console.log(error);
    }
  }


  return (
    <div className='w-full p-2'>
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

        <VisibleImage collectionImages={collectionImages} visibleImages={visibleImages} setVisibleImages={setVisibleImages}/>

        <div className='w-full bg-gray-100 border-4 border-purple-600 p-2 lg:my-10 my-4 flex flex-col lg:flex-row flex-wrap gap-4 justify-center item-center rounded-md'>
        <div className='w-full flex justify-center items-center'>
          <h3 className='text-lg md:text-2xl font-bold bg-purple-600 p-4 rounded text-white'>{`${collectionUpdateEnabled && collectionUpdateData ? "Koleksiyonu Güncelle": "Koleksiyonu Oluştur"}`}</h3>
        </div>
        <div className='w-full flex justify-center item-center lg:items-end flex-col lg:flex-row flex-wrap gap-4'>
          <div className="flex flex-col justify-center items-center ">
            <h3 className='text-xl font-semibold text-gray-700 my-2'> Koleksiyon Adı </h3>
            <input
              type="text"
              placeholder="Koleksiyon Adı"
              value={collectionName}
              className="hover:scale-105 transition-all border border-gray-600 rounded-md p-2 "
              onChange={(e) => {
                setCollectionName(e.target.value);
              }}
            />

          </div>
          <div className="flex flex-col justify-center items-center">
            <h3 className='text-xl font-semibold text-gray-700 my-2'> Koleksiyon Açıklaması </h3>
            <input
              type="text"
              placeholder="Koleksiyon Açıklaması"
              value={collectionDescription}
              className="hover:scale-105 transition-all border border-gray-600 rounded-md p-2"
              onChange={(e) => {
                setCollectionDescription(e.target.value);
              }}
            />

          </div>
          <div className='flex flex-col justify-center items-center'>
            <h3 className='text-xl font-semibold text-gray-700 my-2'> Koleksiyon Tipi </h3>
            <div className='flex lg:flex-row gap-4 flex-col'>
              <div className="flex flex-col justify-center items-center ">
                  
                  {/* (Koleksiyon Tipi Seç - yok-2 - yok-3) seçme yapısı aşağıadadır. */}
                  <select 
                    onChange={(e) => {!addTypeEnabled && setCollectionType(e.target.value)}}
                    type="select"
                    disabled={addTypeEnabled ? true : false}
                    value={!addTypeEnabled ? collectionType : ""}
                    id={`collectionType`}
                    name={`collectionType`}              
                    className="h-10 hover:scale-105 transition-all cursor-pointer  p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    
                    <option value="">Koleksiyon Tipi Seç</option>
                    {
                      collectionTypes && collectionTypes.length > 0 && collectionTypes.map((item, index) => (
                        // collectionType içi boş olanları eklemiyoruz.
                        <option key={index} value={item}>{item}</option>
                                              
                      ))
                    }
                  </select>
                </div>             
                <div className='flex flex-col justify-center items-center'>
                  <div className={`flex justify-center items-center gap-2 flex-col lg:flex-row`}>
                    <button
                      type='button'
                      onClick={ () => {setAddTypeEnabled(!addTypeEnabled)}}
                    >
                      {
                      addTypeEnabled ?
                      <div 
                      onClick={() => {setCollectionType("")}}
                      className='hover:scale-105 transition-all p-2 bg-red-600 text-white rounded-md flex flex-row justify-center items-center gap-2'>
                        <IoCloseOutline size={20}/> <h4 className='whitespace-nowrap'>İptal</h4>
                      </div>
                      :
                      <div className='hover:scale-105 transition-all p-2 bg-green-600 text-white rounded-md flex flex-row justify-center items-center gap-2'>
                        <IoAddOutline size={20}/> <h4 className='whitespace-nowrap'>Koleksiyon Tipi Ekle</h4>
                      </div>
                      }                    
                    </button>
                                      
                    <div className={`${addTypeEnabled ? "block" : "hidden"}`}>
                      <input
                        onChange={(e) => {addTypeEnabled && setCollectionType(e.target.value)}}
                        id={`collectionType`}
                        name={`collectionType`}
                        value={collectionType}
                        className={`hover:scale-105 transition-all border border-gray-600 rounded-md p-2`}
                        type="text"
                        placeholder="Yeni Koleksiyon Tipi Adı Giriniz."
                      />
                    </div>
                  </div>
                </div>
              </div>
          </div>

          <div className="flex flex-col justify-end items-center hover:scale-110 transition-all hover:cursor-pointer"
          onClick={()=>setLanguageIsEnabled(!languageIsEnabled)}>
            <Image src="/translate.svg" width={40} height={40} alt="image"/>
          </div>

          <div className="hover:scale-105 transition-all relative border rounded-lg overflow-hidden">

            <input type="file"
            name={`image`}
            id={`image`}
            accept="image/*"
            placeholder='Resim Ekle'
            multiple={true}
            className="opacity-0 cursor-pointer w-40 h-10"

            onChange={async (e) => {
              setIsloading(true);
              const files = e.target.files;
              const updatedImages = [...collectionImages];

              for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (!file) return;

                const resizedImageBase64 = await ResizeImage(file, 400, 400);
                updatedImages.push(
                  {
                    collectionImage: resizedImageBase64,
                  }
                );
              }



              setCollectionImages(updatedImages);
              e.target.value = null;
              setIsloading(false);     
          }}
          />
            <label
            htmlFor={`image`}
            className={"absolute inset-0 text-center p-2  bg-blue-600 text-white cursor-pointer transition whitespace-nowrap"}
            > 
              <span className='flex justify-center items-center flex-row gap-2'>
                <RxPlusCircled size={25}/> Resim Ekle {
                  collectionImages && collectionImages.length > 0 &&
                  <span className="text-xs">({collectionImages.length})</span>
                }
              </span>              
            </label> 
            
          </div>

          
          {collectionImages && collectionImages.length > 0 &&
            <div className="bg-red-600 p-2 rounded-md hover:cursor-pointer hover:scale-110 transition-all"
                onClick={() => setCollectionImages([])}
                >
                  <h3 className='flex justify-center items-center flex-row gap-2 text-white'> 
                  <IoCloseOutline color='white' size={25}/> Resimleri Sil
                  </h3>
            </div>
          }

          <div>
            {
              collectionImages && collectionImages.length > 0  &&
              <div className="bg-gray-600 p-2 rounded-md hover:cursor-pointer hover:scale-110 transition-all"
                onClick={() => {collectionImages && collectionImages.length > 0 &&
                  setVisibleImages(true);
                }}
                >
                  <h3 className='flex justify-center items-center flex-row gap-2 text-white'>
                    <RxListBullet color='white' size={25}/> Resimleri Gör
                  </h3>
            </div> 
            }
                       
          </div>

          

          {languageIsEnabled && (
            <div className=" cursor-default fixed min-h-screen w-full h-full  lg:min-h-screen z-50 left-0 top-0 bg-black bg-opacity-90">
              <div className="relative top-2 left-0 w-screen min-h-screen z-20 flex lg:justify-center lg:items-center justify-center items-start">
                <div className="p-2 bg-white rounded-lg relative lg:pt-2 w-full lg:w-auto lg:mt-10 scale-90 lg:scale-100">

                  {/* çeviri kapatma iconu */}
                  <div>
                  {collectionNameTR || collectionTypeTR || collectionDescriptionTR   ?
                    <div className="w-full flex justify-center items-center relative"
                      onClick={() => setLanguageIsEnabled(false)} 
                    >
                      <div className="cursor-pointer hover:scale-105 hover:rotate-6 transition-all lg:absolute bg-green-600 p-2 lg:-right-10 -top-20 scale-125 lg:-top-10 rounded-full w-10 h-10 flex justify-center items-center text-center">

                        <IoCheckmarkDoneSharp color="white" size={40} />

                      </div>
                    </div>
                  :
                    <div className="w-full flex justify-center items-center relative"
                      onClick={() => setLanguageIsEnabled(false)} 
                    >
                      <div className="cursor-pointer hover:scale-105 hover:rotate-6 transition-all my-4 lg:absolute bg-red-600 p-2 lg:-right-10 -top-20 scale-125 lg:-top-10 rounded-full w-10 h-10 flex justify-center items-center text-center">
                        <IoClose color="white" size={40} />
                      </div>
                    </div>
                  }
                  </div>


                  {/* çeviri başlığı */}
                  <div>
                    {(collectionName || collectionType || collectionDescription) &&
                      <h2 className="text-center w-full m-2">
                        Girilen Orjinal Değer
                      </h2>
                    }

                    {/* Koleksiyon inputları */}                   
                    <div className="flex flex-col gap-2 md:gap-2 justify-center items-center w-full ">
                                                
                      {collectionName && collectionName.trim().length > 0 && (
                        <div className="bg-black p-1 w-full rounded-lg text-white mb-2">
                          <h3 className='font-bold text-black bg-gray-200 inline-block p-2 rounded mr-2 min-w-[115px] text-end'>Koleksiyon Adı :</h3>
                            {collectionName}
                        </div>
                      )}
                      {
                        collectionDescription && collectionDescription.trim().length > 0 && (
                          <div className="bg-black p-1 w-full rounded-lg text-white mb-2">
                          <h3 className='font-bold text-black bg-gray-200 inline-block p-2 rounded mr-2 min-w-[115px] text-end'>Koleksiyon Açıklaması :</h3>
                            {collectionDescription}
                        </div>
                        )
                      }
                      {collectionType && collectionType.trim().length > 0 && (
                        <div className="bg-black p-1 w-full rounded-lg text-white mb-2">
                          <h3 className='font-bold text-black bg-gray-200 inline-block p-2 rounded mr-2 min-w-[115px] text-end'>Koleksiyon Tipi :</h3>
                          {collectionType}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* çeviri inputları */}

                  {/* Türkçe çeviri alanı */}
                  <div>
                    <div className="w-full flex pl-1 justify-center item-center flex-row flex-nowrap gap-2">
                      <Image
                        className="hover:scale-105 transition-all"
                        src="/tr_flag.svg"
                        height={40}
                        width={40}
                        alt="TrFlag"
                      />

                      <input
                        onChange={(e) =>  setCollectionNameTR(e.target.value)}
                        id={`CollectionNameTR`}
                        name={`CollectionNameTR`}
                        className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                        type="text"
                        value = {collectionNameTR}
                        placeholder="Koleksiyon Adı Türkçe"
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

                        <input
                          onChange={(e) =>  setCollectionDescriptionTR(e.target.value)}
                          id={`collectionDescriptionTR`}
                          name={`collectionDescriptionTR`}
                          className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                          type="text"
                          value = {collectionDescriptionTR}
                          placeholder="Koleksiyon Açıklaması Türkçe"
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
                      <input
                        onChange={(e) =>  setCollectionTypeTR(e.target.value)}
                        id={`collectionTypeTR`}
                        name={`collectionTypeTR`}
                        className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                        type="text"
                        value = {collectionTypeTR}
                        placeholder="Koleksiyon Tipi Türkçe"
                      />
                    </div>
                  </div>

                  {/* Ukraynaca çeviri alanı */}
                  <div>
                    <div className="w-full flex pl-1 justify-center item-center flex-row flex-nowrap gap-2">
                      <Image
                        className="hover:scale-105 transition-all"
                        src="/ua_flag.svg"
                        height={40}
                        width={40}
                        alt="TrFlag"
                      />

                      <input
                        onChange={(e) => setCollectionNameUA(e.target.value)}
                        id={`CollectionNameUA`}
                        name={`CollectionNameUA`}
                        className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                        type="text"
                        value = {collectionNameUA}
                        placeholder="Koleksiyon Adı Ukraynaca"
                      />
                    </div>
                    <div className="w-full flex pl-1 justify-center item-center flex-row flex-nowrap gap-2">
                      <Image
                          className="hover:scale-105 transition-all"
                          src="/ua_flag.svg"
                          height={40}
                          width={40}
                          alt="TrFlag"
                        />

                        <input
                          onChange={(e) =>  setCollectionDescriptionUA(e.target.value)}
                          id={`collectionDescriptionUA`}
                          name={`collectionDescriptionUA`}
                          className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                          type="text"
                          value = {collectionDescriptionUA}
                          placeholder="Koleksiyon Açıklaması Ukraynaca"
                        />
                    </div>
                    <div className="w-full flex pl-1 justify-center item-center flex-row flex-nowrap gap-2">
                      <Image
                        className="hover:scale-105 transition-all"
                        src="/ua_flag.svg"
                        height={40}
                        width={40}
                        alt="TrFlag"
                      />
                      <input
                        onChange={(e) => setCollectionTypeUA(e.target.value)}
                        id={`collectionTypeUA`}
                        name={`collectionTypeUA`}
                        className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                        type="text"
                        value = {collectionTypeUA}
                        placeholder="Koleksiyon Tipi Ukraynaca"
                      />
                    </div>
                  </div>

                  {/* İngilizce çeviri alanı */}
                  <div>
                    <div className="w-full flex pl-1 justify-center item-center flex-row flex-nowrap gap-2">
                      <Image
                        className="hover:scale-105 transition-all"
                        src="/en_flag.svg"
                        height={40}
                        width={40}
                        alt="TrFlag"
                      />

                      <input
                        onChange={(e) => setCollectionNameEN(e.target.value)}
                        id={`CollectionNameEN`}
                        name={`CollectionNameEN`}
                        className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                        type="text"
                        value = {collectionNameEN}
                        placeholder="Koleksiyon Adı İngilizce"
                      />
                    </div>
                    <div className="w-full flex pl-1 justify-center item-center flex-row flex-nowrap gap-2">
                      <Image
                          className="hover:scale-105 transition-all"
                          src="/en_flag.svg"
                          height={40}
                          width={40}
                          alt="TrFlag"
                        />

                        <input
                          onChange={(e) =>  setCollectionDescriptionEN(e.target.value)}
                          id={`collectionDescriptionEN`}
                          name={`collectionDescriptionEN`}
                          className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                          type="text"
                          value = {collectionDescriptionEN}
                          placeholder="Koleksiyon Açıklaması İngilizce"
                        />
                    </div>
                    <div className="w-full flex pl-1 justify-center item-center flex-row flex-nowrap gap-2">
                      <Image
                        className="hover:scale-105 transition-all"
                        src="/en_flag.svg"
                        height={40}
                        width={40}
                        alt="TrFlag"
                      />
                      <input
                        onChange={(e) => setCollectionTypeEN(e.target.value)}
                        id={`collectionTypeEN`}
                        name={`collectionTypeEN`}
                        className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                        type="text"
                        value = {collectionTypeEN}
                        placeholder="Koleksiyon Tipi İngilizce"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Koleksiyon submit butonu */}         
        <div className='w-full flex justify-center items-center lg:mt-4'>

        <button 
        className={`${
          !collectionName || collectionName.trim().length < 1 ||
          !collectionProducts || collectionProducts.length < 1 ||
          !collectionType || collectionType.trim().length < 1 ? 
          "opacity-20 border-gray-700 bg-gray-600 ": 
          "border-purple-700 bg-purple-600 hover:scale-110 cursor-pointer opacity-100"
        }' p-2 rounded text-white font-bold w-full lg:w-1/3  border-2 transition-all`}
        onClick={async (e)  => {
          //Koleksiyonu veritabanına kaydetmek üzere fonksiyona gönderir.
          if(collectionName && collectionProducts  && collectionType){
            await submitCollection();
          }
          
        }}
        
        disabled = {
          !collectionName || collectionName.trim().length < 1 ||
          !collectionProducts || collectionProducts.length < 1 ||
          !collectionType || collectionType.trim().length < 1
        }
        >{`${collectionUpdateEnabled && collectionUpdateImageData ? "Koleksiyonu Güncelle" : "Koleksiyonu Oluştur"}`}</button>
        </div>
        {/* Koleksiyon uyarı mesaj bölümü */}         
        <div className='flex w-full justify-center items-center flex-wrap gap-4'>
        
        {collectionName.trim().length < 1 ?
          <div className='bg-red-600 p-2 text-white rounded flex flex-row flex-nowrap gap-2'>
            <IoWarningOutline size={25}/> Koleksiyon adı giriniz.
          </div>
        :
        collectionType.trim().length < 1 ?
          <div className='bg-red-600 p-2 text-white rounded flex flex-row flex-nowrap gap-2'>
            <IoWarningOutline size={25}/> Koleksiyon tipi ekleyiniz.
          </div>
        :
        !collectionProducts[0] &&
          <div className='bg-red-600 p-2 text-white rounded flex flex-row flex-nowrap gap-2'>
            <IoWarningOutline size={25}/> Koleksiyon için ürün seçiniz.
          </div>
        }

        </div>
      </div>


      { collectionProducts &&
      <div className='bg-gray-900 p-2 rounded inline-block'>
        
        <h3 className='text-white text-xl'>
          Toplam seçilen Ürün : <span className={`${ collectionProducts.length ? "text-green-600" : "text-red-600"} font-bold text-xl`}> {collectionProducts.length} </span> 
        </h3>
      </div>
      }
    </div>
  )
}

export default CreateCollection;
