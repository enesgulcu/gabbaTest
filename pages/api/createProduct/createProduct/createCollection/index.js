import {createNewDataMany, createNewData, getAllData, getDataByUniqueMany, deleteDataByMany, getDataByUnique} from "@/services/serviceOperations";


const handler = async (req, res) => {

  // extra ve image verileri içi boş olanları temizlenecek.
  const checkData = async (data) => {
    try {    
      const processType = await data.processType;
      const collectionUpdateId = await data.collectionUpdateId;
      const collectionUpdateCode = await data.collectionUpdateCode;
      const collectionProductsData = await data.collectionProducts;
      const collectionImagesData = await data.collectionImages;

      // collectionProducts ve collectionImages verilerini data içerisinden sil.
      delete data.processType;
      delete data.collectionUpdateId;
      delete data.collectionUpdateCode;
      delete data.collectionProducts;
      delete data.collectionImages;
      
      const collectionsData = await data;

      if(!collectionsData.collectionName || !collectionsData.collectionType){
        throw new Error("Koleksiyon adı ve tipi boş bırakılamaz.");
      }

      if(!collectionProductsData || collectionProductsData.length < 1){
        throw new Error("Koleksiyonda en az 1 ürün olmazı gerekmektedir.");
      }
    
    // koleksiyon kodunun oluştuğu bölüm.
    if(processType === "create"){
    // her ürün için uniq olarak bir ürün kodu oluşturuyoruz #########################
    //################################################################################

    // gün - ay - yıl - saat olarak türkiye zamanını al ve her bir veriyi ayrı değişkenlere string olarak kaydet. yılın sadece son 2 rakamını al.
    const date = new Date().toLocaleString("tr-TR", {timeZone: "Europe/Istanbul"});
    const day = date.split(" ")[0].split(".")[0];
    const month = date.split(" ")[0].split(".")[1];
    const year = date.split(" ")[0].split(".")[2].slice(2,4);
    const hour = date.split(" ")[1].split(":")[0];
    const minute = date.split(" ")[1].split(":")[1];

    // collectionName değerinin ilk 2 ve son 2 harfini alarak ürün kodunu oluştur
    let collectionName;
    if(data.collectionName){
      collectionName = data.collectionName.slice(0,3).toUpperCase();
    }
    else{
      collectionName = "Name";
    }
    
    let collectionType;
    if(data.collectionType){
      collectionType = data.collectionType.slice(0,3).toUpperCase();
    }   
    else{
      collectionType = "Type";
    } 

        // resgele alfabeden iki büyük harf üret
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const randomAlphabet2 = alphabet[Math.floor(Math.random() * 26)] + alphabet[Math.floor(Math.random() * 26)];

    // rasgele 3 tane tam sayı rakam oluştur sonra bunları string olarak yan yana yaz.
    const randomAlphabet = Math.floor(Math.random() * 10) + "" + Math.floor(Math.random() * 10) + "" + "" + randomAlphabet2;


    // ürün kodunu oluştur
      const collectionCode = (year + collectionName + month + collectionType + day + randomAlphabet).trim();
      
      // collectionsData içerisine oluşturulan collectionCode değerini ekle
      collectionsData.collectionCode = collectionCode;
    }

    if(processType === "update"){
      // collectionsData içerisine varolan collectionCode değerini ekle
      collectionsData.collectionCode = collectionUpdateCode;
    }

      return { collectionsData, collectionProductsData, collectionImagesData, collectionUpdateId, processType };


    } catch (error) {
      return { error: true, message: error.message };
    }
  }

  try {
    if (req.method === "POST"){

      const data = await req.body;      

      if(data.processType == "create" || data.processType == "update"){
        
        const result = await checkData(data);

        if (result.error || !result) {
          throw new Error(result.message);
        }

        if(result.processType === "update"){
          
          // SİLME İŞLEMİ -- ilk olarak var olan veriler result.collectionUpdateId ile eşleşenler silinecek.
          const deleteCollection = await deleteDataByMany("Collections", {id: result.collectionUpdateId});
          if(deleteCollection.error || !deleteCollection){
            throw new Error(deleteCollection.message);
          }

          // SİLME İŞLEMİ
          const deleteCollectionProducts = await deleteDataByMany("CollectionProducts", {collectionId: result.collectionUpdateId});
          if(deleteCollectionProducts.error || !deleteCollectionProducts){
            throw new Error(deleteCollectionProducts.message);
          }

          // SİLME İŞLEMİ -- resim var mı veri tabanını sorgula. varsa eğer eşleşen id değerindeki tüm resimleri sil.
          const deleteCollectionImages = await deleteDataByMany("CollectionImages", {collectionId: result.collectionUpdateId});
          if(deleteCollectionImages.error){
            throw new Error(deleteCollectionImages.message);
          }

          // Silme işlemi tamamlandı. Yeni verileri kaydetmeye geç. ---->>>>>

        }
//____________________________________________________________________________________________________________________
//collectionsData ####################################################################################################
        // Koleksiyon oluşturuldu veri tabanına kaydedildi
        const collectionsData = await createNewData("Collections", result.collectionsData);
        if (collectionsData.error || !collectionsData) {
          throw new Error(collectionsData.message);
        }


//ProductsData #############################################################################################
        if(result.collectionProductsData){
          
            // collectionsData.id değerini collectionProductsData içerisine collectionId olarak ekle.
            await result.collectionProductsData.map((item) => {
              item.collectionId = collectionsData.id;
          });
        
          // Koleksiyonun sahip olduğu ürünler oluşturuldu veri tabanına kaydedildi
          const collectionProductsData = await createNewDataMany("CollectionProducts", result.collectionProductsData);

          if (collectionProductsData.error || !collectionProductsData) {
            throw new Error(collectionProductsData.message);
          }
        }


//ImagesData ###############################################################################################
        let collectionImagesData;
        if(result.collectionImagesData && result.collectionImagesData.length > 0){ 

          //collectionsData.id değerini collectionImagesData içerisine collectionId olarak ekle.
          await result.collectionImagesData.map((item) => {
            item.collectionId = collectionsData.id;
          });

          // Koleksiyonun sahip olduğu resimler oluşturuldu veri tabanına kaydedildi
          collectionImagesData = await createNewDataMany("CollectionImages", result.collectionImagesData);


          if (collectionImagesData.error || !collectionImagesData) {
            throw new Error(collectionImagesData.message);
          }
        }
//____________________________________________________________________________________________________________________
      
        return res.status(200).json({ error: false, status:"success", message: "Koleksiyon başarıyla oluşturuldu."});
      }


// ### DELETE ############################################################################################################
      else if(data.processType === "delete"){
        
        // deleteDataByAny(tableName, where)
        const deleteCollection = await deleteDataByMany("Collections", {id: data.data});
        
        if(deleteCollection.error || !deleteCollection){
          throw new Error(deleteCollection.message);
        }

        const deleteCollectionProducts = await deleteDataByMany("CollectionProducts", {collectionId: data.data});
        if(deleteCollectionProducts.error || !deleteCollectionProducts){
          throw new Error(deleteCollectionProducts.message);
        }

        // resim var mı veri tabanını sorgula. varsa eğer eşleşen id değerindeki tüm resimleri sil.
        const deleteCollectionImages = await deleteDataByMany("CollectionImages", {collectionId: data.data});
          if(deleteCollectionImages.error){
            throw new Error(deleteCollectionImages.message);
          }

        return res.status(200).json({ error: false, status:"success", message: "Koleksiyon başarıyla silindi."});       
        
      }

      else if(data.processType === "getUpdateCollectionData"){

          const collectionImagesData = await getDataByUniqueMany("CollectionImages", {collectionId: data.data});
          if(collectionImagesData.error || !collectionImagesData){
            throw new Error(collectionImagesData.message);
          }

          const collectionProductsData = await getDataByUniqueMany("CollectionProducts", {collectionId: data.data});
          if(collectionProductsData.error || !collectionProductsData){
            throw new Error(collectionProductsData.message);
          }

          return res.status(200).json({ error: false, status:"success", message: "Koleksiyon başarıyla getirildi.", data: {collectionImagesData, collectionProductsData}});
      }

    }

    if (req.method === "GET"){
      const collectionsData = await getAllData("Collections");

      if (collectionsData.error || !collectionsData) {
        throw new Error(collectionsData.message);
      }

      const collectionProductsData = await getAllData("CollectionProducts");
      
      if (collectionProductsData.error || !collectionProductsData) {
        throw new Error(collectionProductsData.message);
      }

      const collectionImagesData = await getAllData("CollectionImages");

      // collectionsData içerisine collectionProducts ve collectionImages objelerini direkt ekle
      const collection = {
        
          collectionsData: collectionsData,
          collectionProductsData: collectionProductsData,
          collectionImagesData: collectionImagesData
        
      }

      return res.status(200).json({ error: false, status:"success", message: "Koleksiyon başarıyla getirildi.", data: collection});

    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: true, message: error.message });
  }


};

export default handler;
