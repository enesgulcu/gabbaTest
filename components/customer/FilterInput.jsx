'use client';
import React, { useState } from 'react';
import { Input } from "@/components/ui/input"

const FilterInput = ({ customers, setFilteredMusteriler, setCurrentPage }) => {
  const [filterText, setFilterText] = useState('');

  const handleFilter = (filterText) => {
    setCurrentPage(1);
    const filteredData = customers.filter((musteri) =>
      Object.values(musteri).some(
        (value) =>
          typeof value === 'string' &&
          value.toLowerCase().includes(filterText.toLowerCase())
      )
    );
    setFilteredMusteriler(filteredData);
  };

  return (
    <Input
      className='w-[250px] border rounded'
      type='text'
      placeholder='Tabloyu filtrele...'
      value={filterText}
      onChange={(e) => {
        setFilterText(e.target.value);
        handleFilter(e.target.value);
      }}
    />
  );
};

export default FilterInput;
