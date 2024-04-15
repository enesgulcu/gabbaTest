import prisma from '@/lib/prisma';
import { getAPI, postAPI } from '@/services/fetchAPI';
import {
  createNewData,
  createNewDataMany,
  getAllData,
  getDataByUnique,
  getDataByUniqueMany,
  deleteDataByAny,
  deleteDataByMany,
} from '@/services/serviceOperations';

function generateOrderCode(customerName) {
  const orderDate = new Date();
  // Sipariş tarihini al
  var orderTime =
    orderDate.getHours() +
    '' +
    orderDate.getMinutes() +
    '' +
    orderDate.getSeconds();
  var orderDay = orderDate.getDate();
  var orderMonth = orderDate.getMonth() + 1; // Ay 0 ile başlar, bu nedenle +1 ekliyoruz

  // Müşteri isminin ilk 4 harfini al
  var customerPrefix = customerName.slice(0, 4).toUpperCase();

  // Rastgele 2 harf oluştur
  var randomChars = generateRandomChars(2);

  // Rastgele 2 harf oluşturma fonksiyonu
  function generateRandomChars(length) {
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var randomChars = '';

    for (var i = 0; i < length; i++) {
      var randomIndex = Math.floor(Math.random() * characters.length);
      randomChars += characters.charAt(randomIndex);
    }

    return randomChars;
  }

  // Sipariş kodunu oluştur
  var orderCode =
    orderTime +
    customerPrefix +
    randomChars +
    orderDay +
    orderMonth +
    generateRandomChars(2);

  return orderCode;
}

