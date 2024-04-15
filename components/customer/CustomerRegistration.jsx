import { AiOutlineClose } from 'react-icons/ai';
import { postAPI } from '@/services/fetchAPI';
import { toast } from 'react-toastify';
import { Formik, Form, Field } from 'formik';
import { useLoadingContext } from '@/app/(HomeLayout)/layout';

const CustomerRegistration = ({ setAddCustomerPopup, getData }) => {
  const { isLoading, setIsLoading } = useLoadingContext();

  return (
    <>
      <div className='fixed top-0 left-0 w-full h-full bg-black/90 flex justify-center items-center z-50'>
        <div className='bg-white relative px-10 py-4 rounded-lg'>
          <button
            type='button'
            onClick={() => setAddCustomerPopup(false)}
            color='#FFF'
            className='absolute -top-4 -right-4 bg-red-500 border border-red-500 p-2 rounded-lg text-white hover:rotate-6 transition-all duration-300'
          >
            <AiOutlineClose className='cursor-pointer' />
          </button>
          <h2 className='font-semibold text-2xl mb-4'>
            Yeni Müşteri Ekleme Formu
          </h2>
          <Formik
            initialValues={{
              name: '',
              surname: '',
              mailAddress: '',
              address: '',
              company_name: '',
              phoneNumber: '',
            }}
            onSubmit={async (values, { resetForm }) => {
              setIsLoading(true);
              const response = await postAPI('/customer', values).then(
                (res) => {
                  if (res.status == 'error') {
                    setIsLoading(false);
                    return toast.error(res.message);
                  }
                  if (res.status == 'success') {
                    setIsLoading(false);
                    getData('onlyCustomer');
                    resetForm();
                    setAddCustomerPopup(false);
                    return toast.success(res.message);
                  }
                }
              );
              return response;
            }}
          >
            {(props) => (
              <Form onSubmit={props.handleSubmit}>
                <div className='flex flex-col gap-2'>
                  <Field
                    type='text'
                    name='company_name'
                    onChange={props.handleChange}
                    className='p-2 rounded border'
                    placeholder='Firma İsmi'
                  />
                  <Field
                    type='text'
                    name='name'
                    onChange={props.handleChange}
                    className='p-2 rounded border'
                    placeholder='Ad'
                  />
                  <Field
                    type='text'
                    name='surname'
                    onChange={props.handleChange}
                    className='p-2 rounded border'
                    placeholder='Soyad'
                  />
                  <Field
                    type='text'
                    name='address'
                    onChange={props.handleChange}
                    className='p-2 rounded border'
                    placeholder='Adres'
                  />
                  <Field
                    type='text'
                    name='mailAddress'
                    onChange={props.handleChange}
                    className='p-2 rounded border'
                    placeholder='Mail Adresi'
                  />
                  <Field
                    type='text'
                    name='phoneNumber'
                    onChange={props.handleChange}
                    className='p-2 rounded border'
                    placeholder='Telefon Numarası'
                  />
                  <button
                    type='submit'
                    className='p-2 bg-slate-700 text-white font-semibold rounded mt-2'
                  >
                    Yeni Müşteri Ekle
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default CustomerRegistration;
