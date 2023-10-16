"use client"
import { useState, useEffect } from "react";
import { getAPI, postAPI } from '@/services/fetchAPI';
import DropDownCatagories from "@/components/createProduct/createProduct/dropDownCatagories"
import DynamicTable from "@/components/createProduct/createProduct/dynamicTable"
import LoadingScreen from '@/components/other/loading';
import ListFeatureTable from "@/components/createProduct/createProduct/listFeatureTable"
import { RxPlusCircled, RxListBullet, RxTriangleRight } from "react-icons/rx";
import { IoClose, IoCheckmarkDoneSharp, IoAddOutline, IoCloseOutline } from "react-icons/io5";
import { BiFilterAlt } from "react-icons/bi";
import ListCollection from "@/components/createProduct/createProduct/createCollection/listCollection";


// özellikler ve alt özelliklerin verilerini çekmek için kullanılır yeni bir yapı eklenirse buraya eklenmelidir. enes dikkat !
const categoriesData = {
  furniture: {
    label: "Mobilya",
    colors: {
      label: "Renkler",
      apiGetRequest: "/createProduct/colors",
    },
    fabrics: {
      label: "Kumaşlar",
      apiGetRequest: "/createProduct/fabrics",
    },
    measurementsrs: {
      label: "Ölçüler",
      apiGetRequest: "/createProduct/measurements",
    },
    metals: {
      label: "Metaller",
      apiGetRequest: "/createProduct/metals",
    }
  },
};

