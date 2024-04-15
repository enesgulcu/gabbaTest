import { getAPI } from '@/services/fetchAPI';
import {
  createNewData,
  createNewDataMany,
  getAllData,
  updateDataByAny,
  deleteDataByAny,
  deleteDataByMany,
  updateDataByMany,
} from '@/services/serviceOperations';

const handler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { data, processType, id, stock } = req.body;

      if (processType === 'delete') {
        const deletedData = await deleteDataByAny('Stock', { id: id });
        if (!deletedData || deletedData.error) {
          throw deletedData.error;
        }

        const deleteColor = deleteDataByMany('StockColors', {
          stockId: id,
        });

        const deleteExtra = deleteDataByMany('StockExtra', {
          stockId: id,
        });

        const deleteFabrics = deleteDataByMany('StockFabrics', {
          stockId: id,
        });

        const deleteMeasurements = deleteDataByMany('StockMeasurements', {
          stockId: id,
        });

        const deleteMetals = deleteDataByMany('StockMetals', {
          stockId: id,
        });

        const [
          resultDeleteColor,
          resultDeleteExtra,
          resultDeleteFabrics,
          resultDeleteMeasurements,
          resultDeleteMetals,
        ] = await Promise.all([
          deleteColor,
          deleteExtra,
          deleteFabrics,
          deleteMeasurements,
          deleteMetals,
        ]);

        return res.status(200).json({
          status: 'success',
          message: 'Ürün stoktan başarılı bir şekilde kaldırıldı.',
        });
      }

      const stockData = {
        stock: data.stock,
        storeId: data.storeId,
        orderNote: data.orderNote,
        productPrice: data.selectedOfferProductPrice,
        productFeaturePrice: data.selectedOfferProductFeaturePrice,
      };

      const updatedData = await updateDataByMany(
        'Stock',
        { id: data.stockId },
        stockData
      );

      // Daha önce eklenmiş verileri siliyoruz.

      const deleteColor = deleteDataByMany('StockColors', {
        stockId: {
          equals: data.stockId,
        },
      });

      const deleteExtra = deleteDataByMany('StockExtra', {
        stockId: {
          equals: data.stockId,
        },
      });

      const deleteFabrics = deleteDataByMany('StockFabrics', {
        stockId: {
          equals: data.stockId,
        },
      });

      const deleteMeasurements = deleteDataByMany('StockMeasurements', {
        stockId: {
          equals: data.stockId,
        },
      });

      const deleteMetals = deleteDataByMany('StockMetals', {
        stockId: {
          equals: data.stockId,
        },
      });

      const [
        resultDeleteColor,
        resultDeleteExtra,
        resultDeleteFabrics,
        resultDeleteMeasurements,
        resultDeleteMetals,
      ] = await Promise.all([
        deleteColor,
        deleteExtra,
        deleteFabrics,
        deleteMeasurements,
        deleteMetals,
      ]);

      // Seçilen ek özellikleri veri tabanına ekliyoruz.
      // Renkler, Kumaşlar, Metaller...
      if (
        data.selectedOfferFeatures &&
        data.selectedOfferFeatures.Renkler &&
        Object.keys(data.selectedOfferFeatures.Renkler).length > 0
      ) {
        const renklerArray = Object.values(data.selectedOfferFeatures.Renkler);

        const renklerToSend = renklerArray.map((item) => {
          return {
            colourId: item.id,
            productId: data.selectedOfferProduct,
            stockId: data.stockId,
          };
        });

        const responseCreateStockColor = await createNewDataMany(
          'StockColors',
          renklerToSend
        );

        if (!responseCreateStockColor || responseCreateStockColor.error) {
          throw responseCreateStockColor.error;
        }
      }

      if (
        data.selectedOfferFeatures &&
        data.selectedOfferFeatures.Kumaşlar &&
        Object.keys(data.selectedOfferFeatures.Kumaşlar).length > 0
      ) {
        const fabricsArray = Object.values(data.selectedOfferFeatures.Kumaşlar);

        const fabricsToSend = fabricsArray.map((item) => {
          return {
            fabricsId: item.id,
            productId: data.selectedOfferProduct,
            stockId: data.stockId,
          };
        });

        const responseCreateStockFabric = await createNewDataMany(
          'StockFabrics',
          fabricsToSend
        );

        if (!responseCreateStockFabric || responseCreateStockFabric.error) {
          throw responseCreateStockFabric.error;
        }
      }

      if (
        data.selectedOfferFeatures &&
        data.selectedOfferFeatures.Ölçüler &&
        Object.keys(data.selectedOfferFeatures.Ölçüler).length > 0
      ) {
        const measurementArray = Object.values(
          data.selectedOfferFeatures.Ölçüler
        );

        const measurementToSend = measurementArray.map((item) => {
          return {
            measurementId: item.id,
            productId: data.selectedOfferProduct,
            stockId: data.stockId,
          };
        });

        const responseCreateStockMeasurement = await createNewDataMany(
          'StockMeasurements',
          measurementToSend
        );

        if (
          !responseCreateStockMeasurement ||
          responseCreateStockMeasurement.error
        ) {
          throw responseCreateStockMeasurement.error;
        }
      }

      if (
        data.selectedOfferFeatures &&
        data.selectedOfferFeatures.Metaller &&
        Object.keys(data.selectedOfferFeatures.Metaller).length > 0
      ) {
        const metalArray = Object.values(data.selectedOfferFeatures.Metaller);

        const metalToSend = metalArray.map((item) => {
          return {
            metalId: item.id,
            productId: data.selectedOfferProduct,
            stockId: data.stockId,
          };
        });

        const responseCreateStockMetal = await createNewDataMany(
          'StockMetals',
          metalToSend
        );

        if (!responseCreateStockMetal || responseCreateStockMetal.error) {
          throw responseCreateStockMetal.error;
        }
      }

      if (
        data.selectedOfferFeatures &&
        data.selectedOfferFeatures.Extralar &&
        Object.keys(data.selectedOfferFeatures.Extralar).length > 0
      ) {
        const extraArray = Object.values(data.selectedOfferFeatures.Extralar);

        const extraToSend = extraArray.map((item) => {
          return {
            extraId: item.id,
            productId: data.selectedOfferProduct,
            stockId: data.stockId,
          };
        });

        const responseCreateStockExtra = await createNewDataMany(
          'StockExtra',
          extraToSend
        );

        if (!responseCreateStockExtra || responseCreateStockExtra.error) {
          throw responseCreateStockExtra.error;
        }
      }

      return res.status(200).json({
        status: 'success',
        message: 'Ürünler başarıyla güncellendi!',
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: 'error', error, message: error.message });
  }
};

export default handler;
