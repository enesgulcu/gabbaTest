"use client";
import React, { useState, useEffect } from "react";
import Pagination from "./Pagination";
import FilterInput from "./FilterInput";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "../ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, Formik } from "formik";
import { postAPI } from "@/services/fetchAPI";
import { BiPlus } from "react-icons/bi";
import { useLoadingContext } from "@/app/(HomeLayout)/layout";

const MusteriTablosu = ({
  currentPage,
  pageSize,
  filteredMusteriler,
  selectedMusteri,
  setSelectedMusteri,
  FormProps,
}) => {
  const handleMusteriSecimi = (customer, FormProps) => {
    // Formik formundan gelen props değerlerini kullanarak müşteri bilgilerini güncelleyin
    FormProps.setFieldValue("customerId", customer.id);
    FormProps.setFieldValue("customerName", customer.name);

    setSelectedMusteri(customer);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const currentMusteriler = filteredMusteriler.slice(
    startIndex,
    startIndex + pageSize
  );

  return (
    <div className="overflow-x-auto w-[600px] lg:w-full rounded border border-border mt-8">
      <Table className="border-collapse w-full">
        <TableHeader>
          <TableHead className="border border-border">Seçim</TableHead>
          <TableHead className="border border-border">Firma İsmi</TableHead>
          <TableHead className="border border-border">Müşterinin Adı</TableHead>
          <TableHead className="border border-border">
            Müşterinin Soyadı
          </TableHead>
          <TableHead className="border border-border">
            Müşterinin Adresi
          </TableHead>
          <TableHead className="border border-border">
            Müşterinin Mail Adresi
          </TableHead>
          <TableHead className="border border-border">
            Müşterinin Telefon Numarası
          </TableHead>
        </TableHeader>
        <TableBody className="text-center">
          {currentMusteriler.map((musteri, index) => (
            <TableRow
              key={index}
              className={`${
                musteri.name + musteri.phoneNumber ===
                  selectedMusteri?.name + selectedMusteri?.phoneNumber &&
                "bg-green-200 hover:bg-green-300 transition-all duration-200 ease-in-out"
              }`}
            >
              <TableCell className="border border-border">
                <Checkbox
                  className="w-5 h-5"
                  checked={
                    selectedMusteri ? selectedMusteri.id === musteri.id : false
                  }
                  onCheckedChange={() =>
                    handleMusteriSecimi(musteri, FormProps)
                  }
                />
              </TableCell>
              <TableCell className="border border-border">
                {musteri.company_name}
              </TableCell>
              <TableCell className="border border-border">
                {musteri.name}
              </TableCell>
              <TableCell className="border border-border">
                {musteri.surname}
              </TableCell>
              <TableCell className="border border-border">
                {musteri.address}
              </TableCell>
              <TableCell className="border border-border">
                {musteri.mailAddress}
              </TableCell>
              <TableCell className="border border-border">
                {musteri.phoneNumber}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

const Customer = ({ setAddCustomerPopup, customers, FormProps, getData, toast }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { isLoading, setIsLoading } = useLoadingContext();
  const [selectedMusteri, setSelectedMusteri] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [filteredMusteriler, setFilteredMusteriler] = useState(customers); // Filtrelenmiş müşteri verilerini saklamak için state
  const pageSize = 5;

  useEffect(() => {
    setFilteredMusteriler(customers);
  }, [customers]);

  return (
    <div className="m-5">
      <div className="flex flex-col gap-2 mb-12">
        <Label className="text-xl font-semibold">
          Müşteri Tanımlama Paneli
        </Label>
        <Label className="text-gray-700 font-medium">
          Bu sayfada siparişi hangi müşteriniz için oluşturduğunuzu belirleyiniz
        </Label>
      </div>
      <div className="flex flex-col gap-2 md:flex-row md:gap-0 md:justify-between items-center">
        <FilterInput
          customers={customers}
          setFilteredMusteriler={setFilteredMusteriler}
          setCurrentPage={setCurrentPage}
        />
        <Dialog onOpenChange={setOpenModal} open={openModal}>
          <DialogTrigger asChild>
            {/*
              <Button
                type='button'
                className='text-white rounded font-semibold transition-all duration-300'
              >
                Yeni Müşteri
              </Button>
              */}

            <Button
              title="Yeni müşteri kayıt et."
              type="button"
              className="text-white w-10 h-10 flex items-center justify-center p-0 rounded-full font-semibold transition-all duration-300"
            >
              <BiPlus size={24} />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Müşteri Kaydı Ekle</DialogTitle>
              <DialogDescription>
                Yeni bir müşteri kaydı eklemek için lütfen aşağıdaki bilgileri
                doldurunuz.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Formik
                initialValues={{
                  name: "",
                  surname: "",
                  mailAddress: "",
                  address: "",
                  company_name: "",
                  phoneNumber: "",
                }}
                onSubmit={async (values, { resetForm }) => {
                  setOpenModal(false)
                  setIsLoading(true);
                  const response = await postAPI("/customer", values).then(
                    (res) => {
                      if (res.status == "error") {
                        setIsLoading(false);
                        return toast.error(res.message);
                      }
                      if (res.status == "success") {
                        setIsLoading(false);
                        getData("onlyCustomer");
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
                    <div className="flex flex-col gap-2.5">
                      <Input
                        type="text"
                        name="company_name"
                        onChange={props.handleChange}
                        placeholder="Firma İsmi"
                      />
                      <Input
                        type="text"
                        name="name"
                        onChange={props.handleChange}
                        placeholder="Ad"
                      />
                      <Input
                        type="text"
                        name="surname"
                        onChange={props.handleChange}
                        placeholder="Soyad"
                      />
                      <Input
                        type="text"
                        name="address"
                        onChange={props.handleChange}
                        placeholder="Adres"
                      />
                      <Input
                        type="text"
                        name="mailAddress"
                        onChange={props.handleChange}
                        placeholder="Mail Adresi"
                      />
                      <Input
                        type="text"
                        name="phoneNumber"
                        onChange={props.handleChange}
                        placeholder="Telefon Numarası"
                      />
                      <Button type="submit" className="mt-2">
                        Yeni Müşteri Ekle
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <MusteriTablosu
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        filteredMusteriler={filteredMusteriler}
        customers={customers}
        setFilteredMusteriler={setFilteredMusteriler}
        selectedMusteri={selectedMusteri}
        setSelectedMusteri={setSelectedMusteri}
        FormProps={FormProps}
      />
      {/* Sayfalama kontrolleri */}
      <Pagination
        customers={filteredMusteriler}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
      />
      <div className="flex justify-between mt-4 gap-6">
        <Textarea
          name="orderNote"
          onChange={FormProps.handleChange}
          className="w-full h-[100px] resize-none border rounded"
          placeholder="Ürün için genel açıklama notu ekleyin..."
        />
        {selectedMusteri && (
          <button
            onSubmit={FormProps.handleSubmit}
            type="submit"
            className="w-1/4 bg-green-500 rounded text-white font-semibold p-3"
          >
            Sipariş Oluştur
          </button>
        )}
      </div>
    </div>
  );
};

export default Customer;
