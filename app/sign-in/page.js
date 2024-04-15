'use client';
import { Formik, Form } from 'formik';
import { signIn } from 'next-auth/react';

const SignInPage = () => {
  return (
    <Formik
      initialValues={{
        password: '',
        phoneNumber: '',
      }}
      onSubmit={(values) => {
        // signIn içine hangi provider ile giriş yapılacağı ve giriş bilgileri gönderilir.
        const result = signIn('credentials', {
          password: values.password,
          phoneNumber: values.phoneNumber,
          callbackUrl: '/',
          redirect: true,
        }).then((res) => {
          console.log(res);
        });
      }}
    >
      {(props) => (
        <Form
          onSubmit={props.handleSubmit}
          className='p-3 flex justify-center flex-col items-center text-white h-screen bg-slate-800'
        >
          <div className='p-6 flex justify-center flex-col items-center gap-3 bg-slate-700 rounded'>
            <div className='flex flex-col'>
              <label htmlFor='phoneNumber'>Phone Number: </label>
              <input
                id='phoneNumber'
                name='phoneNumber'
                onChange={props.handleChange}
                className='bg-gray-200 p-3 rounded w-[300px] text-black'
                placeholder='Phone Number'
                type='text'
              />
            </div>
            <div className='flex flex-col'>
              <label htmlFor='password'>Password: </label>
              <input
                id='password'
                name='password'
                onChange={props.handleChange}
                className='bg-gray-200 p-3 rounded w-[300px] text-black'
                placeholder='Password'
                type='text'
              />
            </div>
            <button
              type='submit'
              className='bg-gray-200 rounded p-3 text-black font-semibold transition-all duration-300 hover:scale-105 hover:transition-all hover:duration-300'
            >
              Giriş Yap
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default SignInPage;
