import {
  getAllData,
  findFirstFinancialManagement,
  createNewDataMany,
  createNewData,
  deleteDataByAny,
  findAndUpdateManyFinancialManagement,
} from '@/services/serviceOperations';

const handler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { data, processType } = req.body;
      if (data && processType == 'delete') {
        const deleteData = await deleteDataByAny('financialManagement', {
          id: data,
        });
        if (!deleteData || deleteData.error) {
          throw deleteData;
        }
        return res.status(200).json({
          status: 'success',
          data: deleteData,
          message: deleteData.message,
        });
      }

      if (!data) {
        throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY1';
      }

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
        console.log(createdNewData);

        if (!createdNewData || createdNewData.error) {
          throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KU4';
        }
        console.log(updatedData);
        return res.status(200).json({
          status: 'success',
          data: createdNewData,
          message: 'İşlem başarılı',
        });
      } else {
        // Eğer kullanıcı herhangi bir sıralama değeri yazmaz ise, aşağıdaki işlemler yapılacak
        const financialManagementSpecial = data.financialManagementSpecial;
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

        // Finansal Yönetim işleri eklerken, özel değerleri objeden siliyoruz.
        // Çünkü prismada bu değerler yok ve hata alacak
        delete data.financialManagementSpecial;

        // Finansal Yönetim işlerini ekliyoruz.
        const createdNewData = await createNewData('financialManagement', data);
        if (!createdNewData || createdNewData.error) {
          throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KU5';
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