const handler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { basketData, values, processType, deletedOrderCode } = req.body;

      // Teklifler sayfasından silme işlemi yapılırsa
      if (processType === 'delete') {
        const findOrderCode = await getDataByUniqueMany('OfferOrder', {
          orderCode: deletedOrderCode,
        });

        if (!findOrderCode || findOrderCode.error) {
          throw findOrderCode.error;
        }
        console.log(findOrderCode);

        const result = await Promise.all(
          findOrderCode.map(async (item) => {
            const deletedOrder = deleteDataByAny('OfferOrder', {
              id: item.id,
            });

            const deletedColors = deleteDataByMany('OfferOrderColors', {
              orderCode: item.orderCode,
            });

            const deletedFabrics = deleteDataByMany('OfferOrderFabrics', {
              orderCode: item.orderCode,
            });

            const deletedMeasurements = deleteDataByMany(
              'OfferOrderMeasurements',
              {
                orderCode: item.orderCode,
              }
            );

            const deletedMetals = deleteDataByMany('OfferOrderMetals', {
              orderCode: item.orderCode,
            });

            const deletedExtras = deleteDataByMany('OfferOrderExtra', {
              orderCode: item.orderCode,
            });

            const [
              deletedOrderResult,
              deletedColorsResult,
              deletedFabricsResult,
              deletedMeasurementsResult,
              deletedMetalsResult,
              deletedExtrasResult,
            ] = await Promise.all([
              deletedOrder,
              deletedColors,
              deletedFabrics,
              deletedMeasurements,
              deletedMetals,
              deletedExtras,
            ]);

            return {
              deletedOrderResult,
              deletedColorsResult,
              deletedFabricsResult,
              deletedMeasurementsResult,
              deletedMetalsResult,
              deletedExtrasResult,
            };
          })
        );

        if (!result || result.some((r) => r.error)) {
          throw result.find((r) => r.error).error;
        }

        return res.status(200).json({
          status: 'success',
          data: result,
          message: 'Tekliften ürün başarıyla silindi.',
        });
      }

      const customerId = values.customerId;
      const customerName = values.customerName;
      const personelId = values.personelId;
      const orderNote = values.orderNote;
      const ordersStatus = values.ordersStatus;
      const productOrderStatus = values.productOrderStatus;

      if (personelId == undefined || personelId == null) {
        throw new Error('Hesabınıza giriş yapmanız gerekiyor!');
      }

      // 10 gün eklemek için yeni bir tarih oluştur
      const date = new Date();
      const invalidDate = new Date(date);
      invalidDate.setDate(date.getDate() + 10);

      const orderCode = generateOrderCode(customerName);

      await Promise.all(
        // MAP
        basketData.map(async (item) => {
          const orderData = {
            orderCode: orderCode,
            invalidDate: invalidDate,
            stock: item.Stock,
            orderNote: orderNote,
            ordersStatus: ordersStatus,
            productOrderStatus: productOrderStatus,
            personelId: personelId,
            customerId: customerId,
            productPrice: item.ProductPrice,
            productFeaturePrice: item.ProductFeaturePrice,
            productId: item.Product.id,
          };

          const responseCreateOrder = await createNewData(
            'OfferOrder',
            orderData
          );

          if (!responseCreateOrder || responseCreateOrder?.error) {
            throw responseCreateOrder?.error;
          }

          // Renkleri Order Tablosuna Ekle
          if (item && item.Renkler && item.Renkler.length > 0) {
            const colourData = [];
            await item.Renkler.map((colourItem) => {
              // colourItem.id ve orderCode'u aynı diziye ekle.
              colourData.push({
                orderId: responseCreateOrder.id,
                colourId: colourItem.id,
                productId: item.Product.id,
                orderCode: orderCode,
              });
            });
            const createdColors = await createNewDataMany(
              'OfferOrderColors',
              colourData
            );
            if (!createdColors || createdColors?.error) {
              throw createdColors?.error;
            }
          }

          // Metalleri Order Tablosuna Ekle
          if (item && item.Metaller && item.Metaller.length > 0) {
            const metalData = [];
            await item.Metaller.map((metalsItem) => {
              // colourItem.id ve orderCode'u aynı diziye ekle.
              metalData.push({
                orderId: responseCreateOrder.id,
                metalId: metalsItem.id,
                productId: item.Product.id,
                orderCode: orderCode,
              });
            });
            const createdMetals = await createNewDataMany(
              'OfferOrderMetals',
              metalData
            );
            if (!createdMetals || createdMetals?.error) {
              throw createdMetals?.error;
            }
          }

          // Ölçüleri (measurement) Order Tablosuna Ekle
          if (item && item.Ölçüler && item.Ölçüler.length > 0) {
            const measurementData = [];
            await item.Ölçüler.map((measurementsItem) => {
              // colourItem.id ve orderCode'u aynı diziye ekle.
              measurementData.push({
                orderId: responseCreateOrder.id,
                measurementId: measurementsItem.id,
                productId: item.Product.id,
                orderCode: orderCode,
              });
            });
            const createdMeasurements = await createNewDataMany(
              'OfferOrderMeasurements',
              measurementData
            );
            if (!createdMeasurements || createdMeasurements?.error) {
              throw createdMeasurements?.error;
            }
          }

          // Kumaşları (fabric) Order Tablosuna Ekle
          if (item && item.Kumaşlar && item.Kumaşlar.length > 0) {
            const fabricData = [];
            await item.Kumaşlar.map((fabricsItem) => {
              // colourItem.id ve orderCode'u aynı diziye ekle.
              fabricData.push({
                orderId: responseCreateOrder.id,
                fabricsId: fabricsItem.id,
                productId: item.Product.id,
                orderCode: orderCode,
              });
            });
            const createdFabrics = await createNewDataMany(
              'OfferOrderFabrics',
              fabricData
            );
            if (!createdFabrics || createdFabrics?.error) {
              throw createdFabrics?.error;
            }
          }

          // Extraları Order Tablosuna Ekle
          if (item && item.Extralar && item.Extralar.length > 0) {
            const extraData = [];
            await item.Extralar.map((extrasItem) => {
              // colourItem.id ve orderCode'u aynı diziye ekle.
              extraData.push({
                orderId: responseCreateOrder.id,
                extraId: extrasItem.id,
                productId: item.Product.id,
                orderCode: orderCode,
              });
            });
            const createdExtras = await createNewDataMany(
              'OfferOrderExtra',
              extraData
            );
            if (!createdExtras || createdExtras?.error) {
              throw createdExtras?.error;
            }
          }

          // Gelen id ile birlikte sepetteki ürünü sil
          const deletedBasket = await postAPI('/createOffer/basket', {
            processType: 'delete',
            id: item.id,
          });
          if (!deletedBasket || deletedBasket?.error) {
            throw deletedBasket?.error;
          }
        })
        // MAP END
      );

      return res.status(200).json({
        status: 'success',
        message: 'Teklif başarıyla oluşturuldu.',
      });
    }

    if (req.method === 'GET') {
      if (req.method === 'GET') {
        const OfferOrders = getAllData('OfferOrder');

        const OfferOrderColors = getAllData('OfferOrderColors');
        const OfferOrderFabrics = getAllData('OfferOrderFabrics');
        const OfferOrderMeasurements = getAllData('OfferOrderMeasurements');
        const OfferOrderMetals = getAllData('OfferOrderMetals');
        const OfferOrderExtra = getAllData('OfferOrderExtra');

        const [
          OfferOrdersResult,
          OfferOrderColorsResult,
          OfferOrderFabricsResult,
          OfferOrderMeasurementsResult,
          OfferOrderMetalsResult,
          OfferOrderExtraResult,
        ] = await Promise.all([
          OfferOrders,
          OfferOrderColors,
          OfferOrderFabrics,
          OfferOrderMeasurements,
          OfferOrderMetals,
          OfferOrderExtra,
        ]);

        if (!OfferOrdersResult || OfferOrdersResult?.error) {
          throw 'Bir hata oluştu. Lütfen teknik birimle iletişime geçiniz. XR09KY4';
        }

        // Benzersiz orderCode'ları saklamak için bir dizi oluştur
        const uniqueOrderCodes = [];

        // Her bir siparişi kontrol et
        OfferOrdersResult.forEach((order) => {
          const orderCode = order.orderCode;

          // Eğer orderCode daha önce eklenmemişse, diziye ekle
          if (!uniqueOrderCodes.includes(orderCode)) {
            uniqueOrderCodes.push(orderCode);
          }
        });

        const combinetData = [];

        await Promise.all(
          uniqueOrderCodes.map(async (orderCode) => {
            // Her bir sipariş kodu için renkleri seç
            const matchingColors = OfferOrderColorsResult.filter(
              (color) => color.orderCode === orderCode
            );

            // Her bir sipariş kodu için kumaşları seç
            const matchingFabrics = OfferOrderFabricsResult.filter(
              (fabric) => fabric.orderCode === orderCode
            );

            // Her bir sipariş kodu için ölçüleri seç
            const matchingMeasurements = OfferOrderMeasurementsResult.filter(
              (measurement) => measurement.orderCode === orderCode
            );

            // Her bir sipariş kodu için metalleri seç
            const matchingMetals = OfferOrderMetalsResult.filter(
              (metal) => metal.orderCode === orderCode
            );

            // Her bir sipariş kodu için extraları seç
            const matchingExtras = OfferOrderExtraResult.filter(
              (extra) => extra.orderCode === orderCode
            );

            const matchingOrder = OfferOrdersResult.filter(
              (order) => order.orderCode === orderCode
            );

            // Her bir renk için API çağrısını yaparak Renkler dizisine eklemek
            const Colours = await Promise.all(
              matchingColors.map(async (color) => {
                const colourData = await getAPI(
                  `/createProduct/colors?colourId=${color.colourId}`
                );
                colourData.data.orderId = color.orderId;
                return colourData.data;
              })
            );

            // Her bir ölçü için API çağrısını yaparak Ölçüler dizisine eklemek
            const Measurements = await Promise.all(
              matchingMeasurements.map(async (measurement) => {
                const measurementData = await getAPI(
                  `/createProduct/measurements?measurementId=${measurement.measurementId}`
                );
                measurementData.data.orderId = measurement.orderId;
                return measurementData.data;
              })
            );

            // Her bir metaller için API çağrısını yaparak Metaller dizisine eklemek
            const Metals = await Promise.all(
              matchingMetals.map(async (metal) => {
                const metalData = await getAPI(
                  `/createProduct/metals?metalId=${metal.metalId}`
                );
                metalData.data.orderId = metal.orderId;
                return metalData.data;
              })
            );

            // Her bir kumaş için API çağrısını yaparak Kumaşlar dizisine eklemek
            const Fabrics = await Promise.all(
              matchingFabrics.map(async (fabric) => {
                const fabricData = await getAPI(
                  `/createProduct/fabrics?fabricsId=${fabric.fabricsId}`
                );
                fabricData.data.orderId = fabric.orderId;
                return fabricData.data;
              })
            );

            // Her bir ekstra için API çağrısını yaparak Extralar dizisine eklemek
            const Extras = await Promise.all(
              matchingExtras.map(async (extra) => {
                const extraData = await getAPI(
                  `/createProduct/createProduct?extraId=${extra.extraId}`
                );
                extraData.data.orderId = extra.orderId;
                return extraData.data;
              })
            );

            // Her bir ürün için API çağırısını yaparak Ürünler dizisine eklemek
            const Products = await Promise.all(
              matchingOrder.map(async (order) => {
                const productData = await getAPI(
                  `/createProduct/createProduct?productId=${order.productId}`
                );
                productData.data.orderId = order.orderId;
                return productData.data;
              })
            );

            const Customer = await Promise.all(
              matchingOrder.map(async (order) => {
                const customerData = await getDataByUnique('Customer', {
                  id: order.customerId,
                });
                return customerData;
              })
            );

            const Personel = await Promise.all(
              matchingOrder.map(async (order) => {
                const personelData = await getDataByUnique('User', {
                  id: order.personelId,
                });
                return personelData;
              })
            );

            combinetData.push({
              orderCode: orderCode,
              Orders: matchingOrder,
              Renkler: Colours,
              Kumaşlar: Fabrics,
              Ölçüler: Measurements,
              Metaller: Metals,
              Extralar: Extras,
              Ürünler: Products,
              Müşteri: Customer,
              Personel: Personel,
            });
          })
        );

        return res.status(200).json({
          status: 'success',
          data: combinetData,
          message: 'Siparişler başarıyla getirildi.',
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
