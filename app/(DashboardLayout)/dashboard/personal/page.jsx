'use client'
import React from 'react'
import { personelColumn } from "@/lib/table/table";
import { langs } from "@/lib/table/data";
import CustomTable from '@/components/table/CustomTable';
import { useSession } from 'next-auth/react';

const Addperson = () => {
  // next-auth kurulunca güncellenecek
  const { data } = useSession()
  const role = data.user.role
  return (
    <div>
      <CustomTable
        api_route="/personal"
        columns={personelColumn(role)}
        langs={langs}
        perPage={10}
        pagination={true}
        paginationType="page"
        defaultLang="Us" />
    </div>
  )
}

export default Addperson
