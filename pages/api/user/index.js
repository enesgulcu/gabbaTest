import prisma from '@/lib/prisma';
import { getDataByUnique } from '@/services/serviceOperations';

const handler = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const { id } = req.query;

      const data = await prisma.user.findUnique({
        where: {
          id: id
        }
      });;

      return res.status(200).json({
        status: 'success',
        data: data,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: 'error', error, message: error.message });
  }
};
export default handler;
