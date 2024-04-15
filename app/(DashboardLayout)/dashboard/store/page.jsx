import React from 'react';
import { StoreColumn } from '@/lib/table/table';
import { langs } from '@/lib/table/data';
import CustomTable from '@/components/table/CustomTable';

const Store = () => {
  return (
    <>
      <CustomTable
        api_route='/store'
        columns={StoreColumn}
        langs={langs}
        perPage={10}
        pagination={true}
        paginationType='page'
        defaultLang='Us'
      />
    </>
  );
};

export default Store;
