'use client'
import React from 'react';
import CustomTable from '@/components/table/CustomTable';
import { langs } from '@/lib/table/data';
import { expenseColumns } from '@/lib/table/table';
import { useSession } from 'next-auth/react';

const Addcompany = () => {
  // next-auth kurulunca güncellenecek
  const { data } = useSession()
  const role = data?.user?.role
  return (
    <>
      <CustomTable
        api_route='/expense'
        columns={expenseColumns(role)}
        langs={langs}
        perPage={10}
        pagination={true}
        paginationType='page'
        defaultLang='Us'
      />
    </>
  );
};

export default Addcompany;
