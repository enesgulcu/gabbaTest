import React from 'react'
import Image from 'next/image'
import { IoClose, IoCheckmarkDoneSharp, IoAddOutline, IoCloseOutline } from "react-icons/io5";

const VisibleImage = ({collectionImages, visibleImages, setVisibleImages}) => {
  return (
    <div>
        {visibleImages && visibleImages !== "" &&
      <div className='absolute top-0 left-0 w-full h-[2400px] lg:h-screen z-50 bg-black bg-opacity-90 flex justify-center item-start lg:items-center'>
        <div className='relative top-0 left-0 w-full flex justify-center item-center '>
          <div className=' bg-white rounded-lg min-h-screen lg:min-h-min mx-6 border-4 border-gray-600 '>
            <div className='flex flex-row flex-nowrap justify-center items-center gap-2'>
              <div className='flex flex-col justify-center items-center gap-2 p-2'>
                <div className='bg-red-600 m-2 p-2 rounded-full cursor-pointer hover:scale-105 transition hover:rotate-6 hover:border-2 hover:border-white '
                  onClick={()=>{setVisibleImages(false)}}
                  >
                    <IoClose color="white" size={40} />
                </div>
                <div>
                  <h3 className='text-xl lg:text-2xl font-semibold text-gray-700 my-2'> Koleksiyon Resimleri </h3>
                </div>
                <div className='flex flex-row flex-wrap justify-center items-center gap-6 '>
                  {collectionImages && collectionImages.length > 0 && collectionImages.map((item, index) => (
                    <div key={index} className='relative w-40 h-40 '>
                      <Image className='hover:scale-125 hover:cursor-pointer transition-all' src={item.collectionImage} layout='fill' objectFit='contain' alt="image"/>
                    </div>
                  ))}
                </div>
                <div className='lg:hidden bg-red-600 m-2 p-2 rounded-full cursor-pointer hover:scale-105 transition hover:rotate-6 hover:border-2 hover:border-white '
                  onClick={()=>{setVisibleImages(false)}}
                  >
                    <IoClose color="white" size={40} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
    </div>
  )
}

export default VisibleImage;