const CreateProductComponent = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [data, setData] = useState({});
  const [isloading, setIsloading] = useState(false);
  const [listProductsEnabled, setListProductsEnabled] = useState(true);


  const [filterEnabled, setFilterEnabled] = useState(false);
  const [filterProductName, setFilterProductName] = useState("");
  const [filterProductCode, setFilterProductCode] = useState("");
  const [filterProductType, setFilterProductType] = useState("");
  const [filterProductCategory, setFilterProductCategory] = useState("");
  
  const [isUpdateEnabled, setIsUpdateEnabled] = useState(false);
  const [newUpdateData, setNewUpdateData] = useState({}); 

  const [collectionModeEnabled, setCollectionModeEnabled] = useState(false); // koleksiyon modu aktif mi ?
  const [collectionListEnabled, setCollectionListEnabled] = useState(false); // koleksiyon listeleme modu aktif mi ?
  const [chooseProducts, setChooseProducts] = useState([]); // koleksiyon modu aktif ise seçilen ürünleri tutar.

  const [collectionAllData, setCollectionAllData] = useState("");
  const [collectionTypes, setCollectionTypes] = useState("");

  const [collectionUpdateEnabled, setCollectionUpdateEnabled] = useState(false);
  const [collectionUpdateData, setCollectionUpdateData] = useState({});
  const [collectionUpdateImageData, setCollectionUpdateImageData] = useState({});
  const [collectionUpdateProductData, setCollectionUpdateProductData] = useState({});

  

  
  useEffect(() => {
    // update işlemi sırasında koleksiyon resimlerini ve ürünlerini çekmek için yapılan işlem.
    if(collectionUpdateEnabled && collectionUpdateData){
      //koleksiyon id si ile "koleksiyonun ürünlerini" ve "resimleri" getiririz.
      getUpdateCollectionData(collectionUpdateData.id);
    }

  }, [collectionUpdateEnabled, collectionUpdateData])
  
  

  useEffect(() => {
    
    if(isUpdateEnabled && newUpdateData && newUpdateData.createProducts && newUpdateData){
      // kategori ataması otomatik yapılır.
      setSelectedCategory({key: newUpdateData.createProducts.selectedCategoryKey, value: newUpdateData.createProducts.selectedCategoryValues})
      setListProductsEnabled(false);
    }
  }, [isUpdateEnabled, newUpdateData, setIsUpdateEnabled])
  

  const getUpdateCollectionData = async (id) => {
    // id -> CollectionId
    // process -> deleteCollection

    try {
      setIsloading(true);
      const responseData = await postAPI("/createProduct/createProduct/createCollection",{data:id, processType:"getUpdateCollectionData"});
      if(!responseData || responseData.status !== "success"){
          throw new Error("Veri getirilemedi");  
      }

      // burada 2 veri gelmeli -> 1. collectionData zaten buraya düşüyor.
      // 2. collectionProductsData
      // 3. collectionImagesData

      setCollectionUpdateImageData(responseData.data.collectionImagesData);
      setCollectionUpdateProductData(responseData.data.collectionProductsData);

       setIsloading(false);
  
    } catch (error) {
      console.log(error.message);
        setIsloading(false);
    }
  }
  

  const getData = async (apiUrl) => {
    try {
      const response = await getAPI(apiUrl);
      if (response.status !== "success") {
        throw new Error("Veri çekilemedi 1");
      }
      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  useEffect(() => {
    setSelectedSubCategory("");
    
    if (!selectedCategory) {
      return;
    }
    
    // Burada seçilen Ana kategoriye göre alt kategorileri seçin
    setSelectedSubCategory(categoriesData[selectedCategory.key]);
  }, [selectedCategory]);

  useEffect(() => {
    
    const fetchData = async () => {
        setIsloading(true);
      if (!selectedSubCategory) {
        setIsloading(false);
        return;
      }

      // Burada seçilen alt kategorilere göre verileri çekin
      const dataKeys = Object.keys(selectedSubCategory);
      const fetchedData = {};
      for (const key of dataKeys) {
        const subCategoryData = selectedSubCategory[key];
        if (subCategoryData.apiGetRequest) {
          try {
            const result = await getData(subCategoryData.apiGetRequest);
            fetchedData[subCategoryData.label] = result; // Use the "label" property as the object title
          } catch (error) {
            console.log(error.message);
          }
        }
      }
      setIsloading(false);
      setData({[selectedCategory.key]: fetchedData });
    };

    fetchData();
  }, [selectedSubCategory, selectedCategory]);

  return (
    <>
      {isloading && <LoadingScreen isloading={isloading} />}

      <div className="p-0 lg:p-2 w-full flex flex-col xl:flex-row justify-center lg:justify-between items-center shadow-lg lg:px-10 bg-gray-100 gap-2">
        
        {
          // Filtreleme butonu
          listProductsEnabled &&
          <div className="flex justify-center item-center flex-col lg:flex-row gap-2">
            <div className={`${filterEnabled ? "bg-green-500" : "bg-green-500"} p-4 text-white rounded text-lg flex flex-row gap-2 flex-nowrap hover:cursor-pointer hover:scale-105 transition-all mt-2 lg:mt-0`}
              onClick={() => setFilterEnabled(!filterEnabled)}
            >
              <div className={`transition-all flex justify-center items-center gap-2 w-full h-full`}>
                <BiFilterAlt size={25}/>
                {!filterEnabled && "Filtre"}
              </div>
            </div>
            {filterEnabled &&
            <div className="rounded text-white flex justify-center items-center flex-col lg:flex-row gap-2 ">
                  <div className="flex justify-center items-center flex-col">
                    <h3 className="text-black">Ürün Kodu</h3>
                    <div className="border-2 border-gray-400 rounded-md">
                      <input type="text" 
                      className=" outline-none border-none text-lg text-black bg-white p-2 rounded max-w-[200px]"
                      onChange={(e) => setFilterProductCode(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-center items-center flex-col">
                    <h3 className="text-black">Ürün Adı</h3>
                    <div className="border-2 border-gray-400 rounded-md">
                      <input type="text" 
                      className=" outline-none border-none text-lg text-black bg-white p-2 rounded max-w-[200px]"
                      onChange={(e) => setFilterProductName(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-center items-center flex-col">
                    <h3 className="text-black">Ürün Tipi</h3>
                    <div className="border-2 border-gray-400 rounded-md">
                      <input type="text" 
                      className=" outline-none border-none text-lg text-black bg-white p-2 rounded max-w-[200px]"
                      onChange={(e) => setFilterProductType(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-center items-center flex-col">
                    <h3 className="text-black">Ürün Kategorisi</h3>
                    <div className="border-2 border-gray-400 rounded-md">
                      <input type="text" 
                      className=" outline-none border-none text-lg text-black bg-white p-2 rounded max-w-[200px]"
                      onChange={(e) => setFilterProductCategory(e.target.value)}
                      />
                    </div>
                  </div>
                
            </div>
            }
          </div>
        }



        {/*koleksiyon paneli - listesi - oluşturması işlemleri buradan yapılıyor. */}
        <div className="flex flex-col lg:flex-row flex-wrap justify-center items-center lg:gap-2">
              {listProductsEnabled && !collectionModeEnabled ?
              <div className="flex flex-col lg:flex-row flex-wrap gap-2 lg:gap-4 justify-center items-center">
                <div 
                onClick={() => {
                  setCollectionListEnabled(true)
                  setListProductsEnabled(false)
                }}
                className={`bg-blue-500 text-white text-lg hover:cursor-pointer hover:scale-105 transition-all rounded p-4 flex flex-row gap-2 flex-nowrap justify-center items-center`}>
                  <RxListBullet size={25}/>  Koleksiyonları Listele <RxTriangleRight size={25} className="rotate-90"/>
                </div> 

                <div 
                onClick={() => {
                  setCollectionModeEnabled(true)
                }}
                className={`bg-green-500 text-white text-lg hover:cursor-pointer hover:scale-105 transition-all rounded p-4 flex flex-row gap-2 flex-nowrap justify-center items-center`}>
                  <RxPlusCircled size={25}/>  Koleksiyon Oluştur <RxTriangleRight size={25} className="rotate-90"/>
                </div>
              </div> : 
                <div className="bg-red-600 rounded text-white p-4 flex flex-row gap-2 flex-nowrap justify-center items-center hover:cursor-pointer hover:scale-105 transition-all"
                onClick={() => {
                  setChooseProducts([]);
                  setCollectionModeEnabled(false);
                  setCollectionListEnabled(false);
                  setListProductsEnabled(true);
                  setCollectionUpdateEnabled(false);
                  setCollectionUpdateData({});

                }}
                >
                <IoClose size={25}/>  İptal Et
              </div>
              }
           
  
            {
              // Collection listeleme aktif olduğunda diğer butonları gizle
              !collectionListEnabled && 

              // ürün oluşturma sayfasına gider (button)
              <button onClick={() => {
                setListProductsEnabled(!listProductsEnabled)
                setIsUpdateEnabled(false);
                setCollectionModeEnabled(false);
                setCollectionListEnabled(false);
                setNewUpdateData({});
              }}
              className={`p-2 rounded m-2 text-white text-lg hover:cursor-pointer hover:scale-105 transition-all
                ${listProductsEnabled ? "bg-green-500" : "bg-blue-500"}
              `}
              >

                {listProductsEnabled ? 
                  <div className="p-2 flex flex-row gap-2 flex-nowrap justify-center items-center">
                    <RxPlusCircled size={25}/>  Ürün Oluşturma Sayfasına Git <RxTriangleRight size={25}/>
                  </div> :
                  
                  <div className="p-2 flex flex-row gap-2 flex-nowrap justify-center items-center">
                  <RxListBullet size={25}/>  Ürün Listeleme Sayfasına Git <RxTriangleRight size={25}/>
                </div>
                }
              </button>
            }
          </div>
        </div>


        {
        listProductsEnabled ? 
        <div>
          <ListFeatureTable 
            categoriesData={categoriesData} 
            filterProductCode={filterProductCode} 
            filterProductName={filterProductName} 
            filterProductType={filterProductType} 
            filterProductCategory={filterProductCategory} 
            filterEnabled={filterEnabled} 
            setIsUpdateEnabled={setIsUpdateEnabled} 
            isUpdateEnabled={isUpdateEnabled}  
            setNewUpdateData={setNewUpdateData} 
            newUpdateData={newUpdateData} 
            collectionModeEnabled={collectionModeEnabled} 
            setCollectionModeEnabled={setCollectionModeEnabled}
            chooseProducts={chooseProducts}
            setChooseProducts={setChooseProducts} 
            collectionAllData = {collectionAllData}
            setCollectionAllData = {setCollectionAllData}
            collectionTypes = {collectionTypes}
            setCollectionTypes = {setCollectionTypes}

            setCollectionUpdateEnabled={setCollectionUpdateEnabled}
            setCollectionUpdateData={setCollectionUpdateData}
            setCollectionListEnabled={setCollectionListEnabled}
            setListProductsEnabled={setListProductsEnabled}
            setCollectionUpdateImageData={setCollectionUpdateImageData}
            setCollectionUpdateProductData={setCollectionUpdateProductData} 
            
            collectionUpdateEnabled = {collectionUpdateEnabled}
            collectionUpdateProductData={collectionUpdateProductData}
            collectionUpdateImageData={collectionUpdateImageData}
            collectionUpdateData={collectionUpdateData}
            
            
            
            />
            



        </div>

        : 

        collectionListEnabled ?
        <ListCollection setCollectionUpdateEnabled={setCollectionUpdateEnabled} setCollectionUpdateData={setCollectionUpdateData} setCollectionModeEnabled={setCollectionModeEnabled} setCollectionListEnabled={setCollectionListEnabled} setListProductsEnabled={setListProductsEnabled}/>


        :

        <div>
          {
            !isUpdateEnabled &&
            <DropDownCatagories
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          }
          

          {selectedCategory && selectedSubCategory && Object.keys(data).length > 0 && (
            <div className={`${isUpdateEnabled && "border-4 border-purple-600 lg:rounded"} mt-2`}>
              {isUpdateEnabled &&
              <div className="flex flex-col justify-center items-center bg-purple-400 w-full p-2">
                <div className=" flex justify-center items-center gap-4 w-full p-2">
                  <h3 className="text-white font-bold lg:text-xl text-lg">GÜNCELLEME MODU</h3>
                  <button
                  type="button"
                  className="bg-white text-purple-600 font-bold p-2 rounded hover:scale-110 transition-all"
                  onClick={() => {
                    setIsUpdateEnabled(false);
                    setNewUpdateData({});
                    setListProductsEnabled(true);
                  }}
                  >
                    İptal Et
                  </button>
                </div>

                <div className="p-2">
                  <p className="text-white text-center">ürününüzün son halini aşağıdan kontrol edebilir ve güncelelyebilirsiniz.</p>
                </div>
              </div>
              }
              {
                isUpdateEnabled && newUpdateData ? 
                <DynamicTable data={data} selectedCategoryKey={selectedCategory.key} selectedCategoryValues={selectedCategory.value} newUpdateData={newUpdateData} setIsUpdateEnabled={setIsUpdateEnabled}/>
                : 
                <DynamicTable data={data} selectedCategoryKey={selectedCategory.key} selectedCategoryValues={selectedCategory.value} />

              }
              </div>
          )}
        </div>
      }
        
    </>
  );
};

export default CreateProductComponent;
