import React from 'react';
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from '@/lib/table/utils';

const Pagination = ({ currentPage, customers, pageSize, setCurrentPage }) => {
  // Toplam sayfa sayısını hesapla
  const totalPageCount = Math.ceil(customers.length / pageSize);
  const pageNumbers = Array.from({ length: totalPageCount }, (_, i) => i + 1);

  return (
    <div className='mt-5 flex justify-end'>
      <PaginationComponent>
        <PaginationContent>
          <PaginationItem className={cn("cursor-pointer", currentPage === 1 && "opacity-25 cursor-default")}>
            <PaginationPrevious onClick={() => setCurrentPage((prev) => prev - 1)} />
          </PaginationItem>

          {pageNumbers.map((num, index) => (
            <PaginationItem className="cursor-pointer" key={index}>
              <PaginationLink onClick={() => setCurrentPage(num)} isActive={num === currentPage} >{num}</PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem className={cn("cursor-pointer", currentPage === totalPageCount && "opacity-25 cursor-default")}>
            <PaginationNext onClick={() => setCurrentPage((prev) => prev + 1)} />
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </div>
  );
};

export default Pagination;
