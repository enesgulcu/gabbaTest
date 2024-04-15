import {
  getAllData,
  getDataByUnique,
  createNewData,
} from '@/services/serviceOperations';

const handler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const data = req.body;

      //! DATA İÇERİSİNDE VERİLER GELİYOR MU KONTROL EDİLECEK.

      // email adresi veritabanında kayıtlı mı kontrol ediyoruz.
      const findMailAddress = await getDataByUnique('Customer', {
        mailAddress: data.mailAddress,
      });
      // Telefon Numarası veritabanında kayıtlı mı kontrol ediyoruz.
      const findPhoneNumber = await getDataByUnique('Customer', {
        phoneNumber: data.phoneNumber,
      });

      // Eğer veri tabanında daha önce kayıtlı değilse, kayıt ekliyoruz.
      if (findMailAddress == null && findPhoneNumber == null) {
        // Müşteri bilgisini veritabanına kaydediyoruz.
        const customerData = await createNewData('Customer', data);
        if (customerData) {
          return res.status(200).json({
            status: 'success',
            message: 'Müşterinin bilgileri başarılı bir şekilde kaydedildi!',
          });
        } else {
          throw new Error('Müşterinin bilgileri kayıt edilirken hata oluştu!');
        }
      } else {
        throw new Error(
          'Bu müşterinin bilgileri daha önce zaten kayıt edildi.'
        );
      }
    }
    if (req.method === 'GET') {
      const customerData = await getAllData('Customer');
      if (!customerData || customerData.error) {
        throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY4';
      }
      return res.status(200).json({
        status: 'success',
        data: customerData,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: 'error', error, message: error.message });
  }
};

export default handler;
