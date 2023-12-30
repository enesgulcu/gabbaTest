import {
  getAllData,
  findFirstFinancialManagement,
  createNewDataMany,
  createNewData,
  deleteDataByAny,
  deleteDataByMany,
  updateDataByAny,
  findAndUpdateManyFinancialManagement,
  findAndUpdateAndDecreaseManyFinancialManagement,
  updateOrderValueWhenChange,
} from '@/services/serviceOperations';

const handler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      // Özel işlemlerde verinin var olup olmadığını kontrol ediyoruz.

      const { data, processType, id } = req.body;

      // 1. SİLME İŞLEMİ
      if (data && processType == 'delete') {
        // Veri silindikten sonra, order değerlerinin hepsini azaltıyoruz.
        const decreaseData =
          await findAndUpdateAndDecreaseManyFinancialManagement(
            'financialManagement',
            data.orderValue
          );
        // Silmek istenen veriyi kullanıcıdan id değerini alarak tablodan siliyoruz.
        const deleteData = await deleteDataByAny('financialManagement', {
          id: data.id,
        });

        // Kontrol
        if (!deleteData || deleteData.error) {
          throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR07KY1';
        }

        // Burada ise yukarıdaki işlemin sahip olduğu tüm "Özel İşlemler" verileri siliniyor.
        const deleteSpecialData = await deleteDataByMany(
          'financialManagementSpecial',
          {
            financialManagementId: data.id,
          }
        );

        // Kontrol
        if (!deleteSpecialData || deleteSpecialData.error) {
          throw deleteSpecialData;
        }

        return res.status(200).json({
          status: 'success',
          message: 'İşlem başarılı',
        });
      }

      data.financialManagementSpecial = data.financialManagementSpecial.filter(
        (item) => {
          return !(
            item.mathOperatorSpecial === '' ||
            (item.conditionValueSpecial === 'Özel Barem Ekle' &&
              item.ozelBaremValue === 0)
          );
        }
      );

      if (data.financialManagementSpecial.length === 0) {
        delete data.financialManagementSpecial;
      }

      const financialManagementSpecial = data.financialManagementSpecial;

      // 2. GÜNCELLEME İŞLEMİ
      if (data && processType == 'update') {
        data.conditionValue = data.conditionValue.toString();
        data.conditionValue2 = data.conditionValue2.toString();
        data.finalPrice = data.finalPrice.toString();
        data.orderValue = parseInt(data.orderValue);

        // Eğer işlem sırası değişsin diyorsa, burası çalışır
        if (data.orderCondition) {
          // Gelen veriyi al ve işleme sok. Bu değerden büyük olan her işlem sırasının değerini 1 arttır.
          const updatedData = await updateOrderValueWhenChange(
            'financialManagement',
            data
          );

          if (updatedData.error) {
            throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR07KU1';
          }
        }

        delete data.orderCondition;
        delete data.financialManagementSpecial;
        delete data.oldOrderValue;
        // Gelen verileri güncelliyoruz.
        const updateData = await updateDataByAny(
          'financialManagement',
          {
            id: id,
          },
          data
        );

        if (!updateData || updateData.error) {
          throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR07KU3';
        }

        // Var olan özel işlemleri silip, yenilerini ekliyoruz.
        const deleteSpecialData = await deleteDataByMany(
          'financialManagementSpecial',
          {
            financialManagementId: updateData.id,
          }
        );

        if (!deleteSpecialData || deleteSpecialData.error) {
          throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR07KU4';
        }

        if (financialManagementSpecial) {
          financialManagementSpecial.forEach((item) => {
            item.financialManagementId = updateData.id;
          });

          const createdData = await createNewDataMany(
            'financialManagementSpecial',
            financialManagementSpecial
          );

          if (!createdData || createdData.error) {
            throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR07KU5';
          }

          return res.status(200).json({
            status: 'success',
            data: createdData,
            message: 'İşlem başarılı',
          });
        }

        return res.status(200).json({
          status: 'success',
          data: updateData,
          message: 'İşlem başarılı',
        });
      }

      if (!data) {
        throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY1';
      }

      // 3. EKLEME İŞLEMİ
      // Eğer kullanıcı herhangi bir sıralama değeri yazarsa, aşağıdaki işlemler yapılacak
      if (data.orderCondition) {
        data.conditionValue = data.conditionValue.toString();
        data.conditionValue2 = data.conditionValue2.toString();
        data.finalPrice = data.finalPrice.toString();
        data.orderValue = parseInt(data.orderValue);

        const updatedData = await findAndUpdateManyFinancialManagement(
          'financialManagement',
          data.orderValue
        );

        if (!updatedData || updatedData.error) {
          throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KU3';
        }

        delete data.orderCondition;
        delete data.financialManagementSpecial;

        const createdNewData = await createNewData('financialManagement', data);

        if (!createdNewData || createdNewData.error) {
          throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KU4';
        }

        if (financialManagementSpecial) {
          financialManagementSpecial.forEach((item) => {
            item.financialManagementId = createdNewData.id;
          });

          const createdData = await createNewDataMany(
            'financialManagementSpecial',
            financialManagementSpecial
          );

          return res.status(200).json({
            status: 'success',
            data: createdData,
            message: 'İşlem başarılı',
          });
        }

        return res.status(200).json({
          status: 'success',
          data: createdNewData,
          message: 'İşlem başarılı',
        });
      } else {
        // Eğer kullanıcı herhangi bir sıralama değeri yazmaz ise, aşağıdaki işlemler yapılacak
        delete data.orderCondition; // Eğer kullanıcı herhangi bir işlem sırası belirlemediyse bunu objeden sil

        // Integer değerleri string'e çevriliyor.
        data.conditionValue = data.conditionValue.toString();
        data.conditionValue2 = data.conditionValue2.toString();
        data.finalPrice = data.finalPrice.toString();

        // Veritabanında işlem sırası en yüksek olan veri bulunuyor.
        const maxOperationOrder = await findFirstFinancialManagement(
          'financialManagement'
        );

        // Ve burada işlem sırasını eklemiş oluyoruz. Otomatik artan bir değer.
        data.orderValue = maxOperationOrder;
        delete data.financialManagementSpecial;

        //Finansal Yönetim işlerini ekliyoruz.
        const createdNewData = await createNewData('financialManagement', data);
        if (!createdNewData || createdNewData.error) {
          throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KU5';
        }

        if (financialManagementSpecial) {
          financialManagementSpecial.forEach((item) => {
            item.conditionValueSpecial = item.conditionValueSpecial.toString();
            item.financialManagementId = createdNewData.id;
          });

          const createdData = await createNewDataMany(
            'financialManagementSpecial',
            financialManagementSpecial
          );

          if (!createdData || createdData.error) {
            throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KU6';
          }

          return res.status(200).json({
            status: 'success',
            data: createdData,
            message: 'İşlem başarılı',
          });
        }

        return res.status(200).json({
          status: 'success',
          data: createdNewData,
          message: 'İşlem başarılı',
        });
      }
    }
    if (req.method === 'GET') {
      const financialManagement = await getAllData('financialManagement');

      if (!financialManagement || financialManagement.error) {
        throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY4';
      }
      return res.status(200).json({
        status: 'success',
        data: financialManagement,
        message: financialManagement.message,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: 'error', error, message: error.message });
  }
};

export default handler;
