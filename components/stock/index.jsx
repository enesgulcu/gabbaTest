'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ListProducts from './listProducts';
import { getAPI } from '@/services/fetchAPI';
import FinancialManagementCalculate from '@/functions/others/financialManagementCalculate';
import { useLoadingContext } from '@/app/(DashboardLayout)/layout';

const Stock = () => {
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [productFeatures, setProductFeatures] = useState([]);
  const [allFeatureValues, setAllFeatureValues] = useState([]);

  const { isLoading, setIsLoading } = useLoadingContext();

  const getData = async () => {
    try {
      setIsLoading(true);

      const response1 = getAPI('/createProduct/createProduct');
      const response2 = getAPI('/store');

      const [createProductResult, storeResult] = await Promise.all([
        response1,
        response2,
      ]);

      if (!createProductResult) {
        throw new Error('Veri çekilemedi 2');
      }

      if (createProductResult.status !== 'success') {
        throw new Error('Veri çekilemedi');
      }

      // response.data.createProducts içerisindeki değerleri gez ve "productName" değerlerine göre küçükten büyüğe doğru sırala.
      await createProductResult.data.createProducts.sort((a, b) =>
        a.productName.localeCompare(b.productName)
      );
      await Promise.all(
        await createProductResult.data.createProducts.map(async (item) => {
          const { result } = await FinancialManagementCalculate(
            item.productPrice
          );
          item.productPrice = result[result.length - 1];
        })
      );
      setProducts(createProductResult.data.createProducts);
      setProductFeatures(createProductResult.data.productFeatures);
      setStores(storeResult.data);

      setIsLoading(false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <ListProducts
        getData={getData}
        toast={toast}
        setIsloading={setIsLoading}
        products={products}
        productFeatures={productFeatures}
        setAllFeatureValues={setAllFeatureValues}
        allFeatureValues={allFeatureValues}
        stores={stores}
      />
    </>
  );
};

export default Stock;
