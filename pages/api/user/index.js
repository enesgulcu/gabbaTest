import { getDataByUnique } from '@/services/serviceOperations';

const handler = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const { personelId, customerId } = req.query;

      if (personelId) {
        const response = await getDataByUnique('User', {
          id: personelId,
        });

        return res.status(200).json({
          status: 'success',
          personel: response,
        });
      }
      if (customerId) {
        const response = await getDataByUnique('User', {
          id: customerId,
        });

        return res.status(200).json({
          status: 'success',
          customer: response,
        });
      }
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: 'error', error, message: error.message });
  }
};
export default handler;
