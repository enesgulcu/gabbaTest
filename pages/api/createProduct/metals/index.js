import {
  createNewData,
  getAllData,
  createNewDataMany,
  deleteDataByAny,
  updateDataByAny,
  getDataByUnique,
} from '@/services/serviceOperations';

// const removeImageFromMetalData = (data) => {
//   const newData = { ...data }; // Gelen veriyi kopyalayarak yeni bir nesne oluşturuyoruz

//   // Eğer "metals" dizisi varsa ve içinde en az bir öğe varsa devam ediyoruz
//   if (newData.metals && newData.metals.length > 0) {
//     newData.metals.forEach((metal) => {
//       delete metal.image; // "image" alanını her bir Metal öğesinden kaldırıyoruz
//     });
//   }

//   return newData; // "image" alanı kaldırılmış yeni veriyi döndürüyoruz
// };

// girilen verileri göndermeden önce kontrol ederiz.
const checkData = async (metals) => {
  // firstValue değeri olmayan değerleri sildik.
  const newMetals = await metals.filter((item) => item.metalType);

  // Number gelen değerleri stringe çeviriyoruz.
  newMetals.forEach((newMetal, index, arr) => {
    arr[index]['metalType'] = newMetal.metalType.toString();
    arr[index]['metalDescription'] = newMetal.metalDescription.toString();
  });

  if (newMetals.length > 0) {
    return newMetals;
  } else {
    return false;
  }
};

const handler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { metals, data, processType } = req.body;

      //silme işlemi için gelen veriyi sileriz.
      if (!metals && processType == 'delete') {
        const deleteData = await deleteDataByAny('metals', { id: data.id });
        if (!deleteData || deleteData.error) {
          throw deleteData;
        }
        return res.status(200).json({
          status: 'success',
          data: deleteData,
          message: deleteData.message,
        });
      } else if (!metals && processType == 'update') {
        // veri doğruluğunu test ediyoruz
        const checkedData = await checkData(data.metals);

        if (!checkedData && checkedData.error) {
          throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KU2';
        }

        // id değerini silip yeni veriyi oluşturuyoruz.
        const NewDatawitoutId = checkedData.map((item) => {
          const { id, ...newData } = item;
          return newData;
        });

        // veriyi güncelliyoruz.
        const updateData = await updateDataByAny(
          'metals',
          { id: checkedData[0].id },
          NewDatawitoutId[0]
        );

        if (!updateData || updateData.error) {
          throw updateData;
        }

        return res.status(200).json({
          status: 'success',
          data: updateData,
          message: updateData.message,
        });
      } else {
        if (!metals) {
          throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY1';
        }

        // gelen verinin doğruluğunu kontrol ediyoruz.
        const checkedData = await checkData(metals);

        if (!checkedData) {
          throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY2';
        }

        const createdNewData = await createNewDataMany('metals', checkedData);

        if (!createdNewData || createdNewData.error) {
          throw createdNewData; //"Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KU3";
        }
        return res.status(200).json({
          status: 'success',
          data: checkedData,
          message: metals.message,
        });
      }
    }

    if (req.method === 'GET') {
      // ID göre veri çekme
      const { metalId } = req.query;
      if (metalId) {
        const response = await getDataByUnique('metals', {
          id: metalId,
        });
        return res.status(200).json({ status: 'success', data: response });
      }
      const metals = await getAllData('metals');
      if (!metals || metals.error) {
        throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY4';
      }
      return res
        .status(200)
        .json({ status: 'success', data: metals, message: metals.message });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: 'error', error, message: error.message });
  }
};

export default handler;
