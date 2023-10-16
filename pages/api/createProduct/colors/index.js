import { createNewData, getAllData, createNewDataMany, deleteDataByAny, updateDataByAny } from "@/services/serviceOperations";

// const removeImageFromColourData = (data) => {
//   const newData = { ...data }; // Gelen veriyi kopyalayarak yeni bir nesne oluşturuyoruz

//   // Eğer "colors" dizisi varsa ve içinde en az bir öğe varsa devam ediyoruz
//   if (newData.colors && newData.colors.length > 0) {
//     newData.colors.forEach((colour) => {
//       delete colour.image; // "image" alanını her bir Colour öğesinden kaldırıyoruz
//     });
//   }

//   return newData; // "image" alanı kaldırılmış yeni veriyi döndürüyoruz
// };


// girilen verileri göndermeden önce kontrol ederiz.
const checkData = async (colors) => {
  
  // firstValue değeri olmayan değerleri sildik.
  const newColors = await colors.filter(item => item.colourType);
  
  //newColors içinden image ve ColourPickerEnabled key value değerlerini siliyoruz.
  newColors.forEach((newColour, index, arr) => {
    delete arr[index]['image'];
    //delete arr[index]['ColourPickerEnabled'];
  });


  // Number gelen değerleri stringe çeviriyoruz.
  newColors.forEach((newColour, index, arr) => {
    arr[index]['colourType'] = newColour.colourType.toString();
    arr[index]['colourDescription'] = newColour.colourDescription.toString();
  });
  
  if(newColors.length > 0){

    return newColors;
  }
  else{
    return false;
  }
};

const handler = async (req, res) => {
  
  try {
    if (req.method === "POST") {
      const {colors, data, processType} = req.body;

      //silme işlemi için gelen veriyi sileriz.
      if(!colors && processType == "delete"){
         
        const deleteData = await deleteDataByAny("colors", {id: data.id});
        if(!deleteData || deleteData.error){
          throw deleteData;
        }
        return res.status(200).json({ status: "success", data:deleteData, message: deleteData.message });
      }

      else if(!colors && processType == "update"){

        // veri doğruluğunu test ediyoruz
        const checkedData = await checkData(data.colors);
       

        if(!checkedData && checkedData.error){
          throw "Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KU2";
        }
        
        // id değerini silip yeni veriyi oluşturuyoruz.
        const NewDatawitoutId = checkedData.map(item => {
          const {id, ...newData} = item;
          return newData;
        });
        
        // veriyi güncelliyoruz.
        const updateData = await updateDataByAny("colors", {id: checkedData[0].id}, NewDatawitoutId[0]);

        if(!updateData || updateData.error){
          throw updateData;
        }
        
        return res.status(200).json({ status: "success", data:updateData, message: updateData.message });
      }

      else{
        if(!colors){
          throw "Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY1";
        } 
        
        // gelen verinin doğruluğunu kontrol ediyoruz.
        const checkedData = await checkData(colors);

        
        if(!checkedData){
          throw "Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY2";
        }
        
        const createdNewData = await createNewDataMany("colors", checkedData);

        if(!createdNewData || createdNewData.error){
          throw createdNewData; //"Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KU3";
        }
        return res.status(200).json({ status: "success", data:checkedData, message: colors.message });
      }      
    }


    if(req.method === "GET"){
      const colors = await getAllData("colors");
      if (!colors || colors.error) {
        throw "Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY4";
      }
      return res.status(200).json({ status: "success", data: colors, message: colors.message });
    }

  } catch (error) {
    return res.status(500).json({ status: "error", error, message: error.message  });
  }
};

export default handler;
