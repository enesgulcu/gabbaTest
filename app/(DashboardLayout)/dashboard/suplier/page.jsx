
import CustomTable from '@/components/table/CustomTable'
import { langs } from '@/lib/table/data'
import { suplierColumn } from '@/lib/table/table'
import React from 'react'

const Addsuplier = () => {
  return (
    <div>
      <CustomTable
        api_route="/suplier"
        columns={suplierColumn}
        langs={langs}
        perPage={10}
        pagination={true}
        paginationType="page"
        defaultLang="Us" />

    </div>
  )
}

export default Addsuplier
