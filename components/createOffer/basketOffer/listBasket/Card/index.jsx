import Image from 'next/image';
import { GoTrash } from 'react-icons/go';
import { postAPI } from '@/services/fetchAPI';
import { LiaEdit } from 'react-icons/lia';
import { BiMinus, BiPlus } from 'react-icons/bi';

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
    <div className='shadow-lg w-72 group bg-white transition-all duration-200 ease-in-out transform hover:shadow-xl rounded flex flex-col gap-3 p-4 border border-gray-300'>
      <div className="group-hover:opacity-100 group-hover:pointer-events-auto hover:pointer-events-auto pointer-events-none opacity-0 flex hover:opacity-100 transition-all duration-150 ease-in-out bg-slate-200 p-2 rounded absolute right-2 top-2">
        <div className='flex gap-2'>
          <button
            onClick={() => {
              setHiddenBasketBar(true);
              setSelectedBasketData([item]);
              setSelectedBasketFeatures(
                productFeatures.filter(
                  (productFeature) => productFeature.productId === item.Product.id
                )
              );
            }}
            title='Düzenle'
            type='button'
            className='flex items-center justify-center w-8 h-8 text-white bg-green-500 rounded-full hover:bg-green-600 focus:outline-none focus:bg-green-600 transition duration-300'
          >
            <LiaEdit size={16} />
          </button>
          <button
            onClick={() => deleteBasketItem(item.id)}
            title='Sil'
            type='button'
            className='flex items-center justify-center w-8 h-8 text-white bg-red-500 rounded-full hover:bg-red-600 focus:outline-none focus:bg-red-600 transition duration-300'
          >
            <GoTrash size={16} />
          </button>
        </div>
      </div>

      {/* Sepet ürün resmi */}
      {productFeatures.map((productFeature, index) => (
        productFeature.productId === item.Product.id &&
        productFeature.feature.toLowerCase().includes('image') && (
          <Image
            key={index}
            width={600}
            height={300}
            src={productFeature.imageValue ? productFeature.imageValue : '/no-image.jpg'}
            alt={`image${index}`}
            className='max-h-[200px] w-full h-full object-cover rounded'
          />
        )
      ))}
      {/* Sepet ürün adı */}
      <div className='flex items-center justify-between'>
        <p className='font-bold text-gray-900 capitalize break-all'>
          {item.Product.productName}
        </p>
      </div>
      {/* Sepet ürün fiyatı, stok adedi */}
      <div className='flex items-center justify-between'>
        <div className='flex gap-2 items-center'>
          <button
            type='button'
            className='w-6 h-6 flex items-center justify-center text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:bg-blue-600 transition duration-300'
            onClick={() => handleChangeStock(item.id, item.Stock - 1)}
          >
            <BiMinus size={16}/>
          </button>
          <p className='text-gray-700 font-semibold'>{item.Stock}</p>
          <button
            type='button'
            className='w-6 h-6 flex items-center justify-center text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:bg-blue-600 transition duration-300'
            onClick={() => handleChangeStock(item.id, item.Stock + 1)}
          >
            <BiPlus size={16}/>
          </button>
        </div>
        <p className='text-sm font-medium text-red-600'>
          Fiyat: {parseInt(item.ProductPrice + item.ProductFeaturePrice) * item.Stock}
        </p>
      </div>
    </div>
  );
};

export default BasketCard;
