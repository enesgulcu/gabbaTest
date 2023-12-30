import Image from 'next/image';
import { GoTrash } from 'react-icons/go';
import { postAPI } from '@/services/fetchAPI';
import { LiaEdit } from 'react-icons/lia';

const BasketCard = ({
  productFeatures,
  item,
  setIsloading,
  setBasketData,
  toast,
  basketData,
  setSelectedBasketData,
  setHiddenBasketBar,
  setSelectedBasketFeatures,
}) => {
  const deleteBasketItem = async (itemId) => {
    setIsloading(true);
    const response = await postAPI('/createOffer/basket', {
      processType: 'delete',
      id: itemId,
    });

    if (!response || response.status !== 'success') {
      throw new Error('Veri silinemedi');
    } else {
      setIsloading(false);
      toast.success(response.message);
      const newBasketData = basketData.filter((item) => item.id !== itemId);
      setBasketData(newBasketData);
    }
  };

  const handleChangeStock = async (itemId, stock) => {
    console.log(stock);
    if (stock < 1) {
      return toast.error('Stok değeri 1 den küçük olamaz!');
    }
    setBasketData((prevBasketData) => {
      const newBasketData = [...prevBasketData];
      const itemIndex = newBasketData.findIndex((item) => item.id === itemId);
      newBasketData[itemIndex].Stock = stock;
      return newBasketData;
    });
    const response = await postAPI('/createOffer/basket', {
      processType: 'update',
      id: itemId,
      stock,
    });
  };

  return (
    <>
      <div className='shadow bg-white rounded flex flex-col gap-3'>
        {/* Sepet ürün resmi */}
        {productFeatures.map(
          (productFeature, index) =>
            productFeature.productId === item.Product.id &&
            productFeature.feature.includes('Image' || 'image') && (
              <Image
                key={index}
                width={600}
                height={300}
                src={
                  productFeature.imageValue
                    ? productFeature.imageValue
                    : '/no-image.jpg'
                }
                alt={`image${index}`}
                className='max-h-[150px] w-full h-full rounded object-contain	bg-gray-100 hover:scale-110 transition-all'
              />
            )
        )}
        {/* Sepet ürün adı */}
        <div className='flex items-center mx-2 gap-3 justify-between'>
          <p className='text-center font-semibold uppercase break-all	'>
            {item.Product.productName}
          </p>
          <div className='flex gap-2'>
            <button
              onClick={() => {
                setHiddenBasketBar(true);
                setSelectedBasketData([item]);
                setSelectedBasketFeatures(
                  productFeatures.filter(
                    (productFeature) =>
                      productFeature.productId === item.Product.id
                  )
                );
              }}
              title='Düzenle'
              type='button'
              className='font-semibold text-white border border-green-500 rounded-full p-1 bg-green-500
          hover:bg-green-800 transition duration-300 ease-in-out hover:border-green-800'
            >
              <LiaEdit size={20} />
            </button>
            <button
              onClick={() => deleteBasketItem(item.id)}
              title='Sil'
              type='button'
              className='font-semibold text-white border border-red-500 rounded-full p-1 bg-red-500
          hover:bg-red-800 transition duration-300 ease-in-out hover:border-red-800'
            >
              <GoTrash size={18} />
            </button>
          </div>
        </div>
        {/* Sepet ürün fiyatı, stok adedi */}
        <div className='flex gap-2 items-center justify-between p-2'>
          <div className='flex gap-2  items-center'>
            <button
              type='button'
              className='w-8 h-8 bg-blue-500 rounded-full text-white'
              onClick={() => handleChangeStock(item.id, item.Stock + 1)}
            >
              +
            </button>

            <p>{item.Stock}</p>
            <button
              type='button'
              className='w-8 h-8 bg-blue-500 rounded-full text-white'
              onClick={() => handleChangeStock(item.id, item.Stock - 1)}
            >
              -
            </button>
          </div>
          <p className='mr-4 font-semibold text-red-600'>
            Fiyat:{' '}
            {parseInt(item.ProductPrice + item.ProductFeaturePrice) *
              item.Stock}
          </p>
        </div>
      </div>
    </>
  );
};

export default BasketCard;
