const BasketAddPersonel = ({ ErrorMessage, FormProps }) => {
  return (
    <>
      <div className='border p-3 mx-4 rounded shadow order-2 md:order-1 flex gap-2 flex-col'>
        <div className='flex gap-3 justify-center'>
          <button
            type='button'
            onClick={() => alert('Güncellenecek')}
            className='bg-gray-800 rounded text-white p-3'
          >
            Kayıtlı Personellerden Seç
          </button>
        </div>
        <h1 className='text-center text-lg font-semibold uppercase'>
          Personel Kaydı Ekle
        </h1>
        <div className='input-group'>
          <input
            onChange={FormProps.handleChange}
            id={`Personel[0].name`}
            name={`Personel[0].name`}
            value={FormProps.values.Personel[0].name}
            className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-full m-2]`}
            type='text'
            placeholder='Personelin Adı'
          />
          <ErrorMessage
            name='Personel[0].name'
            component='div'
            className='field-error text-red-600 m-1'
          />
        </div>
        <div className='input-group'>
          <input
            onChange={FormProps.handleChange}
            id={`Personel[0].surname`}
            name={`Personel[0].surname`}
            value={FormProps.values.Personel[0].surname}
            className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-full m-2]`}
            type='text'
            placeholder='Personelin Soyadı'
          />
          <ErrorMessage
            name='Personel[0].surname'
            component='div'
            className='field-error text-red-600 m-1'
          />
        </div>
        <div className='input-group'>
          <input
            onChange={FormProps.handleChange}
            id={`Personel[0].storeName`}
            name={`Personel[0].storeName`}
            value={FormProps.values.Personel[0].storeName}
            className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-full m-2]`}
            type='text'
            placeholder='Mağaza'
          />
          <ErrorMessage
            name='Personel[0].storeName'
            component='div'
            className='field-error text-red-600 m-1'
          />
        </div>
        <div className='input-group'>
          <input
            onChange={FormProps.handleChange}
            id={`Personel[0].storeAddress`}
            name={`Personel[0].storeAddress`}
            value={FormProps.values.Personel[0].storeAddress}
            className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-full m-2]`}
            type='text'
            placeholder='Mağaza Adresi'
          />
          <ErrorMessage
            name='Personel[0].storeAddress'
            component='div'
            className='field-error text-red-600 m-1'
          />
        </div>
        <div className='input-group'>
          <input
            onChange={FormProps.handleChange}
            id={`Personel[0].phoneNumber`}
            name={`Personel[0].phoneNumber`}
            value={FormProps.values.Personel[0].phoneNumber}
            className={`hover:scale-105 transition-all border border-gray-300 rounded-md p-2 w-full m-2]`}
            type='text'
            placeholder='Personelin Telefon Numarası'
          />
          <ErrorMessage
            name='Personel[0].phoneNumber'
            component='div'
            className='field-error text-red-600 m-1'
          />
        </div>
      </div>
    </>
  );
};

export default BasketAddPersonel;
