'use client';
import React, { useState, createContext, useContext } from 'react';
import Navbar from '@/components/navbar';

const LoadingContext = createContext();

export default function RootLayout({ children }) {
  // Context oluşturuluyor
  const [isLoading, setIsLoading] = useState(false);
  const links = [
    { url: '/', text: 'Ana Sayfa' },
    {
      url: '/createProduct/createProduct',
      text: 'Ürün ve Koleksiyon',
      submenu: [
        { url: '/createProduct/measurements', text: 'Ölçü Oluştur' },
        { url: '/createProduct/fabrics', text: 'Kartela Oluştur' },
        { url: '/createProduct/metals', text: 'Metal Oluştur' },
        { url: '/createProduct/colors', text: 'Renk Oluştur' },
      ],
    },
    {
      url: '/financialManagement',
      text: 'Finansal İşlemler',
    },
    {
      url: '/createOffer',
      text: 'Teklif Oluştur',
    },

    // {
    //   url: '/products',
    //   text: 'Products',
    //   submenu: [
    //     { url: '/products/category1', text: 'Category 4' },
    //     { url: '/products/category2', text: 'Category 5' },
    //     { url: '/products/category3', text: 'Category 6' },
    //   ],
    // },
    // {
    //   url: '/contact',
    //   text: 'Contact',
    //   button: true,
    // },
    // Diğer linkleri burada da tanımlayabilirsiniz
  ];

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      <Navbar links={links} />
      {children}
    </LoadingContext.Provider>
  );
}

// Alt bileşenlerde LoadingContext'i kullanmak için bir custom hook oluşturuluyor
export const useLoadingContext = () => {
  return useContext(LoadingContext);
};
