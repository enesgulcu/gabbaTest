import { getAllData } from '@/services/serviceOperations';
const handler = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const financialManagementSpecial = await getAllData(
        'financialManagementSpecial'
      );
      if (!financialManagementSpecial || financialManagementSpecial.error) {
        throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY4';
      }
      return res.status(200).json({
        status: 'success',
        data: financialManagementSpecial,
        message: financialManagementSpecial.message,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: 'error', error, message: error.message });
  }
};

export default handler;
