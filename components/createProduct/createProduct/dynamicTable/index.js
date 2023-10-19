"use client"
import React, { useState, useEffect } from 'react';
import { MdOutlineKeyboardArrowDown, MdDone } from "react-icons/md";
import { IoClose, IoCheckmarkDoneSharp, IoAddOutline, IoCloseOutline } from "react-icons/io5";
import { useRouter } from 'next/navigation'
import LoadingScreen from '@/components/other/loading';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import ResizeImage from '@/functions/others/resizeImage';
import Image from 'next/image';
import {postAPI, getAPI} from '@/services/fetchAPI';

const DynamicTable = ({ data, selectedCategoryKey, selectedCategoryValues, newUpdateData, setIsUpdateEnabled }) => {
  const router = useRouter();

  const objectKey = Object.keys(data)[0];
  const responseData = data[objectKey];
  
  //responseData içerisine yeni bir başlık ekle
  responseData["Extra"] = [
    {
      id: "ekstra",
      extraValue1: "",
    },
    {
      id: "ekstra",
      extraValue2: "",
    },
    {
      id: "ekstra",
      extraValue3: "",
    },
    {
      id: "ekstra",
      extraValue4: "",
    },
    {
      id: "ekstra",
      extraValue5: "",
    },
    {
      id: "ekstra",
      extraValue6: "",
    },
    {
      id: "ekstra",
      extraValue7: "",
    },
    {
      id: "ekstra",
      extraValue8: "",
    },
    {
      id: "ekstra",
      extraValue9: "",
    },
    {
      id: "ekstra",
      extraValue10: "",
    }
  ];

  responseData["Image"] = [
    {
      id: "image",
      imageValue1: "",
    },
    {
      id: "image",
      imageValue2: "",
    },
    {
      id: "image",
      imageValue3: "",
    },
    {
      id: "image",
      imageValue4: "",
    },
    {
      id: "image",
      imageValue5: "",
    },
    {
      id: "image",
      imageValue6: "",
    },
    {
      id: "image",
      imageValue7: "",
    },
    {
      id: "image",
      imageValue8: "",
    },
    {
      id: "image",
      imageValue9: "",
    },
    {
      id: "image",
      imageValue10: "",
    }
  ];


  const [isloading, setIsloading] = useState(false);  
  
  const [selectedFeature, setSelectedFeature] = useState("Ölçüler");
  const [checkboxValues, setCheckboxValues] = useState([]);
  
  const [addTypeEnabled, setAddTypeEnabled] = useState(false);
  const [productTypes, setProductTypes] = useState("");

  

  const [productName , setProductName] = useState("");
  const [productType, setProductType] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [languageIsEnabled, setLanguageIsEnabled] = useState(false);

  const [productNameTR , setProductNameTR] = useState("");
  const [productTypeTR, setProductTypeTR] = useState("");
  const [productCategoryTR, setProductCategoryTR] = useState("");

  const [productNameEN , setProductNameEN] = useState("");
  const [productTypeEN, setProductTypeEN] = useState("");
  const [productCategoryEN, setProductCategoryEN] = useState("");

  const [productNameUA , setProductNameUA] = useState("");
  const [productTypeUA, setProductTypeUA] = useState("");
  const [productCategoryUA, setProductCategoryUA] = useState("");

  useEffect( () => {
  if(newUpdateData){
    setCheckboxValues(newUpdateData.productFeatures);

    
  
    setProductName(newUpdateData.createProducts.productName);
    setProductType(newUpdateData.createProducts.productType);
    setProductPrice(newUpdateData.createProducts.productPrice);
  
    setProductNameTR(newUpdateData.createProducts.productNameTR);
    setProductTypeTR(newUpdateData.createProducts.productTypeTR);
    setProductCategoryTR(newUpdateData.createProducts.productCategoryTR);
    
    setProductNameEN(newUpdateData.createProducts.productNameEN);
    setProductTypeEN(newUpdateData.createProducts.productTypeEN);
    setProductCategoryEN(newUpdateData.createProducts.productCategoryEN);
  
    setProductNameUA(newUpdateData.createProducts.productNameUA);
    setProductTypeUA(newUpdateData.createProducts.productTypeUA);
    setProductCategoryUA(newUpdateData.createProducts.productCategoryUA);
  }
    
  }, [newUpdateData])

  const sendData = async (productName, productType, productPrice, selectedCategoryKey, selectedCategoryValues, checkboxValues) =>{
    setIsloading(true);

    // her ürün için uniq olarak bir ürün kodu oluşturuyoruz #########################
    //################################################################################

    // gün - ay - yıl - saat olarak türkiye zamanını al ve her bir veriyi ayrı değişkenlere string olarak kaydet. yılın sadece son 2 rakamını al.
    const date = new Date().toLocaleString("tr-TR", {timeZone: "Europe/Istanbul"});
    const day = date.split(" ")[0].split(".")[0];
    const month = date.split(" ")[0].split(".")[1];
    const year = date.split(" ")[0].split(".")[2].slice(2,4);
    const hour = date.split(" ")[1].split(":")[0];
    const minute = date.split(" ")[1].split(":")[1];

    // productName değerinin ilk 2 ve son 2 harfini alarak ürün kodunu oluştur
    const productNameFirst3Character = productName.slice(0,2).toUpperCase();
    const productNameLast3Character = productName.slice(-2).toUpperCase();

    // productType değerinin ilk 2 ve son 2 harfini alarak ürün kodunu oluştur
    const productTypeforCode = productType.slice(0,2).toUpperCase();

    // selectedCategoryKey değerinin ilk 2 ve son 2 harfini alarak ürün kodunu oluştur
    const selectedCategoryKeyforCode = selectedCategoryKey.slice(0,2).toUpperCase();

    // rasgele 2 tane tam sayı rakam oluştur sonra bunları string olarak yan yana yaz.
    const randomAlphabet = Math.floor(Math.random() * 10) + "" + Math.floor(Math.random() * 10);

    let productCode;
    // ürün kodunu oluştur
    if(!newUpdateData){
      productCode = (year + productNameFirst3Character + month + productTypeforCode + day + selectedCategoryKeyforCode + randomAlphabet).trim();
    }
    else{
      productCode = newUpdateData.createProducts.productCode;
    }
    //################################################################################
    //################################################################################

    const data = {
      productCode: productCode,
      productName: productName,
      productType: productType,
      productPrice: productPrice,
      selectedCategoryKey: selectedCategoryKey,
      selectedCategoryValues: selectedCategoryValues,
      productFeatures: checkboxValues,

      productNameTR: productNameTR,
      productTypeTR: productTypeTR,
      productCategoryTR: productCategoryTR,

      productNameUA: productNameUA,
      productTypeUA: productTypeUA,
      productCategoryUA: productCategoryUA,

      productNameEN: productNameEN,
      productTypeEN: productTypeEN,
      productCategoryEN: productCategoryEN,
    }

    try {
      if(newUpdateData){
        const responseData = await postAPI("/createProduct/createProduct",{data:data, processType:"update", productId:newUpdateData.createProducts.id});
        if(!responseData || responseData.status !== "success"){
            throw new Error("Veri eklenemedi");
        }
        setIsUpdateEnabled(false);
       setIsloading(false);

      }
      else{
        const responseData = await postAPI("/createProduct/createProduct",{data:data, processType:"post"});
        if(!responseData || responseData.status !== "success"){
            throw new Error("Veri eklenemedi");
        }
       setIsloading(false);

      }
      

       // ÜRÜN EKLEME İŞLEMİ TAMAMLANDIKTAN SONRA VAR OLAN VERİLERİ TEMİZLER VE PANELLERİ KAPATIR.
       setCheckboxValues([]);
        setProductName("");
        setProductType("");
        setAddTypeEnabled(false);
        setProductTypes("");
        setSelectedFeature("Ölçüler");
        setLanguageIsEnabled(false);

        setProductNameTR("");
        setProductTypeTR("");
        setProductCategoryTR("");

        setProductNameEN("");
        setProductTypeEN("");
        setProductCategoryEN("");
        
        setProductNameUA("");
        setProductTypeUA("");
        setProductCategoryUA("");

        getData();
        // ÜRÜN EKLEME İŞLEMİ TAMAMLANDIKTAN SONRA VAR OLAN VERİLERİ TEMİZLER VE PANELLERİ KAPATIR.
        
        router.refresh();
       toast.success("Veri başarıyla Eklendi");
  
    } catch (error) {
         toast.error(error.message);

    }
  }
  
  const getData = async () => {
    try {
      setIsloading(true);
      const response = await getAPI('/createProduct/createProduct');
  
      if(!response || response.status !== "success"){
        throw new Error("Veri çekilemedi JJKY7TB");
      }

      setProductTypes(response.data.createProducts);
      setIsloading(false);
  
    } catch (error) {
      setIsloading(false);
  
      toast.error(error.message);
      console.log(error);
    }
  } 

  // bu fonksiyon ile seçilen feature'a göre checkboxları oluşturuyoruz
  const returnExtraTargetValue = ( data, targetIndex, itemFeature ) => {
    // feature == Extra olanları içinden filtrele
    const filteredData = data.filter(item => item.feature === itemFeature);
  
    // targetIndex'e göre veriyi bul
    const targetData = filteredData.find(item => item.index === targetIndex);
  
    // targetData varsa targetValue'yu döndür, yoksa null döndür
    const targetValue = targetData ? targetData.targetValue : null;
  
    return targetValue;
  };


  useEffect(()  => {
    getData();
  }, [])
  

  // Seçilen checkbox değerini state'e ekleyen ana fonksiyon.
  const handleCheckboxChange = (index, feature, featureId, targetValue, checked, value, productName, productType, productPrice, selectedCategoryKey, selectedCategoryValues) => {
    // Değişen checkbox değerini yeni bir nesne olarak hazırla
    
    const newValue = {
      index,
      feature,
      featureId,
      targetValue,
      checked,
      value,
      productName,
      productType,
      productPrice,
      selectedCategoryKey,
      selectedCategoryValues,
    };

    // Eski arrayi yeni değerle birleştir ve state'i güncelle
    setCheckboxValues((prevValues) => {
      // Eğer önceki değer zaten varsa ve feature değeri aynı ise, onu sil ve yeni değeri ekle
      const filteredValues = prevValues.filter(
        (value) => !(value.index === index && value.feature === feature)
      );

      // checked değeri false ise onu sil
      if (!newValue.checked) return filteredValues;
    
      // Yeni değeri ekleyip güncellenmiş arrayi döndür
      return [...filteredValues, newValue];
    });
  };

  const cancelKeys = objectKey === "furniture" ? [
    'createdAt', 'updatedAt', 'translateEnabled', 'colourPickerEnabled',
    "addSwatchEnabled", "fabricTypeTurkish", "fabricTypeUkrainian", "fabricTypeEnglish", 
    "fabricDescriptionTurkish", "fabricDescriptionUkrainian", "fabricDescriptionEnglish",
     "fabricSwatchUkrainian", "fabricSwatchEnglish", "fabricSwatchTurkish",
    'addTypeEnabled', 'oneRangeEnabled', 'twoRangeEnabled', 'manuelDefined',
    'metalTypeTurkish', 'metalTypeUkrainian', 'metalTypeEnglish',
    'metalDescriptionTurkish', 'metalDescriptionUkrainian', 'metalDescriptionEnglish',
    'turkish', 'ukrainian', 'english', 'colourTypeTurkish', 'colourTypeUkrainian', 'colourTypeEnglish',
    'colourDescriptionTurkish', 'colourDescriptionUkrainian', 'colourDescriptionEnglish'
  ] : [];

  const handleFeatureSelect = (feature) => setSelectedFeature(feature);

  const getFeatureItems = () => Object.keys(responseData);

  const renderCell = (key, value) => (
    key === 'image' && value && value.length > 0 ?
      <div className='flex justify-center item-center'>
        <Image width={150} height={150} src={value} alt="Image" className="h-35 w-35 object-cover hover:scale-150 transition-all hover:border-2 border-gray-600 hover:rounded" />
      </div>
      : value
  );

  const renderTable = () => {
    if (selectedFeature === null) return null;
    const selectedResponseData = responseData[selectedFeature];

    const filteredData = selectedResponseData.map(item => {
      const filteredItem = {};
      Object.entries(item).forEach(([key, value]) => {
        if (!cancelKeys.includes(key)) filteredItem[key] = value;
      });
      return filteredItem;
    });

    const headerMappings = {
      // Ölçü
      firstValue: "1. Ölçü",
      secondValue: "2. Ölçü",
      unit: "Birim",

      // Renkler
      colourType: "Renk Tipi",
      colourDescription: "Renk Açıklaması",
      colourHex: "Renk Kodu",

      // Kumaş
      fabricType: "Kumaş Tipi",
      fabricDescription: "Kumaş Açıklaması",
      fabricSwatch: "Kartela",
      image: "Resim",

      // Metal
      metalType: "Metal Tipi",
      metalDescription: "Metal Açıklaması",
      image: "Resim",

      // Extra
      extraValue1: "Ekstra",

      // Resim
      imageValue1: "Resim",


    };

    // tablo fonksiyonu
    return (
      <div className="overflow-x-auto">
        <table className="table w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="p-3 text-white bg-blue-600 font-bold border-l border-white">Sıra</th>
              <th className="p-3 text-white bg-red-600 font-bold border-l border-white">Standart</th>
              <th className="p-3 text-white bg-red-600 font-bold border-l border-white">+ Ücret</th>
              <th className="p-3 text-white bg-red-600 font-bold border-l border-white">- Ücret</th>
              {Object.keys(filteredData[0]).map(header => (
                // tablo başlıklarının listelendiği bölüm
                header != "id" &&
                <th key={header} className="p-3 text-white bg-blue-600 border-l border-white font-bold">
                  {headerMappings[header] || header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              // tablo satırlarının listelendiği bölüm
              <tr key={index} 
              // eğer checkboxlardan herhangi biri seçilmişs ise bu satırı bg-green-200 yap.
              className={checkboxValues && checkboxValues.some(
                (value) =>
                  value.index === index &&
                  value.feature === selectedFeature &&
                  value.checked === true
              ) ? "bg-blue-50 " : ""}

              >
                <td className="p-3 border-t border-gray-300 border-l border-r text-center hover:bg-blue-100 ">
                {/* eğer checkboxlardan herhangi biri seçilmiş ise bu veriyi tik şareti yap. */}
                  <div className='h-full flex  justify-center items-center gap-2'>
                    {checkboxValues && checkboxValues.some((value) =>
                        value.index === index &&
                        value.feature === selectedFeature &&
                        value.checked === true) && 
                        <MdDone size={25} color='green' className="" />
                    }

                    {index + 1}
                  </div>
                </td>

                <td className="p-3 border-t border-gray-300 border-l border-r text-center hover:bg-blue-100">
                  <input type="checkbox" name="standard" value="standard" className='scale-150 cursor-pointer'

                    checked={checkboxValues && checkboxValues.some(
                      (value) =>
                        value.index === index &&
                        value.feature === selectedFeature &&
                        value.targetValue === "standard"
                    )}


                    onChange={(e) => {
                      handleCheckboxChange(index, selectedFeature, item.id, "standard", e.target.checked, null , productName, productType, productPrice, selectedCategoryKey, selectedCategoryValues)
                    }}
                  />
                  
                </td>
                <td className="p-2 border-t border-gray-300 border-l border-r text-center hover:bg-blue-100 ">
                  <input type="checkbox" name="plus" value="plus" className='scale-150 cursor-pointer'
                  checked={checkboxValues && checkboxValues.some(
                      (value) =>
                        value.index === index &&
                        value.feature === selectedFeature &&
                        value.targetValue === "plus"
                    )}
                  onChange={(e) => {
                      handleCheckboxChange(index, selectedFeature, item.id, "plus", e.target.checked, null, productName, productType, productPrice, selectedCategoryKey, selectedCategoryValues)
                    }}
                  />

                  { checkboxValues && checkboxValues.some(
                      (value) =>
                        value.index === index &&
                        value.feature === selectedFeature &&
                        value.targetValue === "plus"
                    ) ?
                    <input type="number"
                    defaultValue={0}
                    placeholder='322'
                    min={1}
                    className="w-20 h-10 border border-gray-300 rounded-md ml-0 sm:ml-4 text-center"
                    onChange={(e) => {
                      e.target.value > 0 &&
                      handleCheckboxChange(index, selectedFeature, item.id, "plus",true, e.target.value.toString(), productName, productType, productPrice, selectedCategoryKey, selectedCategoryValues)

                    }}
                  />
                  : null
                  }
                </td>
                <td className="p-2 border-t border-gray-300 border-l border-r text-center hover:bg-blue-100">
                  <input type="checkbox" name="minus" value="minus" className='scale-150 cursor-pointer'
                  checked={checkboxValues && checkboxValues.some(
                    (value) =>
                      value.index === index &&
                      value.feature === selectedFeature &&
                      value.targetValue === "minus"
                  )}
                  onChange={(e) => {
                      handleCheckboxChange(index, selectedFeature, item.id, "minus", e.target.checked, null, productName, productType, productPrice, selectedCategoryKey, selectedCategoryValues)
                    }}
                  />

                    { checkboxValues && checkboxValues.some(
                      (value) =>
                        value.index === index &&
                        value.feature === selectedFeature &&
                        value.targetValue === "minus"
                    ) ?
                    <input type="number"
                    defaultValue={0}
                    min={1}
                    placeholder='145'
                    className="w-20 h-10 border border-gray-300 rounded-md ml-0 sm:ml-4 text-center"
                    onChange={(e) => {
                      e.target.value > 0 &&
                      handleCheckboxChange(index, selectedFeature, item.id, "minus",true, ((-1 * e.target.value).toString()), productName, productType, productPrice, selectedCategoryKey, selectedCategoryValues)
                    }}
                  />
                  : null
                  }
                </td>

                {Object.entries(item).map(([key, value]) => (

                  // extra için tanımlama yapıldı
                  key != "id" && key.includes("extraValue")  ? 
                  <td key={key}  className={`
                  ${checkboxValues && checkboxValues.some((value) =>
                    value.feature.toLowerCase().includes("extra") && value.index === index && value.checked === true ) ? "bg-blue-100" : " opacity-30"}
                  p-3 border-t border-gray-300 border-l border-r text-center hover:bg-blue-100
                  `}>

                    <input type="text"

                    disabled={checkboxValues && checkboxValues.some((value) =>
                      value.feature.toLowerCase().includes("extra") && value.index === index && value.checked === true 
                    ) ? false : true}

                    value={
                      checkboxValues && checkboxValues.some((value) =>
                      value.feature.toLowerCase().includes("extra") && value.index === index && value.checked === true && value.extraValue && value.extraValue.length > 0) ?
                      checkboxValues.find((value) =>
                      value.feature.toLowerCase().includes("extra") && value.index === index && value.extraValue && value.extraValue.length > 0).extraValue
                      : ""
                    }

                    placeholder='Ekstra değer'
                    className="p-2 border border-gray-300 rounded-md ml-4 text-center w-full lg:w-2/3 "
                    onChange={(e) => {
                      // value.feature.toLowerCase().includes("extra") && value.index === index && value.checked === true
                      // checkboxValues içerisine yeni bir değer ekliyoruz. değer adı: "extraValue" ve değeri: e.target.value
                      const updatedCheckboxValues = checkboxValues.map(item => {
                        if (item.feature.toLowerCase().includes("extra") && item.index === index && item.checked === true) {
                          return { ...item, extraValue: e.target.value };
                        }
                        return item;
                      });
                      setCheckboxValues(updatedCheckboxValues);
                    }}
                  />
                  </td> : 

                // image için tanımlama yapıldı
                  key != "id" && key.includes("imageValue")  ? 
                  <td key={key}  className={`
                  ${checkboxValues && checkboxValues.some((value) =>
                    value.feature.toLowerCase().includes("image") && value.index === index && value.checked === true 
                  ) ? "bg-blue-100" : " opacity-30"}
                  p-3 border-t border-gray-300 border-l border-r text-center hover:bg-blue-100
                  `}>
                     <div className='flex flex-row flex-nowrap justify-center items-center gap-2'>

                      {
                        checkboxValues && checkboxValues.some((value) =>
                          value.feature.toLowerCase().includes("image") && value.index === index && value.checked === true && value.imageValue && value.imageValue.length > 0) ?
                        <div className='shadow  hover:scale-125 rounded transition-all '>    
                        <Image width={20} height={20}  src={checkboxValues.find((value) =>
                          value.feature.toLowerCase().includes("image") && value.index === index && value.imageValue && value.imageValue.length > 0).imageValue} alt="image" className="w-20 h-20 object-cover" />
                        </div>
                        :   
                        
                      <div className="hover:scale-105 transition-all relative border rounded-lg overflow-hidden">

                        <input type="file"
                        name={`image-${index}`}
                        id={`image-${index}`}
                        accept="image/*"
                        placeholder='Resim Ekle'
                        disabled={checkboxValues && checkboxValues.some((value) =>
                          value.feature.toLowerCase().includes("image") && value.index === index && value.checked === true 
                        ) ? false : true}

                        className="opacity-0 cursor-pointer w-28 h-10"
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          const resizedImageBase64 = await ResizeImage(file, 400, 400);
                          // value.feature.toLowerCase().includes("image") && value.index === index && value.checked === true
                          // checkboxValues içerisine yeni bir değer ekliyoruz. değer adı: "imageValue" ve değeri: e.target.value
                          const updatedCheckboxValues = checkboxValues.map(item => {
                            if (item.feature.toLowerCase().includes("image") && item.index === index && item.checked === true) {
                              return { ...item, imageValue: resizedImageBase64 };
                            }
                            return item;
                          });
                          setCheckboxValues(updatedCheckboxValues);
                        }}
                        />
                        <label
                          htmlFor={`image-${index}`}
                          className={checkboxValues && checkboxValues.some((value) =>
                            value.feature.toLowerCase().includes("image") && value.index === index && value.imageValue && value.imageValue.length > 0) ? 
                            "absolute inset-0 text-center p-2  bg-purple-600 text-white cursor-pointer transition  whitespace-nowrap" 
                            : 
                            "absolute inset-0 text-center p-2  bg-blue-600 text-white cursor-pointer transition whitespace-nowrap"
                          }

                          > {checkboxValues && checkboxValues.some((value) =>
                            value.feature.toLowerCase().includes("image") && value.index === index && value.imageValue && value.imageValue.length > 0) ? 
                             "Resim Seçildi" : "Resim Seç"}
                        </label> 
                      </div>
                      }
                    {checkboxValues && checkboxValues.some((value) =>
                      value.feature.toLowerCase().includes("image") && value.index === index && value.imageValue && value.imageValue.length > 0) && 
                      <div className=' hover:scale-125 transition-all hover:rotate-6'>
                        <button 
                          className=''
                          
                          onClick={(e) => {
                            // checkboxValues içerisinde featureId si image olan ve indexi bu satırın indexi olan değerin imageValue değerini sıfırlıyoruz.
                            const updatedCheckboxValues = checkboxValues.map(item => {
                              if (item.feature.toLowerCase().includes("image") && item.index === index) {
                                return { ...item, imageValue: "" };
                              }
                              return item;
                            });
                            setCheckboxValues(updatedCheckboxValues);

                          }}
                        >
                          <IoClose/>
                          </button>
                      </div> 
                      }
                      
                  </div>
                  
                  </td> :
                         
                    // colourHex için tanımlama yapıldı
                  key != "id" &&
                  <td key={key} className="p-3 border-t border-gray-300 border-l border-r text-center hover:bg-blue-100">
                    {key === "colourHex" ? (
                      <div style={{backgroundColor: value}}
                      className='p-4 rounded flex justify-center items-center text-white'
                      >{renderCell(key, value)}</div>
                      )

                      // normal değerler için tanımlama yapıldı
                      : renderCell(key, value)
                    }
                  </td>
                ))}

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  

  return (
    <div>
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
      {isloading && <LoadingScreen isloading={isloading} />}

      <div className='w-full bg-gray-100 p-2 lg:my-10 my-4 flex flex-col lg:flex-row flex-wrap gap-4 justify-center item-center'>
        <div className="flex flex-col justify-center items-center ">
          <h3 className='text-xl font-semibold text-gray-700 my-2'> Ürün Adı </h3>
          <input
            type="text"
            placeholder="Ürün Adı"
            value={productName}
            className="hover:scale-105 transition-all border border-gray-600 rounded-md p-2 mx-4 "
            onChange={(e) => {
              setProductName(e.target.value);
            }}
          />

        </div>
        <div className='flex flex-col justify-center items-center'>
          <h3 className='text-xl font-semibold text-gray-700 my-2'> Ürün Tipi </h3>
          <div className='flex lg:flex-row gap-4 flex-col'>
            <div className="flex flex-col justify-center items-center ">
                
                {/* (Ürün Tipi Seç - yok-2 - yok-3) seçme yapısı aşağıadadır. */}
                <select 
                  onChange={(e) => {!addTypeEnabled && setProductType(e.target.value)}}
                  type="select"
                  disabled={addTypeEnabled ? true : false}
                  value={!addTypeEnabled ? productType : ""}
                  id={`productType`}
                  name={`productType`}              
                  className="h-10 hover:scale-105 transition-all cursor-pointer  p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                  
                  <option value="">Ürün Tipi Seç</option>
                  {
                    productTypes && productTypes.length > 0 && productTypes.map((item, index) => (
                    // productType içi boş olanları eklemiyoruz.
                    item.productType != "" && item.productType &&

                    // aynı değere sahip olanlardan sadece birini ekliyoruz.
                    !productTypes.slice(0, index).some((item2) => item2.productType === item.productType) &&

                    <option key={index} value={item.productType}>{item.productType}</option>
                                            
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
                    onClick={() => {setProductType("")}}
                    className='hover:scale-105 transition-all p-2 bg-red-600 text-white rounded-md flex flex-row justify-center items-center gap-2'>
                      <IoCloseOutline size={20}/> <h4 className='whitespace-nowrap'>İptal</h4>
                    </div>
                    :
                    <div className='hover:scale-105 transition-all p-2 bg-green-600 text-white rounded-md flex flex-row justify-center items-center gap-2'>
                      <IoAddOutline size={20}/> <h4 className='whitespace-nowrap'>Ürün Tipi Ekle</h4>
                    </div>
                    }                    
                  </button>
                                    
                  <div className={`${addTypeEnabled ? "block" : "hidden"}`}>
                    <input
                      onChange={(e) => {addTypeEnabled && setProductType(e.target.value)}}
                      id={`productType`}
                      name={`productType`}
                      value={productType}
                      className={`hover:scale-105 transition-all border border-gray-600 rounded-md p-2 mx-4 `}
                      type="text"
                      placeholder="Yeni Ürün Tipi Adı Giriniz."
                    />
                  </div>
                </div>
              </div>
          </div>
        </div>

        {/* ürün fiyatı girme inputu */}
        <div className='flex flex-col justify-center items-center'>
          <h3 className='text-xl font-semibold text-gray-700 my-2'> Ürün Fiyatı </h3>
          <div className='flex lg:flex-row gap-4 flex-col'>
            <input
              onChange={(e) => {setProductPrice(e.target.value)}}
              id={`productPrice`}
              name={`productPrice`}
              defaultValue={0}
              value={productPrice}
              className={`hover:scale-105 transition-all border border-gray-600 rounded-md p-2 mx-4 `}
              type="number"
              placeholder="Ürün Fiyatı Giriniz."
            />
          </div> 
        </div>


        <div className="flex flex-col justify-end items-center hover:scale-110 transition-all hover:cursor-pointer"
        onClick={()=>setLanguageIsEnabled(!languageIsEnabled)}>
          <Image src="/translate.svg" width={40} height={40} alt="image"/>
        </div>

        {languageIsEnabled && (
          <div className=" cursor-default absolute lg:fixed w-screen h-[1600px] lg:h-screen z-50 left-0 top-0 bg-black bg-opacity-90">
            <div className="relative top-0 left-0 w-screen h-screen z-20 flex justify-center items-start lg:items-center ">
              <div className="p-2 bg-white rounded-lg relative pt-10 lg:pt-2 flex justify-center items-center flex-col">

                {/* çeviri kapatma iconu */}
                <div>
                {productNameTR || productTypeTR || productCategoryTR   ?
                  <div className="w-full flex justify-center items-center relative"
                    onClick={() => setLanguageIsEnabled(false)} 
                  >
                    <div className="cursor-pointer hover:scale-105 hover:rotate-6 transition-all my-4 lg:absolute bg-green-600 p-2 lg:-right-10 -top-20 scale-125 lg:-top-10 rounded-full w-10 h-10 flex justify-center items-center text-center">

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
                  {(productName || productType) && selectedCategoryValues &&
                    <h2 className="text-center w-full m-2">
                      Girilen Orjinal Değer
                    </h2>
                  }
                                          
                  <div className="flex flex-col gap-2 md:gap-2 justify-center items-center w-full ">
                                              
                    {productName && productName.trim().length > 0 && (
                      <div className="bg-black p-1 w-full rounded-lg text-white mb-2">
                        <h3 className='font-bold text-black bg-gray-200 inline-block p-2 rounded mr-2 min-w-[115px] text-end'>Ürün Adı :</h3>
                          {productName}
                      </div>
                    )}
                    {productType && productType.trim().length > 0 && (
                      <div className="bg-black p-1 w-full rounded-lg text-white mb-2">
                        <h3 className='font-bold text-black bg-gray-200 inline-block p-2 rounded mr-2 min-w-[115px] text-end'>Ürün Tipi :</h3>
                        {productType}
                      </div>
                    )}
                    {selectedCategoryValues && selectedCategoryValues.trim().length > 0 && (
                      <div className="bg-black p-1 w-full rounded-lg text-white mb-2">
                        <h3 className='font-bold text-black bg-gray-200 inline-block p-2 rounded mr-2 min-w-[115px] text-end'>Kategori :</h3>
                        {selectedCategoryValues}
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
                      onChange={(e) =>  setProductNameTR(e.target.value)}
                      id={`ProductNameTR`}
                      name={`ProductNameTR`}
                      className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                      type="text"
                      value = {productNameTR}
                      placeholder="Ürün Adı Türkçe"
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
                      onChange={(e) =>  setProductTypeTR(e.target.value)}
                      id={`productTypeTR`}
                      name={`productTypeTR`}
                      className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                      type="text"
                      value = {productTypeTR}
                      placeholder="Ürün Tipi Türkçe"
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
                      onChange={(e) =>  setProductCategoryTR(e.target.value)}
                      id={`productCategoryTR`}
                      name={`productCategoryTR`}
                      className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                      type="text"
                      value = {productCategoryTR}
                      placeholder="Ürün Kategorisi Türkçe"
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
                      onChange={(e) => setProductNameUA(e.target.value)}
                      id={`ProductNameUA`}
                      name={`ProductNameUA`}
                      className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                      type="text"
                      value = {productNameUA}
                      placeholder="Ürün Adı Ukraynaca"
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
                      onChange={(e) => setProductTypeUA(e.target.value)}
                      id={`productTypeUA`}
                      name={`productTypeUA`}
                      className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                      type="text"
                      value = {productTypeUA}
                      placeholder="Ürün Tipi Ukraynaca"
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
                      onChange={(e) => setProductCategoryUA(e.target.value)}
                      id={`productCategoryUA`}
                      name={`productCategoryUA`}
                      className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                      type="text"
                      value = {productCategoryUA}
                      placeholder="Ürün Kategorisi Ukraynaca"
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
                      onChange={(e) => setProductNameEN(e.target.value)}
                      id={`ProductNameEN`}
                      name={`ProductNameEN`}
                      className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                      type="text"
                      value = {productNameEN}
                      placeholder="Ürün Adı İngilizce"
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
                      onChange={(e) => setProductTypeEN(e.target.value)}
                      id={`productTypeEN`}
                      name={`productTypeEN`}
                      className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                      type="text"
                      value = {productTypeEN}
                      placeholder="Ürün Tipi İngilizce"
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
                      onChange={(e) => setProductCategoryEN(e.target.value)}
                      id={`productCategoryEN`}
                      name={`productCategoryEN`}
                      className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-[300px] m-2`}
                      type="text"
                      value = {productCategoryEN}
                      placeholder="Ürün Kategorisi İngilizce"
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}


      </div>

      
      { productType && productType != "" && productType.trim().length > 0 && productName &&  productName != "" && productName.trim().length > 0 ?   
          <div className='w-full'>
            <ul className="flex space-x-2 w-full p-4 justify-center item-center h-full flex-wrap gap-2">
              {getFeatureItems().map(featureItem => (
                <li
                  key={featureItem}
                  onClick={() => handleFeatureSelect(featureItem)}
                  className={`cursor-pointer py-2 px-4 ml-2 rounded-md flex flex-row flex-nowrap gap-2 justify-center items-center
                  ${selectedFeature === featureItem ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}
                  ${ featureItem == "Ölçüler" && "order-first ml-0"}`}
                >
                  
                  {featureItem == "Extra" ? "Ekstra" : featureItem == "Image" ? "Resim" : featureItem}
                </li>
              ))}

            </ul>
            {renderTable()}
            <div className='w-full flex justify-around items-center p-4'>
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={()=>setCheckboxValues([])}>
                Tümünü Temizle
              </button>
              <button className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded" onClick={()=>sendData(productName, productType, productPrice, selectedCategoryKey, selectedCategoryValues, checkboxValues)}>
                {newUpdateData ? "Ürünü Güncelle" : "Ürünü Kaydet"}
              </button>
            </div>
          </div>
          :
          <div className='w-full flex justify-center items-center p-2 '>
            <h3 className='text-center text-red-600'>Lütfen Önce <span className='text-red-600 font-bold'>Ürün Adını</span> ve <span className='text-red-600 font-bold'>Ürün Tipini</span>  Giriniz.</h3>
          </div>
      }
    </div>
  );
};

export default DynamicTable;



