import { getAPI } from '@/services/fetchAPI';
import {
  createNewData,
  createNewDataMany,
  getAllData,
  updateDataByAny,
  deleteDataByAny,
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
        return res.status(200).json({
          status: 'success',
          message: 'Ürün stoktan başarılı bir şekilde kaldırıldı.',
        });
      }

      const stockData = {
        stock: data.stock,
        storeId: data.store,
        orderNote: data.orderNote,
        productId: data.selectedOfferProduct,
        productPrice: parseFloat(data.selectedOfferProductPrice),
        productFeaturePrice: parseFloat(data.selectedOfferProductFeaturePrice),
      };

      const responseCreateStock = await createNewData('Stock', stockData);

      if (!responseCreateStock || responseCreateStock.error) {
        throw responseCreateStock.error;
      }

      if (
        data.selectedOfferFeatures &&
        data.selectedOfferFeatures.Renkler &&
        data.selectedOfferFeatures.Renkler.length > 0
      ) {
        await data.selectedOfferFeatures.Renkler.map((item) => {
          item.colourId = item.id;
          item.productId = data.selectedOfferProduct;
          item.stockId = responseCreateStock.id;
          delete item.id;
        });

        const responseCreateStockColor = await createNewDataMany(
          'StockColors',
          data.selectedOfferFeatures.Renkler
        );

        if (!responseCreateStockColor || responseCreateStockColor.error) {
          throw responseCreateStockColor.error;
        }
      }

      if (
        data.selectedOfferFeatures &&
        data.selectedOfferFeatures.Kumaşlar &&
        data.selectedOfferFeatures.Kumaşlar.length > 0
      ) {
        data.selectedOfferFeatures.Kumaşlar.map((item) => {
          item.fabricsId = item.id;
          item.productId = data.selectedOfferProduct;
          item.stockId = responseCreateStock.id;
          delete item.id;
        });
        const responseCreateStockFabric = await createNewDataMany(
          'StockFabrics',
          data.selectedOfferFeatures.Kumaşlar
        );

        if (!responseCreateStockFabric || responseCreateStockFabric.error) {
          throw responseCreateStockFabric.error;
        }
      }

      if (
        data.selectedOfferFeatures &&
        data.selectedOfferFeatures.Ölçüler &&
        data.selectedOfferFeatures.Ölçüler.length > 0
      ) {
        data.selectedOfferFeatures.Ölçüler.map((item) => {
          item.measurementId = item.id;
          item.productId = data.selectedOfferProduct;
          item.stockId = responseCreateStock.id;
          delete item.id;
        });

        const responseCreateStockMeasurement = await createNewDataMany(
          'StockMeasurements',
          data.selectedOfferFeatures.Ölçüler
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
        data.selectedOfferFeatures.Metaller.length > 0
      ) {
        data.selectedOfferFeatures.Metaller.map((item) => {
          item.metalId = item.id;
          item.productId = data.selectedOfferProduct;
          item.stockId = responseCreateStock.id;
          delete item.id;
        });

        const responseCreateStockMetal = await createNewDataMany(
          'StockMetals',
          data.selectedOfferFeatures.Metaller
        );

        if (!responseCreateStockMetal || responseCreateStockMetal.error) {
          throw responseCreateStockMetal.error;
        }
      }

      if (
        data.selectedOfferFeatures &&
        data.selectedOfferFeatures.Extra &&
        data.selectedOfferFeatures.Extra.length > 0
      ) {
        data.selectedOfferFeatures.Extra.map((item) => {
          item.extraId = item.id;
          item.productId = data.selectedOfferProduct;
          item.stockId = responseCreateStock.id;
          delete item.id;
        });

        const responseCreateStockExtra = await createNewDataMany(
          'StockExtra',
          data.selectedOfferFeatures.Extra
        );

        if (!responseCreateStockExtra || responseCreateStockExtra.error) {
          throw responseCreateStockExtra.error;
        }
      }

      return res.status(200).json({
        status: 'success',
      });
    }

    if (req.method === 'GET') {
      const Stocks = await getAllData('Stock');
      const Stores = await getAllData('Store');
      const StockColors = await getAllData('StockColors');
      const StockFabrics = await getAllData('StockFabrics');
      const StockMeasurements = await getAllData('StockMeasurements');
      const StockMetals = await getAllData('StockMetals');
      const StockExtra = await getAllData('StockExtra');

      if (!Stocks || Stocks.error) {
        throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY4';
      }

      if (!StockColors || StockColors.error) {
        throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY5';
      }

      if (!StockFabrics || StockFabrics.error) {
        throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY6';
      }

      if (!StockMeasurements || StockMeasurements.error) {
        throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY7';
      }

      if (!StockMetals || StockMetals.error) {
        throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY8';
      }

      if (!StockExtra || StockExtra.error) {
        throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY9';
      }

      // Toplam verileri saklamak için bir dizi oluştur
      const combinedData = [];

      // Stocks içindeki her bir öğeyi kontrol et

      await Promise.all(
        Stocks.map(async (Stock) => {
          const StockId = Stock.id;

          const matchingStore = await Stores.filter(
            (store) => store.id === Stock.storeId
          );

          // StockColors içinde Stocks ID'sine göre eşleşen renkleri seçme
          const matchingColors = await StockColors.filter(
            (color) => color.stockId === StockId
          );

          // StockExtra içinde Stocks ID'sine göre eşleşen ekstraları seçme
          const matchingExtras = await StockExtra.filter(
            (extra) => extra.stockId === StockId
          );

          // StockFabrics içinde Stocks ID'sine göre eşleşen kumaşları seçme
          const matchingFabrics = await StockFabrics.filter(
            (fabric) => fabric.stockId === StockId
          );

          const matchingMeasurements = await StockMeasurements.filter(
            (measurement) => measurement.stockId === StockId
          );

          // StockMetals içinde Stocks ID'sine göre eşleşen metalleri seçme
          const matchingMetals = await StockMetals.filter(
            (metal) => metal.stockId === StockId
          );

          // Her bir renk için API çağrısını yaparak Renkler dizisine eklemek
          const dataColour = await Promise.all(
            matchingColors.map(async (color) => {
              const colourData = await getAPI(
                `/createProduct/colors?colourId=${color.colourId}`
              );
              return colourData.data;
            })
          );

          // Her bir ölçü için API çağrısını yaparak Ölçüler dizisine eklemek
          const dataMeasurement = await Promise.all(
            matchingMeasurements.map(async (measurement) => {
              const measurementData = await getAPI(
                `/createProduct/measurements?measurementId=${measurement.measurementId}`
              );
              return measurementData.data;
            })
          );

          // Her bir metaller için API çağrısını yaparak Metaller dizisine eklemek
          const dataMetal = await Promise.all(
            matchingMetals.map(async (metal) => {
              const metalData = await getAPI(
                `/createProduct/metals?metalId=${metal.metalId}`
              );
              return metalData.data;
            })
          );

          // Her bir kumaş için API çağrısını yaparak Kumaşlar dizisine eklemek
          const dataFabric = await Promise.all(
            matchingFabrics.map(async (fabric) => {
              const fabricData = await getAPI(
                `/createProduct/fabrics?fabricsId=${fabric.fabricsId}`
              );
              return fabricData.data;
            })
          );

          // Ürün ID'sine göre API çağrısını yaparak ürünü seçme
          const productData = await getAPI(
            `/createProduct/createProduct?productId=${Stock.productId}`
          );

          // Extra ID'sine göre API çağrısını yaparak ekstrayı seçme
          const extraData = await Promise.all(
            matchingExtras.map(async (extra) => {
              const extraData = await getAPI(
                `/createProduct/createProduct?extraId=${extra.extraId}`
              );
              return extraData.data;
            })
          );

          const storeId = matchingStore.map((item) => item.id);

          const combinedItem = {
            id: Stock.id,
            Product: productData.data,
            Stock: Stock.stock,
            OrderNote: Stock.orderNote,
            ProductPrice: Stock.productPrice,
            ProductFeaturePrice: Stock.productFeaturePrice,
            Renkler: dataColour,
            Extralar: extraData,
            Ölçüler: dataMeasurement,
            Kumaşlar: dataFabric,
            Metaller: dataMetal,
            CreatedDate: Stock.createdAt,
            StoreId: storeId,
          };

          // Toplu veriler dizisine ekle
          combinedData.push(combinedItem);
        })
      );

      return res.status(200).json({
        status: 'success',
        data: combinedData,
        message: Stocks.message,
      });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ status: 'error', error, message: error.message });
  }
};

export default handler;
