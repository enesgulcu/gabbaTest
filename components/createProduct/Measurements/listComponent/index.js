"use client"
import React, { useState, useEffect } from 'react';
import {postAPI, getAPI} from '@/services/fetchAPI';
import LoadingScreen from '@/components/other/loading';
import { ToastContainer, toast } from "react-toastify";

/*  veri yapısındaki key değerleri
[
    "id",
    "firstValue",
    "secondValue",
    "unit",
    "oneRangeEnabled",
    "twoRangeEnabled",
    "manuelDefined",
    "translateEnabled",
    "turkish",
    "ukrainian",
    "english",
    "createdAt",
    "updatedAt"
]
*/

const ListComponent = ({NewData, setUpdateData, isloading, setIsloading }) => {


    
    // tablo verisi bu state üzerinde tutulmaktadır.
    const [measurements, setMeasurements] = useState([]);
    
    useEffect(() => {
    const sorted = [...NewData].sort((a, b) => parseInt(a.firstValue.match(/\d+/)) - parseInt(b.firstValue.match(/\d+/)));
      setMeasurements(sorted);
    
    }, [NewData])
    
    // tablodan veri silme fonksiyonu
    const dataDeleteFunction = async (data) => {
        try {
            const responseData = await postAPI("/createProduct/measurements",{data:data, processType:"delete"});
            if(responseData.status !== "success"){
                throw new Error("Veri silinemedi");
            }
            
            await setIsloading(false);
            toast.success("Veri başarıyla silindi");
            await getData();

        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    }

    // tabloya veri çekme fonksiyonu
    const getData = async () => {
        try {
            const response = await getAPI('/createProduct/measurements');
            setIsloading(false);
            if(response.status !== "success"){
                
                throw new Error("Veri çekilemedi 1");
            }
            // ölçülerin "firstValue" değerlerine göre küçükten büyüğe doğru sıraladık
            const sorted = [...response.data].sort((a, b) => parseInt(a.firstValue.match(/\d+/)) - parseInt(b.firstValue.match(/\d+/)));
            setMeasurements(sorted);
            
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    }
    
    // tablo başlıklarını oluşturma fonksiyonu (thead)
    const renderHead = () => {

        const tableHeaders = ["Sıra","Ölçüler","Türkçe","Ukraynaca","İngilizce","İşlemler"]
        return (
            <tr className=''>
                {tableHeaders.map((header, index) => (
                    <th key={index} scope="col" className=" text-center py-4 border-l border-white last:bg-gray-700 last:text-white p-2">
                        {header}
                    </th>
                ))}
            </tr>
        );
    };

    // tablo içeriklerini oluşturma fonksiyonu (tbody)
    const renderData = () => {
        
        return measurements ? 
        measurements.map((measurement, index) => (
            <tr key={index} className='border-b'>
                <td className='text-center py-2 border-r flex justify-center items-center h-full mt-2'>
                    <div className='bg-black text-white rounded-full flex justify-center items-center w-6 h-6 text-center'>{index + 1}</div>
                </td>
                <td className='text-center py-2 border-r'>
                    {/* ölçü giriş tipine göre gösterim belirlendiği yer */}
                    {   measurement.oneRangeEnabled ? // sadece tek değer girilebiliyorsa
                        <div>{measurement.firstValue + " " + measurement.unit}</div>

                        : measurement.twoRangeEnabled ? // iki değer girilebiliyorsa
                        <div>{measurement.firstValue + " - " + measurement.secondValue + " " + measurement.unit}</div>
                        

                        : measurement.manuelDefined && // manuel olarak string girilebiliyorsa
                        <div>{measurement.firstValue}</div>
                    } 
                </td> 
                <td className='text-center py-2 border-r'>
                    <div>{measurement.turkish}</div>
                </td>
                <td className='text-center py-2 border-r'>
                    <div>{measurement.ukrainian}</div>
                </td>
                <td className='text-center py-2 border-r'>
                    <div>{measurement.english}</div>
                </td>

                {/* Tablonun Düzenle - sil aksiyon işlemlerinin yapıldığı kısım */}
                <td className='text-center py-2 border-r'>
                    <div className='flex center justify-center items-center gap-4'>
                        <button 
                        onClick={() => {
                            // veri güncellemesi için ilk adım.
                            setUpdateData(measurement);
                        }}
                        className='shadow-md bg-blue-500 hover:bg-blue-700 text-white font-bold p-2 rounded-md min-w-[50px]'>
                            Düzenle
                        </button>
                        <button 
                        onClick={async () => {
                            setIsloading(true); // yükleniyor etkinleştirildi
                            await dataDeleteFunction(measurement); // veri silme fonksiyonu çağırıldı
                            await getData(); // güncel verileri çekme fonksiyonu çağırıldı
                        }}
                        className='shadow-md bg-red-500 hover:bg-red-700 text-white font-bold p-2  rounded-md min-w-[50px]'>
                            Sil
                        </button>
                    </div>
                </td>
            </tr>
        )) :
        <tr>
            <td>Veri yok</td>
        </tr>
    }

    return (
      <>       
        
        <div className={`
        w-full relative overflow-x-auto
        ${isloading ? " blur max-h-screen overflow-hidden" : " blur-none"}
        `}>

          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className='text-md text-gray-700 bg-gray-50 dark:bg-blue-500 dark:text-white'>
              {renderHead()}{" "}
              {/* Tablo başlık kısmını renderHeaders fonksiyonu ile oluşturur */}
            </thead>
            <tbody>
                {renderData()}{" "}  
              {/* Tablo içerik kısmını renderData fonksiyonu ile oluşturur */}
            </tbody>
          </table>
        </div>
      </>
    );
};

export default ListComponent;
