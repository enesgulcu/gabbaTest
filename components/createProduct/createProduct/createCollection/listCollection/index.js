'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import {
  IoClose,
  IoCheckmarkDoneSharp,
  IoAddOutline,
  IoCloseOutline,
} from 'react-icons/io5';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import LoadingScreen from '@/components/other/loading';
import { getAPI, postAPI } from '@/services/fetchAPI';

const ListCollection = ({
  setCollectionUpdateEnabled,
  setCollectionUpdateData,
  setCollectionModeEnabled,
  setCollectionListEnabled,
  setListProductsEnabled,
}) => {
  const [isloading, setIsloading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [collectionProductsData, setCollectionProductsData] = useState(null);
  const [collectionImagesData, setCollectionImagesData] = useState(null);
  const [selectedCollectionLanguage, setSelectedCollectionLanguage] =
    useState('');
  const [selectedCollectionProducts, setSelectedCollectionProducts] =
    useState('');
  const [showCollectionProducts, setShowCollectionProducts] = useState(false);
  const [selectedCollectionData, setSelectedCollectionData] = useState(null);

  const [data, setData] = useState('');

  useEffect(() => {
    getData();
  }, []);

  // veritabanından verileri çek. (1)
  const getData = async (url) => {
    try {
      setIsloading(true);
      const response = await getAPI(
        '/createProduct/createProduct/createCollection'
      );
      if (response.status !== 'success') {
        throw new Error('Veri çekilemedi 1');
      }

      setData(response.data);
      setFilteredData(response.data.collectionsData);
      setCollectionProductsData(response.data.collectionProductsData);
      setCollectionImagesData(response.data.collectionImagesData);
      setIsloading(false);
    } catch (error) {
      setIsloading(false);
      console.log(error);
    }
  };

  // selectedCollectionProducts -> seçilen koleksiyonun ürünlerini "ürünlerin çevirilerini gösterir" gibi  listeleriz ve gösteririz.
  const listCollectionProducts = () => {
    if (
      showCollectionProducts &&
      selectedCollectionProducts &&
      selectedCollectionProducts.length > 0
    ) {
      return (
        <div className='absolute top-0 left-0 w-full z-50 bg-black bg-opacity-60 h-screen flex justify-center item-start lg:items-center'>
          <div className='absolute top-0 left-0 w-full bg-black bg-opacity-60'></div>
          <div className='relative top-0 left-0 w-full flex justify-center item-center'>
            <div className=' bg-white rounded-lg min-h-screen lg:min-h-min p-2'>
              <div className='flex flex-row flex-nowrap justify-center items-center gap-2'>
                <div className='flex flex-col justify-center items-center gap-2 p-2'>
                  {/* selectedCollectionData içindeki verileri listeleriz. */}

                  <div className='w-full flex flex-row gap-2 justify-center item-center flex-wrap bg-black lg:bg-opacity-0 p-2 rounded'>
                    <div className=' rounded flex flex-row flex-nowrap gap-2 w-full'>
                      <h3 className=' p-2 w-full bg-black rounded-lg text-white text-center text-xl'>
                        Koleksiyon Bilgileri
                      </h3>
                    </div>
                  </div>
                  <div className='w-full flex flex-row gap-2 justify-center item-center flex-wrap bg-blue-200 lg:bg-opacity-0 p-2 rounded'>
                    <div className='bg-blue-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                      <h3 className='text-center font-bold text-black'>
                        Koleksiyon Kodu :
                      </h3>
                      <h4 className='text-center text-black'>
                        {selectedCollectionData.collectionCode}
                      </h4>
                    </div>
                    <div className='bg-blue-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                      <h3 className='text-center font-bold text-black'>
                        Koleksiyon Adı :
                      </h3>
                      <h4 className='text-center text-black'>
                        {selectedCollectionData.collectionName}
                      </h4>
                    </div>
                    <div className='bg-blue-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                      <h3 className='text-center font-bold text-black'>
                        Koleksiyon Tipi :
                      </h3>
                      <h4 className='text-center text-black'>
                        {selectedCollectionData.collectionType}
                      </h4>
                    </div>
                  </div>

                  <h3 className='w-full p-2 flex justify-center items-center'>
                    <span className='text-center font-bold text-black lg:text-xl'>
                      Koleksiyonun Ürünleri
                    </span>
                  </h3>
                  {selectedCollectionProducts &&
                    selectedCollectionProducts.length > 0 &&
                    // seçilen koleksiyonun ürünlerini table ile listeleriz.
                    selectedCollectionProducts.map((item, index) => (
                      <table
                        key={index}
                        className='w-full text-sm text-left text-gray-500 dark:text-gray-400 m-2'
                      >
                        <thead className='text-md text-gray-700  bg-blue-500 dark:text-white border-blue-600 border-2'>
                          <tr className='bg-blue-600 w-full'>
                            <th className=' text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2 text-white'>
                              Sıra
                            </th>
                            <th className=' text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2 text-white'>
                              Ürün Kodu
                            </th>
                            <th className=' text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2 text-white'>
                              Ürün Adı
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className='bg-white border-b border-gray-200'>
                            <td className='text-center lg:p-2 border-l border-r border-b border-black w-6 lg:w-10'>
                              <div className='flex justify-center items-center h-full mt-2 w-full text-center py-2'>
                                <div className='bg-black text-white rounded-full flex justify-center items-center w-6 h-6 text-center'>
                                  {index + 1}
                                </div>
                              </div>
                            </td>
                            <td className='text-center lg:p-2 border-r border-b border-black lg:w-40'>
                              <div className='text center flex justify-center item-center'>
                                {item.productCode}
                              </div>
                            </td>
                            <td className='text-center lg:p-2 border-r border-b border-black'>
                              <div className='text center flex justify-center item-center'>
                                {item.productName}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    ))}

                  <div>
                    <div
                      className='bg-red-600 m-2 p-2 rounded-full cursor-pointer hover:scale-105 transition hover:rotate-6 hover:border-2 hover:border-white '
                      onClick={() => {
                        setShowCollectionProducts(false);
                        setSelectedCollectionProducts('');
                        setSelectedCollectionData('');
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
      );
    }
  };

  const deleteCollection = async (id) => {
    // id -> CollectionId
    // process -> deleteCollection

    try {
      setIsloading(true);
      const responseData = await postAPI(
        '/createProduct/createProduct/createCollection',
        { data: id, processType: 'delete' }
      );
      if (!responseData || responseData.status !== 'success') {
        throw new Error('Veri silinemedi');
      }

      await getData('/createProduct/createProduct/createCollection');

      toast.success('Veri başarıyla Silindi');
      setIsloading(false);
    } catch (error) {
      toast.error(error.message);
      setIsloading(false);
    }
  };

  const renderHead = () => {
    const tableHeaders = [
      'sıra',
      'Koleksiyon Kodu',
      'Koleksiyon Adı',
      'Koleksiyon Tipi',
      'Koleksiyon Açıklaması',
      'Koleksiyon Resmi',
      'Dil Çevirisi',
      'Koleksiyon Ürünleri',
      'İşlem',
    ];

    return (
      <tr className='bg-blue-600 text-white'>
        {tableHeaders.map((header, index) => (
          <th
            key={index}
            scope='col'
            className=' text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2'
          >
            {header}
          </th>
        ))}
      </tr>
    );
  };

  const renderData = () => {
    //

    return (
      filteredData &&
      filteredData.map((item, index) => (
        <tr key={index} className={`border-b hover:bg-blue-50`}>
          {/* sıra numarası */}
          {
            // eğer collectionCollections içerisinde seçilen koleksiyon var ise bu td elementinin css rengini mavi yap
          }
          <td className={` border-r border-b border-black text-center`}>
            <div className='flex justify-center items-center h-full mt-2 w-full text-center py-2'>
              <div className='bg-black text-white rounded-full flex justify-center items-center w-6 h-6 text-center'>
                {index + 1}
              </div>
            </div>
          </td>

          {/* koleksiyon kodu */}
          <td className={` border-r border-b border-black text-center`}>
            <div>{item.collectionCode}</div>
          </td>

          {/* koleksiyon adı */}
          <td className={` border-r border-b border-black text-center`}>
            <div>{item.collectionName}</div>
          </td>

          {/* koleksiyon tipi */}
          <td className={` border-r border-b border-black text-center`}>
            <div>{item.collectionType}</div>
          </td>

          {/* seçilen kategori */}
          <td className={` border-r border-b border-black text-center`}>
            <div>{item.collectionDescription}</div>
          </td>

          {/* koleksiyon resmi */}
          <td className={` text-center py-2 border-r border-b border-black`}>
            <div className='w-full flex justify-center item-center flex-wrap'></div>
          </td>

          <td className={` text-center py-2 border-r border-b border-black`}>
            <div className='h-20 flex justify-center items-center'>
              <Image
                onClick={() => setSelectedCollectionLanguage(item)}
                className='hover:scale-125 transition-all cursor-pointer'
                src='/translate_book.svg'
                height={30}
                width={40}
                alt='TrFlag'
              />
            </div>
            {/*  ürünlerin çevirilerini gösterir */}
            {selectedCollectionLanguage &&
              selectedCollectionLanguage !== '' && (
                <div className='absolute top-0 left-0 w-full z-40 bg-black bg-opacity-90 h-screen flex justify-center item-start lg:items-center'>
                  <div className='absolute top-0 left-0 w-full h-[2500px] bg-black bg-opacity-90'></div>
                  <div className='relative top-0 left-0 w-full flex justify-center item-center'>
                    <div className=' bg-white rounded-lg min-h-screen lg:min-h-min'>
                      <div className='flex flex-row flex-nowrap justify-center items-center gap-2'>
                        <div className='flex flex-col justify-center items-center gap-2 p-2'>
                          <div className='w-full flex flex-row gap-2 justify-center item-center flex-wrap bg-black lg:bg-opacity-0 p-2 rounded'>
                            <div className=' rounded flex flex-row flex-nowrap gap-2 w-full'>
                              <h3 className=' p-2 w-full bg-black rounded-lg text-white text-center text-xl'>
                                Dil Çevrisi - Koleksiyon bilgileri
                              </h3>
                            </div>
                          </div>

                          <div className='w-full flex flex-row gap-2 justify-center item-center flex-wrap bg-blue-200 lg:bg-opacity-0 p-2 rounded'>
                            <div className='bg-blue-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                              <h3 className='text-center font-bold text-black'>
                                Koleksiyon Adı Türkçe :
                              </h3>
                              <h4 className='text-center text-black'>
                                {selectedCollectionLanguage.collectionNameTR}
                              </h4>
                            </div>
                            <div className='bg-blue-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                              <h3 className='text-center font-bold text-black'>
                                Koleksiyon Tipi Türkçe :
                              </h3>
                              <h4 className='text-center text-black'>
                                {selectedCollectionLanguage.collectionTypeTR}
                              </h4>
                            </div>
                            <div className='bg-blue-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                              <h3 className='text-center font-bold text-black'>
                                Koleksiyon Kategorisi Türkçe :
                              </h3>
                              <h4 className='text-center text-black'>
                                {
                                  selectedCollectionLanguage.collectionDescriptionTR
                                }
                              </h4>
                            </div>
                          </div>

                          <div className='w-full flex flex-row gap-2 justify-center item-center flex-wrap bg-orange-200 lg:bg-opacity-0 p-2 rounded'>
                            <div className='bg-orange-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                              <h3 className='text-center font-bold text-black'>
                                Koleksiyon Adı İngilizce :
                              </h3>
                              <h4 className='text-center text-black'>
                                {selectedCollectionLanguage.collectionNameUA}
                              </h4>
                            </div>
                            <div className='bg-orange-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                              <h3 className='text-center font-bold text-black'>
                                Koleksiyon Tipi İngilizce :
                              </h3>
                              <h4 className='text-center text-black'>
                                {selectedCollectionLanguage.collectionTypeUA}
                              </h4>
                            </div>
                            <div className='bg-orange-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                              <h3 className='text-center font-bold text-black'>
                                Koleksiyon Kategorisi İngilizce :
                              </h3>
                              <h4 className='text-center text-black'>
                                {
                                  selectedCollectionLanguage.collectionDescriptionUA
                                }
                              </h4>
                            </div>
                          </div>

                          <div className='w-full flex flex-row gap-2 justify-center item-center flex-wrap bg-green-200 lg:bg-opacity-0 p-2 rounded'>
                            <div className='bg-green-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                              <h3 className='text-center font-bold text-black'>
                                Koleksiyon Adı Ukraynaca :
                              </h3>
                              <h4 className='text-center text-black'>
                                {selectedCollectionLanguage.collectionNameEN}
                              </h4>
                            </div>
                            <div className='bg-green-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                              <h3 className='text-center font-bold text-black'>
                                Koleksiyon Tipi Ukraynaca :
                              </h3>
                              <h4 className='text-center text-black'>
                                {selectedCollectionLanguage.collectionTypeEN}
                              </h4>
                            </div>
                            <div className='bg-green-100 p-2 rounded flex flex-row flex-nowrap gap-2 w-full'>
                              <h3 className='text-center font-bold text-black'>
                                Koleksiyon Kategorisi Ukraynaca :
                              </h3>
                              <h4 className='text-center text-black'>
                                {
                                  selectedCollectionLanguage.collectionDescriptionEN
                                }
                              </h4>
                            </div>
                          </div>

                          <div>
                            <div
                              className='bg-red-600 m-2 p-2 rounded-full cursor-pointer hover:scale-105 transition hover:rotate-6 hover:border-2 hover:border-white '
                              onClick={() => {
                                setSelectedCollectionLanguage('');
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
              )}
          </td>

          {/* koleksiyon ürünleri butona tıklayınca ürün bilgileri listelensin*/}
          <td className={` text-center py-2 border-r border-b border-black`}>
            <div className='flex justify-center item-center flex-row gap-2 md:gap-4 lg:gap-6 lg:flex-nowrap'>
              <button
                onClick={async () => {
                  const productItems = [];
                  // seçilen itemin içindeki id değeri ile collectionProductsData içerisindeki productId eşit ise o ürünün bilgilerini listele.
                  collectionProductsData.map((productItem) => {
                    // item.id -> seçilen koleksiyonun id si
                    // Tüm eşleşenleri array olarak state 'e atıyoruz.
                    if (productItem.collectionId === item.id) {
                      productItems.push(productItem);
                    }
                  });
                  productItems && setSelectedCollectionProducts(productItems);
                  setShowCollectionProducts(true);
                  setSelectedCollectionData(item);
                }}
                className='p-2 flex flex-row justify-center items-center gap-2 whitespace-nowrap bg-blue-600 text-white rounded shadow font-bold hover:scale-110 hover:cursor-pointer transition-all '
              >
                <FaEye size={20} />{' '}
                <span className='hidden lg:block'>Ürünleri Gör</span>
              </button>
            </div>
          </td>

          {/* işlem */}
          <td
            className={` text-center py-2 border-r border-b border-black px-1`}
          >
            <div className='flex justify-center item-center flex-row gap-2 md:gap-4 lg:gap-6 lg:flex-nowrap'>
              <button
                onClick={() => deleteCollection(item.id)}
                className='bg-red-600 rounded hover:cursor-pointer hover:scale-110 transition-all inline-block text-white font-bold text-md shadow p-2'
              >
                <FaTrash size={20} />
              </button>
              <button
                onClick={async () => {
                  // listFeatureTable içine buradan güncellenecek koleksiyon verilerini göndeririz.
                  // setCollectionUpdateData -> item
                  // setCollectionUpdateEnabled -> true
                  setCollectionUpdateData(item);
                  setCollectionUpdateEnabled(true);
                  setCollectionModeEnabled(true);
                  setCollectionListEnabled(false);
                  setListProductsEnabled(true);
                }}
                className='bg-blue-600 rounded hover:cursor-pointer hover:scale-110 transition-all inline-block text-white font-bold text-md shadow p-2'
              >
                <FaEdit size={20} />
              </button>
            </div>
          </td>
        </tr>
      ))
    );
  };

  const renderFeaturesTable = () => {
    // readyForListFeature içerisindeki verileri burada listeleriz.

    const excludedKeys = [
      'id',
      'oneRangeEnabled',
      'twoRangeEnabled',
      'manuelDefined',
      'translateEnabled',
      'createdAt',
      'updatedAt',
      'colourPickerEnabled',
      'addSwatchEnabled',
      'index',
      'feature',
      'featureId',
      'checked',
      'productId',
      'productName',
      'productType',
      'selectedDescriptionKey',
      'selectedDescriptionValues',
      'targetValue',
      'value',
    ];
    const keyMappings = {
      firstValue: 'Birinci Değer',
      secondValue: 'İkinci Değer',
      unit: 'Ölçü Tipi',

      colourType: 'Renk',
      colourDescription: 'Renk Koleksiyon Tipisı',
      colourHex: 'Renk Kodu',

      fabricType: 'Koleksiyon Türü',
      fabricDescription: 'Koleksiyon Koleksiyon Tipisı',
      fabricSwatch: 'Koleksiyon Adı',
      image: 'Resim',

      metalType: 'Metal Türü',
      metalDescription: 'Metal Koleksiyon Tipisı',

      imageValue: 'Resim',
      extraValue: 'Ekstra',
      // Diğer anahtarları buraya ekleyebilirsiniz...
    };

    const filteredKeys = readyForListFeature.map((item) =>
      Object.keys(item).filter(
        (key) =>
          !excludedKeys.includes(key) &&
          !key.toLowerCase().includes('turkish') &&
          !key.toLowerCase().includes('ukrainian') &&
          !key.toLowerCase().includes('english')
      )
    );

    return (
      <div className='w-full overflow-auto  lg:min-h-[200px] bg-gray-600'>
        <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
          <thead className='text-md text-gray-700 bg-gray-50 dark:bg-blue-500 dark:text-white'>
            <tr className='bg-blue-600 w-full'>
              <th className=' text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2 text-white'>
                Sıra
              </th>

              {filteredKeys[0].map(
                (key, index) =>
                  (selectedFeature &&
                    selectedFeature.length > 0 &&
                    selectedFeature.toLowerCase().includes('extra') &&
                    !key.toLowerCase().includes('extra')) ||
                  (selectedFeature &&
                    selectedFeature.length > 0 &&
                    selectedFeature.toLowerCase().includes('image') &&
                    !key.toLowerCase().includes('image')) || (
                    <th
                      key={index}
                      scope='col'
                      className=' text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2 text-white'
                    >
                      {keyMappings[key] && keyMappings[key].length > 0
                        ? keyMappings[key]
                        : key}
                    </th>
                  )
              )}

              <th className=' text-xs md:text-md lg:text-lg text-center py-4 border-l border-white p-2 text-white bg-gray-700'>
                İşlemler
              </th>
            </tr>
          </thead>

          <tbody>
            {readyForListFeature &&
              readyForListFeature.map((item, index) => (
                <tr key={index} className='bg-white border-b border-gray-200'>
                  <td className='text-center py-2 border-r border-b border-black'>
                    <div className='flex justify-center items-center h-full mt-2 w-full text-center py-2'>
                      <div className='bg-black text-white rounded-full flex justify-center items-center w-6 h-6 text-center'>
                        {index + 1}
                      </div>
                    </div>
                  </td>

                  {filteredKeys[0].map(
                    (key, index) =>
                      (selectedFeature &&
                        selectedFeature.length > 0 &&
                        selectedFeature.toLowerCase().includes('extra') &&
                        !key.toLowerCase().includes('extra')) ||
                      (selectedFeature &&
                        selectedFeature.length > 0 &&
                        selectedFeature.toLowerCase().includes('image') &&
                        !key.toLowerCase().includes('image')) || (
                        <td
                          key={index}
                          className='text-center py-2 border-r border-b border-black'
                        >
                          <div className='text center flex justify-center item-center'>
                            {key.toLowerCase().includes('image')
                              ? item[key] &&
                                item[key].length > 0 && (
                                  <Image
                                    className='hover:scale-150 transition-all rounded shadow'
                                    width={100}
                                    height={100}
                                    src={item[key]}
                                    alt={`image${index}`}
                                  />
                                )
                              : item[key]}
                          </div>
                        </td>
                      )
                  )}

                  <td className='text-center py-2 border-r border-b border-black'>
                    <div className='flex flex-row justify-center items-center gap-2'>
                      {/* item -> özelliğin kendi verisini tutar*/}
                      <button
                        onClick={() =>
                          deleteCollection(
                            {
                              featureId: item.id,
                              productId: selectedCollection.id,
                            },
                            'deleteFeature'
                          )
                        }
                        className='bg-red-600 rounded hover:cursor-pointer hover:scale-110 transition-all inline-block text-white font-bold text-md shadow p-2'
                      >
                        <FaTrash size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  };

  // gelen verileri tablo haline getiriyoruz ve listeliyoruz.
  return (
    <div className='w-full'>
      {isloading && <LoadingScreen isloading={isloading} />}

      {
        // resim seçildiğinde resmi büyütüyoruz ve ekranda gösteriyoruz (1)
        selectedImage && (
          <div className='absolute w-full h-full z-20 bg-black bg-opacity-80'>
            <div className='relative w-full h-full flex flex-col justify-center items-center gap-2'>
              <div
                className='bg-red-600 rounded-full hover:cursor-pointer hover:scale-110 transition-all'
                onClick={() => setSelectedImage(null)}
              >
                <IoCloseOutline size={50} color='white' />
              </div>

              <Image
                width={750}
                height={750}
                src={selectedImage}
                alt={`image`}
              />
            </div>
          </div>
        )
      }

      {/* ürünleri listelediğimiz tablomuz */}
      <div className='w-full overflow-auto'>
        {
          listCollectionProducts() // seçilen koleksiyonun ürünlerini listeler.
        }
        <table
          className={`${
            showCollectionProducts &&
            selectedCollectionProducts &&
            'max-h-screen overflow-hidden blur'
          } ${
            selectedImage && 'blur'
          } w-full text-sm text-left text-gray-500 dark:text-gray-400`}
        >
          <thead className='text-md text-gray-700 bg-gray-50 dark:bg-blue-500 dark:text-white'>
            {renderHead()}{' '}
          </thead>
          <tbody>{renderData()} </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListCollection;
